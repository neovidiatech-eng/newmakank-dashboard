import { stores } from "@/pages/dashboard/stores/types";
import MapPointerInput from "@/components/common/Inputs/map/MapPointerInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Megaphone, Power } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { StoreStatusSelect } from "../StoreStatusSelect";

interface StoreSidebarProps {
  data: stores & { status?: string };
}

export function StoreSidebar({ data }: StoreSidebarProps) {
  const t = useTranslations();

  return (
    <div className="space-y-5">
      {/* Store status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
            <Power className="h-4 w-4 text-primary" />
            {t("Store Status")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StoreStatusSelect storeId={data.id} initialStatus={data.status || "OPEN"} />
        </CardContent>
      </Card>

      {/* Store Announcement (if present) */}
      {(data as any)?.announcement && (
        <Card className="border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Megaphone className="h-4 w-4 flex-shrink-0" />
              {t("Store Announcement") || "رسالة / تنبيه المطعم للعملاء"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line bg-background/50 p-3 rounded-lg border border-amber-500/20">
              {(data as any).announcement}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Operations & Delivery Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
            <Clock className="h-4 w-4 text-primary" />
            {t("Operations & Orders Settings") || "إعدادات التشغيل والطلبات"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-muted-foreground">
              {t("Default Prep Time") || "وقت التحضير الافتراضي للمتجر"}:
            </span>
            <span className="font-semibold text-foreground">
              {(data as any)?.prepTimeMinutes ?? 0} {t("min") || "دقيقة"}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-muted-foreground">
              {t("Min Delivery Time") || "وقت التوصيل (الحد الأدنى)"}:
            </span>
            <span className="font-semibold text-foreground">
              {(data as any)?.deliveryTimeMinMinutes ?? 0} {t("min") || "دقائق"}
            </span>
          </div>

          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-muted-foreground">
              {t("Max Delivery Time") || "وقت التوصيل (الحد الأقصى)"}:
            </span>
            <span className="font-semibold text-foreground">
              {(data as any)?.deliveryTimeMaxMinutes ?? 0} {t("min") || "دقائق"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {t("Min Order Amount") || "الحد الأدنى لقيمة الطلب"}:
            </span>
            <span className="font-semibold text-foreground">
              {(data as any)?.minOrderAmount ?? 0} {t("EGP") || "ج.م"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Location — map fills the card, no nested card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
            <MapPin className="h-4 w-4 text-primary" />
            {t("Location & Contact")}
          </CardTitle>
        </CardHeader>
        <div className="h-64 w-full">
          <MapPointerInput
            value={{ lat: data?.lat, lng: data?.lng }}
            hideActions={true}
            className="h-full"
            defaultCenter={{ lat: data?.lat, lng: data?.lng }}
            defaultZoom={15}
          />
        </div>
      </Card>
    </div>
  );
}
