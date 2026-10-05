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
import { Loader2, MapPin, MapPinOff } from "lucide-react";
import { useLocale } from "@/lib/i18n";

export function ZonePricingToggle() {
  const locale = useLocale();

  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [nextValue, setNextValue] = useState(true);

  // 1) Fetch current zone pricing status
  const fetchStatus = useCallback(async () => {
    try {
      const res = await apiClient.get("/api/settings/zone-pricing-status");
      const data = res?.data?.data ?? res?.data ?? {};
      setIsEnabled(data.enabled !== false);
    } catch {
      try {
        const fallbackRes = await apiClient.get("/api/settings?domain=ORDER");
        const list = Array.isArray(fallbackRes?.data?.data)
          ? fallbackRes.data.data
          : Array.isArray(fallbackRes?.data)
          ? fallbackRes.data
          : [];
        const item = list.find((s: any) => s.setting === "globalZonePricingEnabled");
        if (item) {
          setIsEnabled(item.value !== "false");
        }
      } catch {
        // keep default true
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // 2) Open confirmation dialog
  const handleToggleRequest = (checked: boolean) => {
    setNextValue(checked);
    setShowConfirm(true);
  };

  // 3) Confirmed toggle
  const confirmToggle = async () => {
    setShowConfirm(false);
    setIsPending(true);
    try {
      try {
        await apiClient.patch("/api/settings/zone-pricing-status", {
          enabled: nextValue,
        });
      } catch {
        const formData = new FormData();
        formData.append(
          "settings",
          JSON.stringify([
            {
              setting: "globalZonePricingEnabled",
              value: nextValue ? "true" : "false",
              name: {},
            },
          ])
        );
        formData.append("domain", "ORDER");
        await apiClient.patch("/api/settings", formData);
      }

      setIsEnabled(nextValue);
      toast.success(
        nextValue
          ? locale === "ar"
            ? "🟢 تم تفعيل وضع التسعير المخصص لكل متجر ومنطقة"
            : "🟢 Custom Store & Zone pricing mode activated"
          : locale === "ar"
          ? "🌐 تم تفعيل وضع التسعيرة الموحدة العامة لجميع المتاجر"
          : "🌐 Unified General pricing mode activated"
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (locale === "ar"
            ? "فشل تحديث وضع تسعير التوصيل"
            : "Failed to update delivery pricing mode")
      );
    } finally {
      setIsPending(false);
    }
  };

  const statusLabel = isEnabled
    ? locale === "ar"
      ? "تسعير مخصص للمتاجر"
      : "Custom Store Pricing"
    : locale === "ar"
    ? "تسعيرة موحدة عامة"
    : "Unified General Pricing";

  const tooltipLabel = isLoading
    ? locale === "ar"
      ? "جاري التحقق من وضع التسعير..."
      : "Checking pricing mode..."
    : isEnabled
    ? locale === "ar"
      ? "الوضع الحالي: تسعير مخصص لكل متجر ومنطقة — اضغط للتبديل للتسعيرة الموحدة"
      : "Current mode: Custom Store & Zone Pricing — click to switch to Unified"
    : locale === "ar"
    ? "الوضع الحالي: تسعيرة موحدة عامة لجميع المطاعم — اضغط للتبديل للتسعير المخصص"
    : "Current mode: Unified General Pricing — click to switch to Custom";

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 select-none px-3 py-1 rounded-md bg-accent/40 border border-border/60 hover:bg-accent/70 transition-colors cursor-pointer">
              {isLoading || isPending ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : isEnabled ? (
                <MapPin className="h-4 w-4 text-emerald-500" />
              ) : (
                <MapPinOff className="h-4 w-4 text-amber-500" />
              )}

              <span
                className={`hidden md:inline text-xs font-bold leading-none ${
                  isEnabled
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {isLoading ? "..." : statusLabel}
              </span>

              <Switch
                checked={isEnabled}
                onCheckedChange={handleToggleRequest}
                disabled={isLoading || isPending}
                aria-label="Toggle Delivery Pricing Mode"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs max-w-64 text-center">
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
                  <MapPin className="h-5 w-5 text-emerald-500" />
                  {locale === "ar"
                    ? "تفعيل وضع التسعير المخصص للمتاجر والمناطق"
                    : "Activate Custom Store & Zone Pricing Mode"}
                </>
              ) : (
                <>
                  <MapPinOff className="h-5 w-5 text-amber-500" />
                  {locale === "ar"
                    ? "تفعيل وضع التسعيرة الموحدة العامة"
                    : "Activate Unified General Pricing Mode"}
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed pt-2">
              {nextValue
                ? locale === "ar"
                  ? "سيتم تفعيل تسعيرة التوصيل المخصصة؛ حيث سيأخذ كل متجر/مطعم سعره المحدد لكل منطقة. وفي حال عدم إدخال تسعيرة مخصصة لمطعم أو منطقة معينة، سيأخذ تلقائياً من التسعيرة الثابتة/الكيلومتر كاحتياطي (Fallback)."
                  : "Orders will use custom prices per store/zone. If a store or zone has no custom price, it will seamlessly fall back to the base fee / km calculation."
                : locale === "ar"
                ? "سيتم تطبيق التسعيرة الموحدة العامة (السعر الثابت / حساب الكيلومتر) على جميع المطاعم والمتاجر بالتساوي، وتجاهل أي أسعار مخصصة داخل المتاجر."
                : "All stores will strictly use the unified fixed fee / km formula, ignoring any individual store-specific zone prices."}
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
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }
            >
              {nextValue
                ? locale === "ar"
                  ? "تأكيد وضع التسعير المخصص"
                  : "Confirm Custom Mode"
                : locale === "ar"
                ? "تأكيد وضع التسعيرة الموحدة"
                : "Confirm Unified Mode"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
