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
            ? "🟢 تم تفعيل تسعير المناطق لجميع المتاجر"
            : "🟢 Zone pricing enabled for all stores"
          : locale === "ar"
          ? "🟡 تم إيقاف تسعير المناطق (الاعتماد على الكيلومتر فقط)"
          : "🟡 Zone pricing disabled (KM formula active)"
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (locale === "ar"
            ? "فشل تحديث حالة تسعير المناطق"
            : "Failed to update zone pricing status")
      );
    } finally {
      setIsPending(false);
    }
  };

  const statusLabel = isEnabled
    ? locale === "ar"
      ? "المناطق: مفعّل"
      : "Zones: On"
    : locale === "ar"
    ? "المناطق: موقّف"
    : "Zones: Off";

  const tooltipLabel = isLoading
    ? locale === "ar"
      ? "جاري التحقق..."
      : "Checking status..."
    : isEnabled
    ? locale === "ar"
      ? "تسعير المناطق للمتاجر: مفعّل — اضغط للإيقاف واعتماد الكيلومتر"
      : "Zone Pricing: Enabled — click to disable and use km formula"
    : locale === "ar"
    ? "تسعير المناطق: موقّف (الحساب بالكيلومتر) — اضغط للتفعيل"
    : "Zone Pricing: Disabled (KM only) — click to enable";

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 select-none px-2.5 py-1 rounded-md bg-accent/40 border border-border/50 hover:bg-accent/70 transition-colors">
              {isLoading || isPending ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : isEnabled ? (
                <MapPin className="h-4 w-4 text-emerald-500" />
              ) : (
                <MapPinOff className="h-4 w-4 text-amber-500" />
              )}

              <span
                className={`hidden md:inline text-[11px] font-bold leading-none ${
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
                aria-label="Toggle Global Zone Pricing"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs max-w-56 text-center">
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
                    ? "تأكيد تفعيل تسعير المناطق"
                    : "Enable Zone Pricing"}
                </>
              ) : (
                <>
                  <MapPinOff className="h-5 w-5 text-amber-500" />
                  {locale === "ar"
                    ? "تأكيد إيقاف تسعير المناطق"
                    : "Disable Zone Pricing"}
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed pt-1">
              {nextValue
                ? locale === "ar"
                  ? "هل تريد تفعيل تسعير المناطق لجميع المتاجر؟ سيتم استخدام سعر المنطقة المحدد لكل طلب (سواء الخاص بالمتجر أو العام)."
                  : "Enable zone pricing for all stores? Orders will use zone prices (per-store or global) when available."
                : locale === "ar"
                ? "هل تريد إيقاف تسعير المناطق لجميع المتاجر؟ سيتم تجاهل أسعار المناطق تماماً والاعتماد على الكيلومتر فقط. (ملاحظة: الخدمات الخاصة لن تتأثر بهذا الإجراء وتظل مستقلة)."
                : "Disable zone pricing for all stores? Zone prices will be ignored and the per-km formula will be applied. (Note: Custom Delivery is not affected)."}
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
                  ? "نعم، تفعيل"
                  : "Yes, Enable"
                : locale === "ar"
                ? "نعم، إيقاف التسعير"
                : "Yes, Disable"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
