import { useEffect, useState, useMemo } from "react";
import { fetchHelper } from "@/api/fetch";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Link, useRouter } from "@/lib/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Search,
  Store,
  Sparkles,
  Trash2,
  Check
} from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { getEnv } from "@/lib/env";

const imgUrl = getEnv("VITE_API_IMG_URL") || "";

interface StoreItem {
  id: number;
  storeId: number;
  templateCategoryId: number;
  order: number;
  createdAt: string;
  store: {
    id: number;
    name: { ar?: string; en?: string } | string;
    logo?: string | null;
    cover?: string | null;
    cityId?: number | null;
    cityName?: { ar?: string; en?: string } | string | null;
    branch?: {
      id: number;
      address?: string | null;
      phone?: string | null;
      isActive?: boolean;
      closed?: boolean;
    } | null;
  };
}

interface CategoryDetails {
  id: number;
  name: { ar?: string; en?: string } | string;
  image?: string | null;
  order?: number;
}

interface AvailableStore {
  id: number;
  name: { ar?: string; en?: string } | string;
  logo?: string | null;
  city?: { name?: { ar?: string; en?: string } | string } | null;
}

export default function CategoryStoresPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const categoryId = Number(params?.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<CategoryDetails | null>(null);
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [orderMap, setOrderMap] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Add Stores Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [allStoresLoading, setAllStoresLoading] = useState(false);
  const [availableStores, setAvailableStores] = useState<AvailableStore[]>([]);
  const [addSearchQuery, setAddSearchQuery] = useState("");
  const [selectedToAdd, setSelectedToAdd] = useState<number[]>([]);
  const [adding, setAdding] = useState(false);

  const resolveText = (val?: { ar?: string; en?: string } | string | null): string => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return val[locale as "ar" | "en"] || val.ar || val.en || "";
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoryRes, storesRes] = await Promise.all([
        fetchHelper<any>({
          endPoint: ["storeTemplatesCategories"],
          params: { id: categoryId },
          redirectOnUnauthorized: false
        }),
        fetchHelper<StoreItem[]>({
          endPoint: ["storeTemplatesCategories", categoryId, "stores" as any],
          redirectOnUnauthorized: false
        })
      ]);

      if (categoryRes?.data) {
        const cat = Array.isArray(categoryRes.data)
          ? categoryRes.data.find((c: any) => c.id === categoryId) || categoryRes.data[0]
          : categoryRes.data;
        if (cat) setCategory(cat);
      }

      if (storesRes?.data && Array.isArray(storesRes.data)) {
        setStores(storesRes.data);
        const map: Record<number, number> = {};
        for (const item of storesRes.data) {
          map[item.storeId] = item.order ?? 0;
        }
        setOrderMap(map);
      }
    } catch (err: any) {
      toast.error(err?.message || (isRtl ? "فشل في تحميل البيانات" : "Failed to load data"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      loadData();
    }
  }, [categoryId]);

  const loadAvailableStores = async (query = "") => {
    setAllStoresLoading(true);
    try {
      const res = await fetchHelper<any>({
        endPoint: ["stores"],
        params: {
          limit: 50,
          ...(query.trim() ? { name: query.trim() } : {})
        },
        redirectOnUnauthorized: false
      });
      if (res?.data && Array.isArray(res.data)) {
        setAvailableStores(res.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setAllStoresLoading(false);
    }
  };

  const openAddDialog = () => {
    setIsAddOpen(true);
    setSelectedToAdd([]);
    setAddSearchQuery("");
    loadAvailableStores("");
  };

  const handleOrderChange = (storeId: number, value: string) => {
    const num = parseInt(value, 10);
    setOrderMap((prev) => ({
      ...prev,
      [storeId]: isNaN(num) ? 0 : Math.max(0, num)
    }));
  };

  const moveOrder = (storeId: number, delta: number) => {
    setOrderMap((prev) => {
      const current = prev[storeId] ?? 0;
      return {
        ...prev,
        [storeId]: Math.max(0, current + delta)
      };
    });
  };

  const autoNumberFiltered = () => {
    const updated = { ...orderMap };
    filteredStores.forEach((item, index) => {
      updated[item.storeId] = index + 1;
    });
    setOrderMap(updated);
    toast.info(isRtl ? "تم الترقيم التلقائي (1, 2, 3...)" : "Auto-numbered sequentially");
  };

  const resetAllToZero = () => {
    const updated = { ...orderMap };
    stores.forEach((item) => {
      updated[item.storeId] = 0;
    });
    setOrderMap(updated);
    toast.info(isRtl ? "تم تصفير جميع الترتيبات" : "Reset all orders to 0");
  };

  const hasChanges = useMemo(() => {
    for (const item of stores) {
      if ((orderMap[item.storeId] ?? 0) !== (item.order ?? 0)) {
        return true;
      }
    }
    return false;
  }, [stores, orderMap]);

  const saveOrders = async () => {
    setSaving(true);
    try {
      const orders = Object.entries(orderMap).map(([storeId, order]) => ({
        storeId: Number(storeId),
        order: Number(order)
      }));

      const res = await fetchHelper({
        endPoint: ["storeTemplatesCategories", categoryId, "stores" as any, "order" as any],
        method: "PATCH",
        body: { orders },
        redirectOnUnauthorized: false
      });

      if (res?.success) {
        toast.success(isRtl ? "تم حفظ ترتيب المتاجر بنجاح" : "Store orders saved successfully");
        await loadData();
      } else {
        toast.error(res?.message || (isRtl ? "فشل حفظ الترتيب" : "Failed to save orders"));
      }
    } catch (err: any) {
      toast.error(err?.message || (isRtl ? "حدث خطأ غير متوقع" : "Unexpected error occurred"));
    } finally {
      setSaving(false);
    }
  };

  const handleAddStores = async () => {
    if (selectedToAdd.length === 0) return;
    setAdding(true);
    try {
      const res = await fetchHelper({
        endPoint: ["storeTemplatesCategories", categoryId, "stores" as any],
        method: "POST",
        body: { storeIds: selectedToAdd },
        redirectOnUnauthorized: false
      });

      if (res?.success) {
        toast.success(isRtl ? "تمت إضافة المتاجر بنجاح" : "Stores added successfully");
        setIsAddOpen(false);
        await loadData();
      } else {
        toast.error(res?.message || (isRtl ? "فشل إضافة المتاجر" : "Failed to add stores"));
      }
    } catch (err: any) {
      toast.error(err?.message || (isRtl ? "حدث خطأ" : "Error"));
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveStore = async (storeId: number) => {
    const confirm = window.confirm(
      isRtl ? "هل أنت متأكد من إزالة هذا المتجر من التصنيف؟" : "Are you sure you want to remove this store from this category?"
    );
    if (!confirm) return;

    try {
      const res = await fetchHelper({
        endPoint: ["storeTemplatesCategories", categoryId, "stores" as any, storeId as any],
        method: "DELETE",
        redirectOnUnauthorized: false
      });

      if (res?.success) {
        toast.success(isRtl ? "تمت إزالة المتجر من التصنيف" : "Store removed from category");
        await loadData();
      } else {
        toast.error(res?.message || (isRtl ? "فشل إزالة المتجر" : "Failed to remove store"));
      }
    } catch (err: any) {
      toast.error(err?.message || (isRtl ? "حدث خطأ" : "Error"));
    }
  };

  const toggleSelectToAdd = (storeId: number) => {
    setSelectedToAdd((prev) =>
      prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]
    );
  };

  const existingStoreIds = useMemo(() => new Set(stores.map((s) => s.storeId)), [stores]);

  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores;
    const q = searchQuery.toLowerCase().trim();
    return stores.filter((item) => {
      const nameAr = typeof item.store.name === "object" ? item.store.name?.ar?.toLowerCase() : "";
      const nameEn = typeof item.store.name === "object" ? item.store.name?.en?.toLowerCase() : "";
      const rawName = typeof item.store.name === "string" ? item.store.name.toLowerCase() : "";
      const idStr = String(item.storeId);
      return (
        idStr.includes(q) ||
        (nameAr && nameAr.includes(q)) ||
        (nameEn && nameEn.includes(q)) ||
        (rawName && rawName.includes(q))
      );
    });
  }, [stores, searchQuery]);

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
              onClick={() => router.push("/category")}
              title={isRtl ? "رجوع للتصنيفات" : "Back to categories"}
            >
              {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  {isRtl ? "إدارة متاجر التصنيف" : "Manage Category Stores"}
                </h1>
                {category && (
                  <Badge variant="secondary" className="text-sm font-semibold">
                    {resolveText(category.name)}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isRtl
                  ? "أضف المتاجر مباشرة لهذا التصنيف ورتب أولوية ظهورها عند اختيار العميل لهذا التصنيف في التطبيق."
                  : "Assign stores directly to this category and manage their display order in the customer app."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button onClick={openAddDialog} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              <span>{isRtl ? "إضافة متاجر للتصنيف" : "Add Stores"}</span>
            </Button>

            <Button
              onClick={saveOrders}
              disabled={saving || !hasChanges}
              className="gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isRtl ? "حفظ الترتيب" : "Save Order"}</span>
              {hasChanges && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              )}
            </Button>
          </div>
        </div>

        {/* Action Controls & Search */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder={isRtl ? "البحث بالاسم أو الرقم التعريفي للمتجر..." : "Search by name or store ID..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-9"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={autoNumberFiltered}
                  className="gap-1.5 text-xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>{isRtl ? "ترقيم تلقائي (1, 2, 3...)" : "Auto-number"}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetAllToZero}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isRtl ? "تصفير الكل (0)" : "Reset all"}</span>
                </Button>

                <Badge variant="outline" className="px-3 py-1 text-xs">
                  {isRtl
                    ? `إجمالي المتاجر المضافة: ${stores.length}`
                    : `Total Stores: ${stores.length}`}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {isRtl ? "جاري تحميل متاجر التصنيف..." : "Loading category stores..."}
                </p>
              </div>
            ) : filteredStores.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Store className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                <p className="text-base font-medium">
                  {searchQuery
                    ? (isRtl ? "لا توجد نتائج تطابق بحثك" : "No stores match your search")
                    : (isRtl ? "لا توجد متاجر مضافة لهذا التصنيف حتى الآن" : "No stores added to this category yet")}
                </p>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {isRtl
                    ? "اضغط على زر (إضافة متاجر للتصنيف) بالأعلى لاختيار وإضافة المطاعم والمتاجر مباشرة."
                    : "Click (Add Stores) above to directly assign restaurants and stores to this category."}
                </p>
                <Button onClick={openAddDialog} className="mt-2 gap-2">
                  <Plus className="h-4 w-4" />
                  <span>{isRtl ? "إضافة متاجر الآن" : "Add Stores Now"}</span>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-24 text-center font-bold">
                        {isRtl ? "الترتيب" : "Order"}
                      </TableHead>
                      <TableHead className="w-16 text-center">
                        {isRtl ? "الشعار" : "Logo"}
                      </TableHead>
                      <TableHead>
                        {isRtl ? "اسم المتجر" : "Store Name"}
                      </TableHead>
                      <TableHead>
                        {isRtl ? "المدينة" : "City"}
                      </TableHead>
                      <TableHead className="w-24 text-center">
                        {isRtl ? "إجراءات" : "Actions"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStores.map((item) => {
                      const currentOrder = orderMap[item.storeId] ?? 0;
                      const hasChanged = currentOrder !== (item.order ?? 0);
                      const fullLogo = item.store.logo
                        ? item.store.logo.startsWith("http")
                          ? item.store.logo
                          : `${imgUrl}${item.store.logo}`
                        : null;

                      return (
                        <TableRow
                          key={item.storeId}
                          className={hasChanged ? "bg-amber-500/5 transition-colors" : ""}
                        >
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Input
                                type="number"
                                min={0}
                                value={currentOrder}
                                onChange={(e) => handleOrderChange(item.storeId, e.target.value)}
                                className={`w-16 text-center font-bold text-sm h-8 ${
                                  hasChanged ? "border-amber-500 ring-1 ring-amber-500" : ""
                                }`}
                              />
                              <div className="flex flex-col">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 text-muted-foreground hover:text-foreground"
                                  onClick={() => moveOrder(item.storeId, 1)}
                                >
                                  <ChevronUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 text-muted-foreground hover:text-foreground"
                                  onClick={() => moveOrder(item.storeId, -1)}
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-center">
                            <div className="w-10 h-10 rounded-full border overflow-hidden mx-auto bg-muted/40 flex items-center justify-center">
                              {fullLogo ? (
                                <img
                                  src={fullLogo}
                                  alt={resolveText(item.store.name)}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Store className="w-5 h-5 text-muted-foreground/60" />
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm">
                                {resolveText(item.store.name)}
                              </span>
                              <span className="text-xs text-muted-foreground font-mono">
                                ID: #{item.storeId}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {resolveText(item.store.cityName) || "—"}
                            </span>
                          </TableCell>

                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveStore(item.storeId)}
                              className="text-destructive hover:bg-destructive/10 h-8 w-8"
                              title={isRtl ? "إزالة من التصنيف" : "Remove from category"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

      {/* Add Stores Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              <span>{isRtl ? "إضافة متاجر إلى التصنيف" : "Add Stores to Category"}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-2 flex-1 overflow-hidden flex flex-col">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={isRtl ? "ابحث باسم المتجر..." : "Search store name..."}
                value={addSearchQuery}
                onChange={(e) => {
                  setAddSearchQuery(e.target.value);
                  loadAvailableStores(e.target.value);
                }}
                className="pr-9"
              />
            </div>

            <div className="flex-1 overflow-y-auto border rounded-md divide-y max-h-[400px]">
              {allStoresLoading ? (
                <div className="py-12 flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : availableStores.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  {isRtl ? "لا توجد متاجر مطابقة" : "No stores found"}
                </div>
              ) : (
                availableStores.map((store) => {
                  const isAlreadyAdded = existingStoreIds.has(store.id);
                  const isSelected = selectedToAdd.includes(store.id);
                  const logo = store.logo
                    ? store.logo.startsWith("http")
                      ? store.logo
                      : `${imgUrl}${store.logo}`
                    : null;

                  return (
                    <div
                      key={store.id}
                      onClick={() => {
                        if (!isAlreadyAdded) toggleSelectToAdd(store.id);
                      }}
                      className={`flex items-center justify-between p-3 transition-colors ${
                        isAlreadyAdded
                          ? "opacity-50 cursor-not-allowed bg-muted/20"
                          : isSelected
                          ? "bg-primary/10 cursor-pointer"
                          : "hover:bg-muted/40 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full border overflow-hidden bg-muted/40 flex items-center justify-center shrink-0">
                          {logo ? (
                            <img
                              src={logo}
                              alt={resolveText(store.name)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Store className="w-4 h-4 text-muted-foreground/60" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            {resolveText(store.name)}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            ID: #{store.id} {store.city?.name ? `• ${resolveText(store.city.name)}` : ""}
                          </p>
                        </div>
                      </div>

                      <div>
                        {isAlreadyAdded ? (
                          <Badge variant="outline" className="text-xs">
                            {isRtl ? "مضاف بالفعل" : "Already added"}
                          </Badge>
                        ) : (
                          <div
                            className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-muted-foreground/40"
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4" />}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              {isRtl
                ? `تم تحديد ${selectedToAdd.length} متجر`
                : `${selectedToAdd.length} stores selected`}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                disabled={adding}
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleAddStores}
                disabled={adding || selectedToAdd.length === 0}
                className="gap-2"
              >
                {adding && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{isRtl ? "إضافة المتاجر المحددة" : "Add Selected"}</span>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
