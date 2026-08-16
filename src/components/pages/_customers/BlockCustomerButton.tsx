"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ban, ShieldCheck, Loader2 } from "lucide-react";
import { fetchHelper } from "@/api/fetch";
import { toast } from "sonner";
import { queryClient } from "@/lib/queryClient";

interface BlockCustomerButtonProps {
  customerId: number;
  isActive: boolean;
  customerName?: string;
}

export default function BlockCustomerButton({
  customerId,
  isActive,
  customerName,
}: BlockCustomerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [localIsActive, setLocalIsActive] = useState(isActive);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const res = await fetchHelper({
        endPoint: ["customers", customerId],
        method: "PATCH",
        body: { active: !localIsActive },
      });

      if (!res?.success && res?.status !== true) throw res;

      const newState = !localIsActive;
      setLocalIsActive(newState);
      setIsOpen(false);

      toast.success(
        newState
          ? `✅ تم إلغاء حظر ${customerName ?? "العميل"} بنجاح`
          : `🚫 تم حظر ${customerName ?? "العميل"} بنجاح`,
        {
          description: newState
            ? "يمكن للعميل الآن تسجيل الدخول واستخدام التطبيق"
            : "تم منع العميل من تسجيل الدخول وطرد جميع جلساته النشطة فوراً",
        }
      );

      queryClient.invalidateQueries({ queryKey: ["customers"] });
    } catch (error: any) {
      console.error("Failed to toggle customer status:", error);
      toast.error("حدث خطأ أثناء تغيير حالة العميل", {
        description:
          error?.result?.message ||
          error?.message ||
          "تأكد من صلاحياتك وحاول مجدداً",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      {localIsActive ? (
        <Button
          variant="destructive"
          size="sm"
          disabled={isLoading}
          onClick={() => setIsOpen(true)}
          className="gap-2 text-xs font-semibold rounded-xl shadow-sm"
        >
          <Ban className="h-3.5 w-3.5" />
          حظر العميل
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => setIsOpen(true)}
          className="gap-2 text-xs font-semibold rounded-xl border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 shadow-sm"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          إلغاء حظر العميل
        </Button>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent dir="rtl" className="rounded-2xl max-w-md">
          <DialogHeader className="text-right">
            <DialogTitle
              className={`flex items-center gap-2 ${localIsActive ? "text-destructive" : "text-emerald-600"}`}
            >
              {localIsActive ? (
                <Ban className="h-5 w-5" />
              ) : (
                <ShieldCheck className="h-5 w-5" />
              )}
              {localIsActive ? "تأكيد حظر العميل" : "تأكيد إلغاء الحظر"}
            </DialogTitle>
            <DialogDescription className="text-right text-sm leading-relaxed">
              {localIsActive ? (
                <>
                  <span>
                    هل أنت متأكد من حظر{" "}
                    <strong className="text-foreground">
                      {customerName ?? `العميل #${customerId}`}
                    </strong>
                    ؟
                  </span>
                  <span className="block mt-3">
                    <span className="text-destructive font-semibold">⚠️ سيتم فوراً:</span>
                    <ul className="mt-2 space-y-1 text-muted-foreground text-xs list-disc list-inside">
                      <li>منع تسجيل الدخول بأي طريقة (Email / Google / البصمة)</li>
                      <li>طرد جميع الجلسات النشطة (Tokens)</li>
                      <li>
                        إرجاع{" "}
                        <code className="bg-muted px-1 rounded text-[10px]">
                          DISABLED_ACCOUNT
                        </code>{" "}
                        عند أي محاولة دخول
                      </li>
                    </ul>
                  </span>
                </>
              ) : (
                <>
                  هل تريد إلغاء حظر{" "}
                  <strong className="text-foreground">
                    {customerName ?? `العميل #${customerId}`}
                  </strong>
                  ؟
                  <br />
                  <br />
                  سيتمكن العميل من تسجيل الدخول واستخدام التطبيق بشكل طبيعي فور الموافقة.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-row-reverse gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
              className="rounded-xl text-xs"
            >
              إلغاء
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleToggle}
              disabled={isLoading}
              className={`rounded-xl text-xs gap-2 ${
                localIsActive
                  ? "bg-destructive hover:bg-destructive/90 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : localIsActive ? (
                <Ban className="h-3.5 w-3.5" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5" />
              )}
              {localIsActive ? "نعم، حظر العميل" : "نعم، إلغاء الحظر"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
