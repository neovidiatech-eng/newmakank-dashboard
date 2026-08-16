"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Ban, ShieldCheck, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";
import { usePathname, useRouter } from "@/lib/navigation";
import { revalidatePathAction } from "@/api/global/revalidatePath";

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
  const router = useRouter();
  const pathname = usePathname();

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await apiClient.patch(`/api/customers/${customerId}`, {
        active: !localIsActive,
      });

      const newState = !localIsActive;
      setLocalIsActive(newState);

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

      await revalidatePathAction(pathname);
      router.refresh();
    } catch (error: any) {
      console.error("Failed to toggle customer status:", error);
      toast.error("حدث خطأ أثناء تغيير حالة العميل", {
        description:
          error?.response?.data?.message ||
          error?.message ||
          "تأكد من صلاحياتك وحاول مجدداً",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (localIsActive) {
    // Customer is ACTIVE → show BLOCK button
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            disabled={isLoading}
            className="gap-2 text-xs font-semibold rounded-xl shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Ban className="h-3.5 w-3.5" />
            )}
            حظر العميل
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent dir="rtl" className="rounded-2xl max-w-md">
          <AlertDialogHeader className="text-right">
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <Ban className="h-5 w-5" />
              تأكيد حظر العميل
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right text-sm leading-relaxed space-y-3">
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
                  <li>طرد جميع الجلسات النشطة (Access &amp; Refresh Tokens)</li>
                  <li>
                    إرجاع{" "}
                    <code className="bg-muted px-1 rounded text-[10px]">
                      DISABLED_ACCOUNT
                    </code>{" "}
                    عند أي محاولة دخول
                  </li>
                </ul>
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel className="rounded-xl text-xs">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggle}
              disabled={isLoading}
              className="rounded-xl text-xs bg-destructive hover:bg-destructive/90 gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Ban className="h-3.5 w-3.5" />
              )}
              نعم، حظر العميل
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Customer is BLOCKED → show UNBLOCK button
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="gap-2 text-xs font-semibold rounded-xl border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 shadow-sm"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5" />
          )}
          إلغاء حظر العميل
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir="rtl" className="rounded-2xl max-w-md">
        <AlertDialogHeader className="text-right">
          <AlertDialogTitle className="flex items-center gap-2 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
            تأكيد إلغاء الحظر
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right text-sm leading-relaxed">
            هل تريد إلغاء حظر{" "}
            <strong className="text-foreground">
              {customerName ?? `العميل #${customerId}`}
            </strong>
            ؟
            <br />
            <br />
            سيتمكن العميل من تسجيل الدخول واستخدام التطبيق بشكل طبيعي فور الموافقة.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse gap-2">
          <AlertDialogCancel className="rounded-xl text-xs">
            إلغاء
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleToggle}
            disabled={isLoading}
            className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 gap-2 text-white"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5" />
            )}
            نعم، إلغاء الحظر
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
