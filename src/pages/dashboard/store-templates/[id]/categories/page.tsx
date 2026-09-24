import { useEffect, useState, useMemo } from "react";
import { fetchHelper } from "@/api/fetch";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Link, useRouter } from "@/lib/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Edit,
  Layers,
  Loader2,
  Plus,
  Search,
  Store,
  Trash2,
  Upload
} from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { getEnv } from "@/lib/env";

const imgUrl = getEnv("VITE_API_IMG_URL") || "";

interface TemplateCategoryItem {
  id: number;
  name: { ar?: string; en?: string } | string;
  image?: string | null;
  order: number;
  templateId: number;
  active?: boolean;
}

interface TemplateDetails {
  id: number;
  name: { ar?: string; en?: string } | string;
  image?: string | null;
  moduleType?: string | null;
}

export default function TemplateCategoriesPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const templateId = Number(params?.id);

  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<TemplateDetails | null>(null);
  const [categories, setCategories] = useState<TemplateCategoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Create Category Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [categoryOrder, setCategoryOrder] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Edit Category Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<TemplateCategoryItem | null>(null);
  const [editNameAr, setEditNameAr] = useState("");
  const [editNameEn, setEditNameEn] = useState("");
  const [editOrder, setEditOrder] = useState<number>(0);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const resolveText = (val?: { ar?: string; en?: string } | string | null): string => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return val[locale as "ar" | "en"] || val.ar || val.en || "";
  };

  const getAr = (val?: { ar?: string; en?: string } | string | null): string => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return val.ar || "";
  };

  const getEn = (val?: { ar?: string; en?: string } | string | null): string => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return val.en || "";
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [templateRes, categoriesRes] = await Promise.all([
        fetchHelper<TemplateDetails>({
          endPoint: ["storeTemplates", templateId],
          redirectOnUnauthorized: false
        }),
        fetchHelper<TemplateCategoryItem[]>({
          endPoint: ["storeTemplatesCategories"],
          params: { templateId, limit: 100 },
          redirectOnUnauthorized: false
        })
      ]);

      if (templateRes?.data) {
        setTemplate(templateRes.data);
      }

      if (categoriesRes?.data && Array.isArray(categoriesRes.data)) {
        setCategories(categoriesRes.data);
      }
    } catch (err: any) {
      toast.error(err?.message || (isRtl ? "فشل في تحميل البيانات" : "Failed to load data"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (templateId) {
      loadData();
    }
  }, [templateId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEditMode = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isEditMode) {
        setEditFile(file);
        setEditImagePreview(URL.createObjectURL(file));
      } else {
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const openCreateDialog = () => {
    setNameAr("");
    setNameEn("");
    setCategoryOrder(categories.length + 1);
    setSelectedFile(null);
    setImagePreview(null);
    setIsCreateOpen(true);
  };

  const openEditDialog = (cat: TemplateCategoryItem) => {
    setEditingCat(cat);
    setEditNameAr(getAr(cat.name));
    setEditNameEn(getEn(cat.name));
    setEditOrder(cat.order ?? 0);
    setEditFile(null);
    setEditImagePreview(
      cat.image
        ? cat.image.startsWith("http")
          ? cat.image
          : `${imgUrl}${cat.image}`
        : null
    );
    setIsEditOpen(true);
  };

  const handleCreateCategory = async () => {
    if (!nameAr.trim() && !nameEn.trim()) {
      toast.error(isRtl ? "يرجى كتابة اسم الفئة" : "Please provide a category name");
      return;
    }

    setCreating(true);
    try {
      const fd = new FormData();
      fd.append(
        "name",
        JSON.stringify({
          ar: nameAr.trim() || nameEn.trim(),
          en: nameEn.trim() || nameAr.trim()
        })
      );
      fd.append("order", String(categoryOrder));
      if (selectedFile) {
        fd.append("image", selectedFile);
      }

      const res = await fetchHelper({
        endPoint: ["storeTemplates", templateId, "/categories" as any],
        method: "POST",
        body: fd,
        redirectOnUnauthorized: false
      });

      if (res?.success) {
        toast.success(isRtl ? "تمت إضافة الفئة بنجاح" : "Category created successfully");
        setIsCreateOpen(false);
        await loadData();
      } else {
        toast.error(res?.message || (isRtl ? "فشل إنشاء الفئة" : "Failed to create category"));
      }
    } catch (err: any) {
      toast.error(err?.message || (isRtl ? "حدث خطأ غير متوقع" : "Unexpected error occurred"));
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCat) return;
    if (!editNameAr.trim() && !editNameEn.trim()) {
      toast.error(isRtl ? "يرجى كتابة اسم الفئة" : "Please provide a category name");
      return;
    }

    setUpdating(true);
    try {
      const fd = new FormData();
      fd.append(
        "name",
        JSON.stringify({
          ar: editNameAr.trim() || editNameEn.trim(),
          en: editNameEn.trim() || editNameAr.trim()
        })
      );
      fd.append("order", String(editOrder));
      if (editFile) {
        fd.append("image", editFile);
      }

      const res = await fetchHelper({
        endPoint: ["storeTemplatesCategories", editingCat.id],
        method: "PATCH",
        body: fd,
        redirectOnUnauthorized: false
      });

      if (res?.success) {
        toast.success(isRtl ? "تم تحديث الفئة بنجاح" : "Category updated successfully");
        setIsEditOpen(false);
        setEditingCat(null);
        await loadData();
      } else {
        toast.error(res?.message || (isRtl ? "فشل تحديث الفئة" : "Failed to update category"));
      }
    } catch (err: any) {
      toast.error(err?.message || (isRtl ? "حدث خطأ" : "Error"));
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteCategory = async (catId: number) => {
    const confirm = window.confirm(
      isRtl ? "هل أنت متأكد من حذف هذه الفئة من القسم؟" : "Are you sure you want to delete this category?"
    );
    if (!confirm) return;

    try {
      const res = await fetchHelper({
        endPoint: ["storeTemplatesCategories", catId],
        method: "DELETE",
        redirectOnUnauthorized: false
      });

      if (res?.success) {
        toast.success(isRtl ? "تم حذف الفئة بنجاح" : "Category deleted successfully");
        await loadData();
      } else {
        toast.error(res?.message || (isRtl ? "فشل حذف الفئة" : "Failed to delete category"));
      }
    } catch (err: any) {
      toast.error(err?.message || (isRtl ? "حدث خطأ" : "Error"));
    }
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter((item) => {
      const nameArStr = getAr(item.name).toLowerCase();
      const nameEnStr = getEn(item.name).toLowerCase();
      const raw = typeof item.name === "string" ? item.name.toLowerCase() : "";
      return nameArStr.includes(q) || nameEnStr.includes(q) || raw.includes(q);
    });
  }, [categories, searchQuery]);

  return (
    <>
      <CustomHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/store-templates")}
              title={isRtl ? "رجوع للأقسام" : "Back to sections"}
            >
              {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  {isRtl ? "فئات قسم" : "Categories of"}:
                </h1>
                {template && (
                  <Badge variant="secondary" className="text-base px-3 py-1 font-bold bg-primary/10 text-primary">
                    {resolveText(template.name)}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isRtl
                  ? "أضف فئات هذا القسم (مثل: كشري، قهوة تركي، حلويات، مشويات) ثم اضغط على (متاجر الفئة) لربط المطاعم بها مباشرة."
                  : "Add categories for this section, then click (Category Stores) to link restaurants directly."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              <span>{isRtl ? "إضافة فئة جديدة للقسم" : "Add Category"}</span>
            </Button>
          </div>
        </div>

        {/* Content Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder={isRtl ? "البحث في فئات القسم..." : "Search categories..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>

              <Badge variant="outline" className="px-3 py-1 text-xs self-end sm:self-auto">
                {isRtl
                  ? `إجمالي الفئات: ${categories.length}`
                  : `Total Categories: ${categories.length}`}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {isRtl ? "جاري تحميل فئات القسم..." : "Loading categories..."}
                </p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Layers className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                <p className="text-base font-medium">
                  {searchQuery
                    ? (isRtl ? "لا توجد نتائج تطابق بحثك" : "No matching categories")
                    : (isRtl ? "لا توجد فئات مضافة لهذا القسم حتى الآن" : "No categories in this section yet")}
                </p>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {isRtl
                    ? "ابدأ بإضافة أول فئة لهذا القسم، ثم اربط بها المطاعم التي ترغب في ظهورها."
                    : "Start by adding the first category to this section and link restaurants to it."}
                </p>
                <Button onClick={openCreateDialog} className="mt-2 gap-2">
                  <Plus className="h-4 w-4" />
                  <span>{isRtl ? "إضافة فئة الآن" : "Add Category Now"}</span>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-16 text-center">
                        {isRtl ? "الصورة" : "Image"}
                      </TableHead>
                      <TableHead>
                        {isRtl ? "اسم الفئة (عربي)" : "Name (AR)"}
                      </TableHead>
                      <TableHead>
                        {isRtl ? "اسم الفئة (إنجليزي)" : "Name (EN)"}
                      </TableHead>
                      <TableHead className="w-20 text-center font-bold">
                        {isRtl ? "الترتيب" : "Order"}
                      </TableHead>
                      <TableHead className="text-center font-bold">
                        {isRtl ? "المطاعم المرتبطة" : "Linked Stores"}
                      </TableHead>
                      <TableHead className="w-28 text-center">
                        {isRtl ? "إجراءات" : "Actions"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((cat) => {
                      const fullImage = cat.image
                        ? cat.image.startsWith("http")
                          ? cat.image
                          : `${imgUrl}${cat.image}`
                        : null;

                      return (
                        <TableRow key={cat.id}>
                          <TableCell className="text-center">
                            <div className="w-12 h-12 rounded-full border overflow-hidden mx-auto bg-muted/40 flex items-center justify-center">
                              {fullImage ? (
                                <img
                                  src={fullImage}
                                  alt={resolveText(cat.name)}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Layers className="w-5 h-5 text-muted-foreground/60" />
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="font-bold text-sm">
                              {getAr(cat.name) || resolveText(cat.name)}
                            </span>
                          </TableCell>

                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {getEn(cat.name) || "—"}
                            </span>
                          </TableCell>

                          <TableCell className="text-center font-mono font-bold">
                            {cat.order ?? 0}
                          </TableCell>

                          <TableCell className="text-center">
                            <Link
                              href={`/category/${cat.id}/stores`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors shadow-xs"
                            >
                              <Store className="w-3.5 h-3.5" />
                              <span>{isRtl ? "إدارة وتحديد المطاعم" : "Manage Stores"}</span>
                            </Link>
                          </TableCell>

                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(cat)}
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                title={isRtl ? "تعديل الفئة" : "Edit category"}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                title={isRtl ? "حذف الفئة" : "Delete category"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Category Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              <span>{isRtl ? "إضافة فئة جديدة لهذا القسم" : "Add Category to Section"}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="nameAr">{isRtl ? "اسم الفئة (بالعربي)" : "Name (AR)"} *</Label>
                <Input
                  id="nameAr"
                  placeholder={isRtl ? "مثال: قهوة تركي" : "e.g. Turkish Coffee"}
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nameEn">{isRtl ? "اسم الفئة (بالإنجليزي)" : "Name (EN)"}</Label>
                <Input
                  id="nameEn"
                  placeholder="e.g. Turkish Coffee"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="order">{isRtl ? "ترتيب الظهور" : "Sort Order"}</Label>
              <Input
                id="order"
                type="number"
                min={0}
                value={categoryOrder}
                onChange={(e) => setCategoryOrder(Number(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>{isRtl ? "صورة الفئة / الطبق (دائرية في التطبيق)" : "Category Photo"}</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden bg-muted/20 shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground/40" />
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, false)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={creating}>
              {isRtl ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={handleCreateCategory} disabled={creating} className="gap-2">
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isRtl ? "إنشاء الفئة" : "Create Category"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              <span>{isRtl ? "تعديل الفئة" : "Edit Category"}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="editNameAr">{isRtl ? "اسم الفئة (بالعربي)" : "Name (AR)"} *</Label>
                <Input
                  id="editNameAr"
                  value={editNameAr}
                  onChange={(e) => setEditNameAr(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="editNameEn">{isRtl ? "اسم الفئة (بالإنجليزي)" : "Name (EN)"}</Label>
                <Input
                  id="editNameEn"
                  value={editNameEn}
                  onChange={(e) => setEditNameEn(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="editOrder">{isRtl ? "ترتيب الظهور" : "Sort Order"}</Label>
              <Input
                id="editOrder"
                type="number"
                min={0}
                value={editOrder}
                onChange={(e) => setEditOrder(Number(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>{isRtl ? "تغيير الصورة" : "Change Photo"}</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden bg-muted/20 shrink-0">
                  {editImagePreview ? (
                    <img src={editImagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground/40" />
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, true)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t">
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={updating}>
              {isRtl ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={handleUpdateCategory} disabled={updating} className="gap-2">
              {updating && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isRtl ? "حفظ التعديلات" : "Save Changes"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
