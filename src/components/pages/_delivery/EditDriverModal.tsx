"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pencil, Loader2, User, Phone, Mail, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { apiClient } from "@/lib/axios";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";

export interface EditDriverModalProps {
  driver: {
    id: number;
    name: string;
    email: string;
    phone: string;
    image?: string | null;
    avatar?: string | null;
    verified?: boolean;
    isVerified?: boolean;
    active?: boolean;
    isActive?: boolean;
    isOnShift?: boolean;
    forceAvailable?: boolean;
    isAvailable?: boolean;
  };
  trigger?: React.ReactNode;
}

export default function EditDriverModal({ driver, trigger }: EditDriverModalProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState(driver.name || "");
  const [phone, setPhone] = useState(driver.phone || "");
  const [email, setEmail] = useState(driver.email || "");
  const [isActive, setIsActive] = useState<boolean>(Boolean(driver.isActive ?? driver.active ?? true));
  const [isVerified, setIsVerified] = useState<boolean>(Boolean(driver.isVerified ?? driver.verified ?? false));
  const [forceAvailable, setForceAvailable] = useState<boolean>(Boolean(driver.isAvailable ?? driver.forceAvailable ?? false));
  const [isOnShift, setIsOnShift] = useState<boolean>(Boolean(driver.isOnShift ?? false));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name,
      phone,
      email,
      active: isActive,
      isActive,
      verified: isVerified,
      isVerified,
      forceAvailable,
      isOnShift
    };

    try {
      let response;
      try {
        response = await apiClient.put(`/api/delivery/${driver.id}`, payload);
      } catch (err) {
        try {
          response = await apiClient.patch(`/api/delivery/${driver.id}`, payload);
        } catch (err2) {
          response = await apiClient.put(`/api/users/${driver.id}`, payload);
        }
      }

      toast.success(t("Driver profile updated successfully") || "تم تحديث بيانات المندوب بنجاح");
      queryClient.invalidateQueries({ queryKey: ["delivery"] });
      queryClient.invalidateQueries({ queryKey: ["deliverySummaryData"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Failed to update driver profile:", error);
      toast.error(error?.response?.data?.message || error?.message || "حدث خطأ أثناء تعديل بيانات المندوب");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="gap-2 text-xs font-semibold border-primary/20 text-primary hover:bg-primary/5 rounded-xl shadow-xs"
        >
          <Pencil className="h-3.5 w-3.5" />
          {t("Edit Driver") || "تعديل بيانات المندوب"}
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-card text-card-foreground border border-border shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Pencil className="h-5 w-5 text-primary" />
              {t("Edit Driver Profile") || "تعديل بيانات المندوب"} #{driver.id}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {t("Update personal details and system privileges for this driver.") || "قم بتحديث البيانات الشخصية وصلاحيات المندوب في النظام."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 py-2">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                {t("Full Name") || "الاسم الكامل"}
              </Label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسم المندوب"
                className="h-9 text-xs"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary" />
                {t("Phone Number") || "رقم الهاتف"}
              </Label>
              <Input
                type="text"
                required
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+201012345678"
                className="h-9 text-xs font-mono"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                {t("Email Address") || "البريد الإلكتروني"}
              </Label>
              <Input
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="driver@example.com"
                className="h-9 text-xs font-mono"
              />
            </div>

            {/* Switches for Statuses */}
            <div className="space-y-3 pt-2 border-t border-border/60">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t("Status & Permissions") || "حالة الحساب والصلاحيات"}
              </p>

              <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    {t("Account Active") || "تفعيل الحساب (نشط)"}
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {isActive ? "الحساب مفعل ويمكن للمندوب الدخول" : "الحساب معطل وموقوف"}
                  </p>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                    {t("Account Verified") || "توثيق حساب المندوب"}
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {isVerified ? "الحساب موثق رسمياً" : "الحساب غير موثق"}
                  </p>
                </div>
                <Switch
                  checked={isVerified}
                  onCheckedChange={setIsVerified}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    {t("Force Available") || "متاح دائماً (Force Available)"}
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {forceAvailable ? "المندوب متاح دائماً بدون جدولة" : "حسب جدولة العمل والتواجد"}
                  </p>
                </div>
                <Switch
                  checked={forceAvailable}
                  onCheckedChange={setForceAvailable}
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-xs"
              >
                {t("Cancel") || "إلغاء"}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                size="sm"
                className="gap-2 text-xs font-semibold"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Pencil className="h-4 w-4" />
                )}
                {t("Save Changes") || "حفظ التعديلات"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
