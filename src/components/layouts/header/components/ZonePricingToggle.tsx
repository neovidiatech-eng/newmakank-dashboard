import { useState, useEffect, useCallback } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClient } from "@/lib/axios";
import { toast } from "sonner";
import {
  Loader2,
  MapPin,
  MapPinOff,
  ChevronDown,
  Check,
} from "lucide-react";
import { useLocale } from "@/lib/i18n";

// ─── Types ────────────────────────────────────────────────────────────────────
type PricingMode = "unified" | "custom";

interface ModeConfig {
  id: PricingMode;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  activeColor: string;
  badgeColor: string;
  iconColor: string;
}

// ─── Mode definitions ────────────────────────────────────────────────────────
const getModes = (locale: string): ModeConfig[] => [
  {
    id: "unified",
    icon: <MapPinOff className="h-4 w-4" />,
    label: locale === "ar" ? "تسعيرة موحدة عامة" : "Unified General Pricing",
    sublabel:
      locale === "ar"
        ? "كل المطاعم تاخد نفس السعر الثابت + الكيلومتر"
        : "All restaurants use fixed fee + km formula",
    activeColor: "text-amber-600 dark:text-amber-400",
    badgeColor: "bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700",
    iconColor: "text-amber-500",
  },
  {
    id: "custom",
    icon: <MapPin className="h-4 w-4" />,
    label: locale === "ar" ? "تسعير مخصص للمتاجر" : "Custom Store Pricing",
    sublabel:
      locale === "ar"
        ? "سعر لكل مطعم ومنطقة — لو مفيش سعر يرجع للثابت/الكيلو"
        : "Per-store zone prices — falls back to fixed/km if unset",
    activeColor: "text-emerald-600 dark:text-emerald-400",
    badgeColor: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700",
    iconColor: "text-emerald-500",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function ZonePricingToggle() {
  const locale = useLocale();
  const modes = getModes(locale);

  const [currentMode, setCurrentMode] = useState<PricingMode>("custom");
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [nextMode, setNextMode] = useState<PricingMode>("unified");
  const [open, setOpen] = useState(false);

  // ── Fetch current status ──────────────────────────────────────────────────
  const fetchStatus = useCallback(async () => {
    try {
      const res = await apiClient.get("/api/settings/zone-pricing-status");
      const data = res?.data?.data ?? res?.data ?? {};
      setCurrentMode(data.enabled !== false ? "custom" : "unified");
    } catch {
      try {
        const fallbackRes = await apiClient.get("/api/settings?domain=ORDER");
        const list = Array.isArray(fallbackRes?.data?.data)
          ? fallbackRes.data.data
          : Array.isArray(fallbackRes?.data)
          ? fallbackRes.data
          : [];
        const item = list.find(
          (s: any) => s.setting === "globalZonePricingEnabled"
        );
        if (item) {
          setCurrentMode(item.value !== "false" ? "custom" : "unified");
        }
      } catch {
        // keep default custom
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // ── Request mode change ───────────────────────────────────────────────────
  const handleModeRequest = (mode: PricingMode) => {
    if (mode === currentMode) {
      setOpen(false);
      return;
    }
    setNextMode(mode);
    setOpen(false);
    setShowConfirm(true);
  };

  // ── Confirm mode change ───────────────────────────────────────────────────
  const confirmToggle = async () => {
    setShowConfirm(false);
    setIsPending(true);
    const isCustom = nextMode === "custom";
    try {
      try {
        await apiClient.patch("/api/settings/zone-pricing-status", {
          enabled: isCustom,
        });
      } catch {
        const formData = new FormData();
        formData.append(
          "settings",
          JSON.stringify([
            {
              setting: "globalZonePricingEnabled",
              value: isCustom ? "true" : "false",
              name: {},
            },
          ])
        );
        formData.append("domain", "ORDER");
        await apiClient.patch("/api/settings", formData);
      }

      setCurrentMode(nextMode);
      const activeMode = modes.find((m) => m.id === nextMode)!;
      toast.success(
        locale === "ar"
          ? `✅ تم التبديل إلى: ${activeMode.label}`
          : `✅ Switched to: ${activeMode.label}`
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

  // ── Derived state ─────────────────────────────────────────────────────────
  const activeMode = modes.find((m) => m.id === currentMode)!;
  const pendingMode = modes.find((m) => m.id === nextMode)!;

  return (
    <>
      {/* ── Dropdown Trigger Button ── */}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            disabled={isLoading || isPending}
            className={`flex items-center gap-1.5 select-none px-2.5 py-1 rounded-md border transition-colors cursor-pointer text-xs font-semibold
              ${
                isLoading || isPending
                  ? "opacity-60 cursor-not-allowed bg-muted border-border"
                  : `${activeMode.badgeColor} hover:opacity-80`
              }`}
            aria-label="Delivery Pricing Mode"
          >
            {isLoading || isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
            ) : (
              <span className={activeMode.iconColor}>{activeMode.icon}</span>
            )}

            <span className={`hidden md:inline leading-none ${activeMode.activeColor}`}>
              {isLoading
                ? locale === "ar"
                  ? "جاري التحميل..."
                  : "Loading..."
                : isPending
                ? locale === "ar"
                  ? "جاري التحديث..."
                  : "Updating..."
                : locale === "ar"
                ? "مود التسعير"
                : "Pricing Mode"}
            </span>

            {!isLoading && !isPending && (
              <ChevronDown className={`h-3 w-3 ${activeMode.activeColor}`} />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-72 p-2"
        >
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-2 pb-2">
            {locale === "ar" ? "اختر وضع التسعير" : "Select Pricing Mode"}
          </p>

          {modes.map((mode) => {
            const isActive = mode.id === currentMode;
            return (
              <button
                key={mode.id}
                onClick={() => handleModeRequest(mode.id)}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-md transition-colors text-start
                  ${
                    isActive
                      ? `${mode.badgeColor} border`
                      : "hover:bg-accent/60"
                  }`}
              >
                {/* Icon */}
                <span
                  className={`mt-0.5 flex-shrink-0 ${
                    isActive ? mode.iconColor : "text-muted-foreground"
                  }`}
                >
                  {mode.icon}
                </span>

                {/* Text */}
                <span className="flex-1 min-w-0">
                  <span
                    className={`block text-sm font-semibold leading-snug ${
                      isActive ? mode.activeColor : "text-foreground"
                    }`}
                  >
                    {mode.label}
                  </span>
                  <span className="block text-[11px] text-muted-foreground leading-snug mt-0.5">
                    {mode.sublabel}
                  </span>
                </span>

                {/* Active checkmark */}
                {isActive && (
                  <Check
                    className={`h-4 w-4 flex-shrink-0 mt-0.5 ${mode.iconColor}`}
                  />
                )}
              </button>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── Confirmation Dialog ── */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${pendingMode.activeColor}`}>
              <span className={pendingMode.iconColor}>{pendingMode.icon}</span>
              {locale === "ar"
                ? `تفعيل: ${pendingMode.label}`
                : `Switch to: ${pendingMode.label}`}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed pt-2">
              {nextMode === "custom"
                ? locale === "ar"
                  ? "سيتم تفعيل التسعير المخصص. كل مطعم/منطقة هياخد سعره المحدد، ولو مفيش سعر مخصص هياخد تلقائياً من التسعيرة الثابتة والكيلومتر."
                  : "Custom pricing will activate. Each store/zone uses its own price. If no custom price is set, it automatically falls back to the fixed fee + km formula."
                : locale === "ar"
                ? "سيتم تطبيق التسعيرة الموحدة العامة (الثابت + الكيلومتر) على جميع المطاعم. أي أسعار مخصصة داخل المتاجر هيتم تجاهلها."
                : "Unified pricing will apply to all restaurants using the fixed fee + km formula. Any custom store prices will be ignored."}
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
                nextMode === "custom"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }
            >
              {locale === "ar" ? `تأكيد — ${pendingMode.label}` : `Confirm — ${pendingMode.label}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
