"use client";

import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Send,
  Loader2,
  ImagePlus,
  X,
  Users,
  Store,
  Truck,
  Globe,
  UserCheck,
  Link2,
} from "lucide-react";
import { fetchHelper } from "@/api/fetch";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
type TargetType = "ALL" | "CUSTOMER" | "STORE" | "DELIVERY" | "SELECTED_USERS";
type ClickTargetType =
  | ""
  | "STORE"
  | "CATEGORY"
  | "SERVICE"
  | "ZONE"
  | "ORDER"
  | "COUPON"
  | "EXTERNAL_URL"
  | "SPECIAL_DRIVER";

interface NotificationResult {
  sentCount: number;
  failedCount: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TARGET_OPTIONS: { value: TargetType; label: string; icon: React.ReactNode }[] = [
  { value: "ALL", label: "الكل (جميع المستخدمين)", icon: <Globe className="h-4 w-4" /> },
  { value: "CUSTOMER", label: "العملاء فقط", icon: <Users className="h-4 w-4" /> },
  { value: "STORE", label: "المتاجر فقط", icon: <Store className="h-4 w-4" /> },
  { value: "DELIVERY", label: "المندوبون فقط", icon: <Truck className="h-4 w-4" /> },
  { value: "SELECTED_USERS", label: "مستخدمون محددون", icon: <UserCheck className="h-4 w-4" /> },
];

const CLICK_TARGET_OPTIONS: { value: ClickTargetType; label: string }[] = [
  { value: "", label: "بدون توجيه" },
  { value: "STORE", label: "محل بعينه" },
  { value: "CATEGORY", label: "فئة" },
  { value: "SERVICE", label: "منتج/خدمة" },
  { value: "ZONE", label: "منطقة" },
  { value: "ORDER", label: "طلب" },
  { value: "COUPON", label: "كوبون" },
  { value: "EXTERNAL_URL", label: "رابط خارجي" },
  { value: "SPECIAL_DRIVER", label: "مندوب خاص" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function SendNotificationForm() {
  // Form state
  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [body, setBody] = useState("");
  const [targetType, setTargetType] = useState<TargetType>("ALL");
  const [selectedUserIds, setSelectedUserIds] = useState("");
  const [clickTargetType, setClickTargetType] = useState<ClickTargetType>("");
  const [clickStoreId, setClickStoreId] = useState("");
  const [clickUrl, setClickUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Submission state
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NotificationResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Image handling ──────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Reset form ──────────────────────────────────────────────────────────────
  const resetForm = () => {
    setTitleAr("");
    setTitleEn("");
    setBody("");
    setTargetType("ALL");
    setSelectedUserIds("");
    setClickTargetType("");
    setClickStoreId("");
    setClickUrl("");
    removeImage();
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titleAr.trim() && !titleEn.trim()) {
      toast.error("يجب إدخال عنوان الإشعار");
      return;
    }
    if (!body.trim()) {
      toast.error("يجب إدخال نص الإشعار");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      let payload: FormData | Record<string, any>;

      // Build title — send as object if both languages provided
      const title =
        titleAr && titleEn
          ? { ar: titleAr, en: titleEn }
          : titleAr || titleEn;

      // Build userIds array if SELECTED_USERS
      const targetUserIds =
        targetType === "SELECTED_USERS" && selectedUserIds.trim()
          ? selectedUserIds
              .split(",")
              .map((id) => parseInt(id.trim(), 10))
              .filter((n) => !isNaN(n))
          : undefined;

      if (imageFile) {
        // multipart/form-data
        const fd = new FormData();
        fd.append(
          "title",
          typeof title === "object" ? JSON.stringify(title) : title
        );
        fd.append("body", body);
        fd.append("targetType", targetType);
        if (targetUserIds?.length) {
          targetUserIds.forEach((id) => fd.append("targetUserIds[]", String(id)));
        }
        if (clickTargetType) fd.append("clickTargetType", clickTargetType);
        if (clickStoreId) fd.append("clickStoreId", clickStoreId);
        if (clickUrl) fd.append("clickUrl", clickUrl);
        fd.append("image", imageFile);
        payload = fd as any;
      } else {
        // application/json
        payload = {
          title,
          body,
          targetType,
          ...(targetUserIds?.length ? { targetUserIds } : {}),
          ...(clickTargetType ? { clickTargetType } : {}),
          ...(clickStoreId ? { clickStoreId: Number(clickStoreId) } : {}),
          ...(clickUrl ? { clickUrl } : {}),
        };
      }

      const res = await fetchHelper({
        endPoint: ["adminNotifications"],
        method: "POST",
        body: payload,
      });

      if (!res?.success && res?.status !== true) throw res;

      const data = res?.data as NotificationResult | undefined;
      setResult(data ?? { sentCount: 0, failedCount: 0 });

      toast.success("✅ تم إرسال الإشعار بنجاح!", {
        description: `أُرسل إلى ${data?.sentCount ?? 0} مستخدم`,
      });

      resetForm();
    } catch (error: any) {
      console.error("Notification send failed:", error);
      toast.error("حدث خطأ أثناء إرسال الإشعار", {
        description:
          error?.result?.message ||
          error?.message ||
          "تأكد من الصلاحيات وحاول مجدداً",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const needsClickId = ["STORE", "CATEGORY", "SERVICE", "ZONE", "ORDER", "COUPON"].includes(
    clickTargetType
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto" dir="rtl">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
          <Bell className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">إرسال إشعار</h1>
          <p className="text-sm text-muted-foreground">أرسل إشعاراً فورياً للمستخدمين</p>
        </div>
      </div>

      {/* ── Result Card ── */}
      {result && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="pt-5 flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">{result.sentCount}</p>
              <p className="text-xs text-muted-foreground mt-1">تم الإرسال</p>
            </div>
            {result.failedCount > 0 && (
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">{result.failedCount}</p>
                <p className="text-xs text-muted-foreground mt-1">فشل الإرسال</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Notification Content ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            محتوى الإشعار
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title Arabic */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              عنوان الإشعار (عربي) <span className="text-destructive">*</span>
            </Label>
            <Input
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder="أدخل العنوان بالعربي"
              className="h-10 text-sm rounded-xl"
              dir="rtl"
            />
          </div>

          {/* Title English */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              عنوان الإشعار (إنجليزي) — اختياري
            </Label>
            <Input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Enter notification title in English"
              className="h-10 text-sm rounded-xl"
              dir="ltr"
            />
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              نص الإشعار <span className="text-destructive">*</span>
            </Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="اكتب نص الإشعار الذي سيراه المستخدمون..."
              className="min-h-[100px] text-sm rounded-xl resize-none"
              dir="rtl"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              صورة مرفقة — اختياري
            </Label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="preview"
                  className="h-32 w-auto rounded-xl object-cover border border-border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -left-2 bg-destructive text-white rounded-full p-0.5 shadow"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-border rounded-xl text-xs text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                <ImagePlus className="h-4 w-4" />
                رفع صورة للإشعار
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Target Audience ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            الجمهور المستهدف
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Target Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">
              نوع المستهدفين <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TARGET_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTargetType(opt.value)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-right ${
                    targetType === opt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/20 text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected User IDs */}
          {targetType === "SELECTED_USERS" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                معرّفات المستخدمين (IDs) — مفصولة بفواصل
              </Label>
              <Input
                value={selectedUserIds}
                onChange={(e) => setSelectedUserIds(e.target.value)}
                placeholder="مثال: 1, 2, 3, 150"
                className="h-10 text-sm rounded-xl font-mono"
                dir="ltr"
              />
              <p className="text-[11px] text-muted-foreground">
                أدخل الـ ID الخاص بكل مستخدم مفصولاً بفاصلة
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Click Action (Optional) ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            توجيه الضغط على الإشعار — اختياري
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Click Target Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              عند الضغط على الإشعار يتوجه إلى
            </Label>
            <Select
              value={clickTargetType}
              onValueChange={(v) => {
                setClickTargetType(v as ClickTargetType);
                setClickStoreId("");
                setClickUrl("");
              }}
            >
              <SelectTrigger className="h-10 rounded-xl text-sm">
                <SelectValue placeholder="اختر وجهة الضغط (اختياري)" />
              </SelectTrigger>
              <SelectContent>
                {CLICK_TARGET_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value || "__none__"}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Click Store ID (when applicable) */}
          {needsClickId && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                معرّف{" "}
                {clickTargetType === "STORE"
                  ? "المحل"
                  : clickTargetType === "ORDER"
                  ? "الطلب"
                  : clickTargetType === "COUPON"
                  ? "الكوبون"
                  : "العنصر"}{" "}
                (ID)
              </Label>
              <Input
                value={clickStoreId}
                onChange={(e) => setClickStoreId(e.target.value)}
                placeholder="أدخل الـ ID"
                className="h-10 text-sm rounded-xl font-mono"
                dir="ltr"
                type="number"
              />
            </div>
          )}

          {/* External URL */}
          {clickTargetType === "EXTERNAL_URL" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">الرابط الخارجي</Label>
              <Input
                value={clickUrl}
                onChange={(e) => setClickUrl(e.target.value)}
                placeholder="https://example.com"
                className="h-10 text-sm rounded-xl font-mono"
                dir="ltr"
                type="url"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Submit ── */}
      <div className="flex justify-end gap-3 pb-8">
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          disabled={isLoading}
          className="rounded-xl text-sm px-6"
        >
          مسح البيانات
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="rounded-xl text-sm px-8 gap-2 font-bold shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              إرسال الإشعار
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
