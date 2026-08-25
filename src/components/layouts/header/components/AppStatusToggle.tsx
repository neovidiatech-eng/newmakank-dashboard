import { useState, useEffect, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export function AppStatusToggle() {
  const locale = useLocale();

  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [nextValue, setNextValue] = useState(false);

  // 1) On mount — GET current app status
  const fetchStatus = useCallback(async () => {
    try {
      const res = await apiClient.get("/api/settings/app-status");
      const data = res?.data?.data ?? res?.data ?? {};
      setIsMaintenance(Boolean(data.isMaintenance));
    } catch {
      // silent fail — don't break the dashboard
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // 2) Ask for confirmation before toggling
  const handleToggleRequest = (checked: boolean) => {
    setNextValue(!checked); // Switch checked = true → app is OPEN → nextValue toggle inverted
    setShowConfirm(true);
  };

  // 3) Confirmed — send PATCH
  const confirmToggle = async () => {
    setShowConfirm(false);
    setIsPending(true);
    try {
      await apiClient.patch("/api/settings/app-status", {
        isMaintenance: nextValue,
        messageAr: nextValue
          ? "التطبيق تحت الصيانة حالياً، يرجى المحاولة لاحقاً."
          : "",
        messageEn: nextValue
          ? "The app is currently under maintenance. Please try again later."
          : "",
      });
      setIsMaintenance(nextValue);
      toast.success(
        nextValue
          ? locale === "ar"
            ? "🔴 تم إغلاق التطبيق للصيانة"
            : "🔴 App is now closed for maintenance"
          : locale === "ar"
          ? "🟢 تم فتح التطبيق بنجاح"
          : "🟢 App is now open"
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (locale === "ar" ? "فشل تحديث حالة التطبيق" : "Failed to update app status")
      );
    } finally {
      setIsPending(false);
    }
  };

  const statusLabel = isMaintenance
    ? locale === "ar"
      ? "مغلق للصيانة"
      : "Maintenance"
    : locale === "ar"
    ? "مفتوح"
    : "Open";

  const tooltipLabel = isLoading
    ? locale === "ar"
      ? "جاري التحقق من الحالة..."
      : "Checking status..."
    : isMaintenance
    ? locale === "ar"
      ? "التطبيق مغلق — اضغط لفتحه"
      : "App closed — click to open"
    : locale === "ar"
    ? "التطبيق مفتوح — اضغط للإغلاق للصيانة"
    : "App open — click to close for maintenance";

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 select-none">
              {/* Icon */}
              {isLoading || isPending ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : isMaintenance ? (
                <ShieldAlert className="h-4 w-4 text-rose-500" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              )}

              {/* Status label – hidden on small screens */}
              <span
                className={`hidden sm:inline text-[11px] font-bold leading-none ${
                  isMaintenance ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {isLoading ? "..." : statusLabel}
              </span>

              {/* Switch: checked = app is OPEN (not maintenance) */}
              <Switch
                checked={!isMaintenance}
                onCheckedChange={handleToggleRequest}
                disabled={isLoading || isPending}
                aria-label="Toggle App Maintenance Mode"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs max-w-48 text-center">
            {tooltipLabel}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {nextValue ? (
                <>
                  <ShieldAlert className="h-5 w-5 text-rose-500" />
                  {locale === "ar" ? "تأكيد إغلاق التطبيق" : "Confirm App Closure"}
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  {locale === "ar" ? "تأكيد فتح التطبيق" : "Confirm App Opening"}
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed pt-1">
              {nextValue
                ? locale === "ar"
                  ? "هل أنت متأكد من إغلاق التطبيق للصيانة؟ لن يتمكن المستخدمون من الدخول حتى تفتحه مجدداً."
                  : "Are you sure you want to close the app for maintenance? Users won't be able to access it until you reopen it."
                : locale === "ar"
                ? "هل أنت متأكد من فتح التطبيق مجدداً؟ سيتمكن جميع المستخدمين من الدخول."
                : "Are you sure you want to reopen the app? All users will be able to access it."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 justify-end mt-4">
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                {locale === "ar" ? "إلغاء" : "Cancel"}
              </Button>
            </DialogClose>
            <Button
              size="sm"
              onClick={confirmToggle}
              className={
                nextValue
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }
            >
              {nextValue
                ? locale === "ar"
                  ? "نعم، أغلق التطبيق"
                  : "Yes, Close App"
                : locale === "ar"
                ? "نعم، افتح التطبيق"
                : "Yes, Open App"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
