"use client";

import { fetchHelper } from "@/api/fetch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApiQuery } from "@/hooks/useApiQuery";
import {
  BadgePercent,
  Loader2,
  PlusCircle,
  Tag,
  Trash2,
  ToggleRight,
  Gift,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type PromoScope,
  type DiscountType,
  type DeliveryPromotion,
  resolveBadgeText,
  SCOPE_BADGE_CLASS,
  SCOPE_LABEL,
} from "./delivery-promotions-utils";



// ---------------------------------------------------------------------------
// Default form state
// ---------------------------------------------------------------------------

interface FormState {
  name: string;
  badgeText: string;
  scope: PromoScope;
  discountType: DiscountType;
  promoValue: string;
  storeId: string;
  zoneId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const DEFAULT_FORM: FormState = {
  name: "",
  badgeText: "",
  scope: "GLOBAL",
  discountType: "DISCOUNT_AMOUNT",
  promoValue: "",
  storeId: "",
  zoneId: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DeliveryPromotionsTab() {
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteDialogId, setDeleteDialogId] = useState<number | null>(null);

  // ── Data fetch ─────────────────────────────────────────────────────────
  const {
    data: response,
    refetch,
    isLoading,
  } = useApiQuery({
    queryKey: ["delivery-promotions"],
    endPoint: ["deliveryPromotions"],
    staleTime: 0,
  });

  const promotions: DeliveryPromotion[] =
    (response?.data as DeliveryPromotion[]) ?? [];

  // ── Create ─────────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error("اسم العرض مطلوب");
      return;
    }
    const promoValueNum = parseFloat(form.promoValue);
    if (isNaN(promoValueNum) || promoValueNum < 0) {
      toast.error("قيمة العرض يجب أن تكون رقمًا صحيحًا ≥ 0");
      return;
    }

    const body: Record<string, unknown> = {
      name: form.name.trim(),
      badgeText: form.badgeText.trim() || null,
      scope: form.scope,
      discountType: form.discountType,
      promoValue: promoValueNum,
      isActive: form.isActive,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    };

    if (form.scope === "STORE" || form.scope === "STORE_ZONE") {
      const sid = parseInt(form.storeId, 10);
      if (isNaN(sid)) {
        toast.error("معرّف المتجر مطلوب لهذا النطاق");
        return;
      }
      body.storeId = sid;
    }
    if (form.scope === "ZONE" || form.scope === "STORE_ZONE") {
      const zid = parseInt(form.zoneId, 10);
      if (isNaN(zid)) {
        toast.error("معرّف المنطقة مطلوب لهذا النطاق");
        return;
      }
      body.zoneId = zid;
    }

    setIsSubmitting(true);
    const res = await fetchHelper({
      endPoint: ["deliveryPromotions"],
      method: "POST",
      body,
    });

