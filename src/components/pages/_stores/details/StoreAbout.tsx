import { stores } from "@/pages/dashboard/stores/types";
import { Badge } from "@/components/ui/badge";
import { SectionCard } from "@/components/ui/dashboard-primitives";
import { Calendar, Tag } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

interface StoreAboutProps {
  data: stores;
}

export function StoreAbout({ data }: StoreAboutProps) {
  const t = useTranslations();

  return (
    <SectionCard icon={Tag} title={t("Active Coupons")}>
      {data?.StoreCoupons && data.StoreCoupons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.StoreCoupons.map((item, idx) => (
            <CouponCard key={idx} coupon={item.Coupon} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Tag className="h-8 w-8 mb-3 opacity-40" />
          <p className="text-sm">{t("No active coupons found")}</p>
        </div>
      )}
    </SectionCard>
  );
}

function CouponCard({ coupon }: { coupon: any }) {
  const t = useTranslations();

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3.5 hover:bg-muted/50 transition-colors">
      {/* Discount badge — replaces the side stripe */}
      <div className="flex-shrink-0 mt-0.5">
        <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
          {coupon.discountType === "percentage"
            ? `${coupon.discountValue}%`
            : `-${coupon.discountValue}`}
        </span>
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-tight truncate">
            {coupon.title?.en || coupon.title?.ar}
          </p>
          <Badge variant="secondary" className="text-[10px] uppercase flex-shrink-0">
            {coupon.code}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("Min Order")}: {coupon.minOrderAmount}
        </p>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground/70">
          <Calendar className="h-3 w-3 flex-shrink-0" />
          <span>{t("Expires")}: {new Date(coupon.endDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