    if (res?.success) {
      toast.success("تم إنشاء العرض بنجاح");
      setCreateOpen(false);
      setForm(DEFAULT_FORM);
      refetch();
    } else {
      toast.error(res?.result?.message ?? res?.message ?? "حدث خطأ ما");
    }
    setIsSubmitting(false);
  };

  // ── Toggle active ───────────────────────────────────────────────────────
  const handleToggle = async (id: number) => {
    setTogglingId(id);
    const res = await fetchHelper({
      endPoint: ["deliveryPromotions", id, "toggle"],
      method: "PATCH",
    });

    if (res?.success) {
      toast.success("تم تحديث حالة العرض");
      refetch();
    } else {
      toast.error(res?.result?.message ?? res?.message ?? "حدث خطأ ما");
    }
    setTogglingId(null);
  };

  // ── Delete ──────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    const res = await fetchHelper({
      endPoint: ["deliveryPromotions", id],
      method: "DELETE",
    });

    if (res?.success) {
      toast.success("تم حذف العرض");
      setDeleteDialogId(null);
      refetch();
    } else {
      toast.error(res?.result?.message ?? res?.message ?? "حدث خطأ ما");
    }
    setDeletingId(null);
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              عروض التوصيل والحملات
            </CardTitle>
            <CardDescription className="mt-1">
              إدارة عروض التوصيل المخفض وتحديد نطاق كل عرض
            </CardDescription>
          </div>

          {/* Create Button + Dialog */}
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1.5 shrink-0">
                <PlusCircle className="h-4 w-4" />
                إنشاء عرض جديد
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>إنشاء عرض توصيل جديد</DialogTitle>
                <DialogDescription>
                  أدخل تفاصيل العرض — النطاق والقيمة وفترة الصلاحية
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="promo-name">
                    اسم العرض <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="promo-name"
                    placeholder="مثال: عرض التوصيل المجاني"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </div>

                {/* Badge Text */}
                <div className="space-y-1.5">
                  <Label htmlFor="promo-badge">نص الشارة (اختياري)</Label>
                  <Input
                    id="promo-badge"
                    placeholder="توصيل مخفض لفترة محدودة"
                    value={form.badgeText}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, badgeText: e.target.value }))
                    }
                  />
                </div>

                {/* Scope */}
                <div className="space-y-1.5">
                  <Label htmlFor="promo-scope">نطاق العرض</Label>
                  <Select
                    value={form.scope}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, scope: v as PromoScope }))
                    }
                  >
                    <SelectTrigger id="promo-scope">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GLOBAL">عام (كل المتاجر والمناطق)</SelectItem>
                      <SelectItem value="STORE">متجر محدد</SelectItem>
                      <SelectItem value="ZONE">منطقة محددة</SelectItem>
                      <SelectItem value="STORE_ZONE">متجر + منطقة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* StoreId — conditional */}
                {(form.scope === "STORE" || form.scope === "STORE_ZONE") && (
                  <div className="space-y-1.5">
                    <Label htmlFor="promo-store-id">
                      معرّف المتجر <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="promo-store-id"
                      type="number"
                      min={1}
                      placeholder="أدخل ID المتجر"
                      value={form.storeId}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, storeId: e.target.value }))
                      }
                    />
                  </div>
                )}

                {/* ZoneId — conditional */}
                {(form.scope === "ZONE" || form.scope === "STORE_ZONE") && (
                  <div className="space-y-1.5">
                    <Label htmlFor="promo-zone-id">
                      معرّف المنطقة <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="promo-zone-id"
                      type="number"
                      min={1}
                      placeholder="أدخل ID المنطقة"
                      value={form.zoneId}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, zoneId: e.target.value }))
                      }
                    />
                  </div>
                )}

                {/* Discount Type */}
                <div className="space-y-1.5">
                  <Label htmlFor="promo-type">نوع الخصم</Label>
                  <Select
                    value={form.discountType}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, discountType: v as DiscountType }))
                    }
                  >
                    <SelectTrigger id="promo-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FIXED_PRICE">سعر ثابت للتوصيل</SelectItem>
                      <SelectItem value="DISCOUNT_AMOUNT">خصم بمبلغ محدد</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Promo Value */}
                <div className="space-y-1.5">
                  <Label htmlFor="promo-value">
                    قيمة العرض (ج.م){" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="promo-value"
                    type="number"
                    min={0}
                    step={0.5}
                    placeholder="0"
                    value={form.promoValue}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, promoValue: e.target.value }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    {form.discountType === "FIXED_PRICE"
                      ? "سيكون هذا هو سعر التوصيل النهائي للعميل"
                      : "سيتم خصم هذا المبلغ من سعر التوصيل الأساسي"}
                  </p>
                </div>

                {/* Start / End Date */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="promo-start">تاريخ البداية (اختياري)</Label>
                    <Input
                      id="promo-start"
                      type="datetime-local"
                      value={form.startDate}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, startDate: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="promo-end">تاريخ النهاية (اختياري)</Label>
                    <Input
                      id="promo-end"
                      type="datetime-local"
                      value={form.endDate}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, endDate: e.target.value }))
                      }
                    />
                  </div>
                </div>

                {/* Is Active */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border">
                  <Switch
                    id="promo-active"
                    checked={form.isActive}
                    onCheckedChange={(v) =>
                      setForm((f) => ({ ...f, isActive: v }))
                    }
                  />
                  <Label htmlFor="promo-active" className="cursor-pointer">
                    {form.isActive ? "العرض نشط" : "العرض معطّل"}
                  </Label>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCreateOpen(false);
                    setForm(DEFAULT_FORM);
                  }}
                  disabled={isSubmitting}
                >
                  إلغاء
                </Button>
                <Button onClick={handleCreate} disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  )}
                  إنشاء العرض
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : promotions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <Gift className="h-7 w-7" />
            </div>
            <p className="text-sm text-muted-foreground">
              لا توجد عروض توصيل حتى الآن — أنشئ أول عرض الآن
            </p>
          </div>
        ) : (
          <div className="rounded-xl border overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>الشارة</TableHead>
                  <TableHead>النطاق</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead className="text-center">القيمة</TableHead>
                  <TableHead className="text-center">المتجر</TableHead>
                  <TableHead className="text-center">المنطقة</TableHead>
                  <TableHead>البداية</TableHead>
                  <TableHead>النهاية</TableHead>
                  <TableHead className="text-center">نشط</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {promotions.map((promo) => (
                  <TableRow key={promo.id}>
                    {/* Name */}
                    <TableCell className="font-medium text-sm min-w-[140px]">
                      {promo.name}
                    </TableCell>

                    {/* Badge Text */}
                    <TableCell className="text-xs text-muted-foreground min-w-[160px]">
                      {resolveBadgeText(promo.badgeText)}
                    </TableCell>

                    {/* Scope Badge */}
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${SCOPE_BADGE_CLASS[promo.scope]}`}
                      >
                        {SCOPE_LABEL[promo.scope]}
                      </span>
                    </TableCell>

                    {/* Discount Type Icon */}
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-xs">
                        {promo.discountType === "FIXED_PRICE" ? (
                          <>
                            <Tag className="h-3.5 w-3.5 text-blue-500" />
                            <span>سعر ثابت</span>
                          </>
                        ) : (
                          <>
                            <BadgePercent className="h-3.5 w-3.5 text-emerald-500" />
                            <span>خصم بمبلغ</span>
                          </>
                        )}
                      </span>
                    </TableCell>

                    {/* Value */}
                    <TableCell className="text-center font-semibold text-sm">
                      {promo.promoValue} ج.م
                    </TableCell>

                    {/* Store ID */}
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {promo.storeId ?? "—"}
                    </TableCell>

                    {/* Zone ID */}
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {promo.zoneId ?? "—"}
                    </TableCell>

                    {/* Start */}
                    <TableCell className="text-xs whitespace-nowrap">
                      {promo.startDate
                        ? new Date(promo.startDate).toLocaleDateString("ar-EG")
                        : "—"}
                    </TableCell>

                    {/* End */}
                    <TableCell className="text-xs whitespace-nowrap">
                      {promo.endDate
                        ? new Date(promo.endDate).toLocaleDateString("ar-EG")
                        : "—"}
                    </TableCell>

                    {/* Active Toggle */}
                    <TableCell className="text-center">
                      {togglingId === promo.id ? (
                        <Loader2 className="h-4 w-4 animate-spin mx-auto text-primary" />
                      ) : (
                        <Switch
                          checked={promo.isActive}
                          onCheckedChange={() => handleToggle(promo.id)}
                          aria-label={`تفعيل/إيقاف ${promo.name}`}
                        />
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Toggle button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => handleToggle(promo.id)}
                          disabled={togglingId === promo.id}
                          title={promo.isActive ? "إيقاف العرض" : "تفعيل العرض"}
                        >
                          <ToggleRight className="h-4 w-4" />
                        </Button>

                        {/* Delete button + confirm dialog */}
                        <Dialog
                          open={deleteDialogId === promo.id}
                          onOpenChange={(open) =>
                            setDeleteDialogId(open ? promo.id : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              title="حذف العرض"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="sm:max-w-sm">
                            <DialogHeader>
                              <DialogTitle>حذف العرض</DialogTitle>
                              <DialogDescription>
                                هل أنت متأكد من حذف العرض «{promo.name}»؟ لا
                                يمكن التراجع عن هذا الإجراء.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setDeleteDialogId(null)}
                                disabled={deletingId === promo.id}
                              >
                                إلغاء
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(promo.id)}
                                disabled={deletingId === promo.id}
                              >
                                {deletingId === promo.id && (
                                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                                )}
                                حذف
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
