import { stores } from "@/pages/dashboard/stores/types";
import ResetPeriodButton from "@/components/pages/_dashboard/ResetPeriodButton";
import { StoreAbout } from "./details/StoreAbout";
import { StoreCommotionButton } from "./details/StoreCommotionButton";
import { ApplyTemplateButton } from "./details/ApplyTemplateButton";
import { StoreApprovalAction } from "./StoreApprovalAction";
import { StoreHero } from "./details/StoreHero";
import { StoreSidebar } from "./details/StoreSidebar";
import { StoreStats } from "./details/StoreStats";
import { StoreTabs } from "./details/StoreTabs";
import { StoreManagedByAdminToggle } from "./details/StoreManagedByAdminToggle";
import { StoreDiscountButton } from "./details/StoreDiscountButton";
import { StorePrepTimeButton } from "./details/StorePrepTimeButton";
import { useTranslations } from "@/lib/i18n";
import { AlertTriangle } from "lucide-react";

interface StoreDetailsPageProps {
  data: stores;
  branches: ApiResponse<any[]>;
  categories: ApiResponse<any[]>;
  orders: ApiResponse<any[]>;
  services: ApiResponse<any[]>;
  appliedTemplates: ApiResponse<any[]>;
  bundles: ApiResponse<any[]>;
}

export default function StoreDetailsPage({
  data,
  branches,
  categories,
  orders,
  services,
  appliedTemplates,
  bundles
}: StoreDetailsPageProps) {
  const t = useTranslations();
  const currentCommission = Number((data as any)?.commission ?? (data as any)?.commotion ?? 0);
  const currentCommissionType = ((data as any)?.commissionType === "FIXED" ? "FIXED" : "PERCENTAGE") as
    | "PERCENTAGE"
    | "FIXED";
  const commissionLabel =
    currentCommissionType === "PERCENTAGE" ? `${currentCommission}%` : String(currentCommission);

  const currentDiscount = Number((data as any)?.discountValue ?? (data as any)?.discount ?? 0);
  const currentDiscountType = ((data as any)?.discountType === "FIXED" ? "FIXED" : "PERCENTAGE") as
    | "PERCENTAGE"
    | "FIXED";
  const discountLabel =
    currentDiscountType === "PERCENTAGE" ? `${currentDiscount}%` : String(currentDiscount);
  const hasDiscount = currentDiscount > 0;

  const isPendingApproval = (data as any)?.isStoreAccepted === false;

  return (
    <div className="flex flex-col gap-8 pb-20">
      {isPendingApproval && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 px-4 py-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-sm font-medium">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {t("storePendingReviewBanner")}
          </div>
          <StoreApprovalAction storeId={Number(data.id)} />
        </div>
      )}

      {/* Hero + commission action in one strip */}
      <div className="space-y-3">
        <StoreHero data={data} />
        <div className="flex justify-end items-center gap-4 px-1">
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg border">
            <span>{t("Store Commission")}:</span>
            <span className="text-foreground font-semibold">{commissionLabel}</span>
            <span className="text-xs">({t(currentCommissionType)})</span>
          </div>
          {hasDiscount && (
            <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground bg-orange-500/10 dark:bg-orange-500/20 px-3 py-1.5 rounded-lg border border-orange-400/40">
              <span>{t("Store Discount")}:</span>
              <span className="text-orange-600 dark:text-orange-400 font-semibold">{discountLabel}</span>
              <span className="text-xs">({t(currentDiscountType)})</span>
            </div>
          )}
          <StoreManagedByAdminToggle
            storeId={Number(data.id)}
            initialEnabled={(data as any).managedByAdmin}
          />
          <StoreDiscountButton
            storeId={Number(data.id)}
            initialDiscountType={currentDiscountType}
            initialDiscountValue={currentDiscount}
          />
          <ApplyTemplateButton storeId={Number(data.id)} />
          <StorePrepTimeButton
            storeId={Number(data.id)}
            initialPrepTime={Number((data as any)?.prepTimeMinutes ?? 0)}
            initialDeliveryMin={Number((data as any)?.deliveryTimeMinMinutes ?? 0)}
            initialDeliveryMax={Number((data as any)?.deliveryTimeMaxMinutes ?? 0)}
            initialMinOrderAmount={Number((data as any)?.minOrderAmount ?? 0)}
          />
          <StoreCommotionButton
            storeId={Number(data.id)}
            initialValue={currentCommission}
            initialType={currentCommissionType}
          />
          <ResetPeriodButton
            endPoint={["storeResetPeriod"]}
            label={t("Reset Store Period") || "تصفير فترة المتجر"}
            variant="secondary"
          />
        </div>
      </div>

      {/* Two-column: main content left, sidebar right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <StoreStats data={data} />
          <StoreAbout data={data} />
        </div>

        {(data?.lat && data?.lng) && (
          <div className="lg:col-span-1">
            <StoreSidebar data={data} />
          </div>
        )}
      </div>

      {/* Full-width data tabs */}
      <StoreTabs
        branches={branches}
        categories={categories}
        orders={orders}
        services={services}
        appliedTemplates={appliedTemplates}
        bundles={bundles}
        storeId={Number(data.id)}
      />
    </div>
  );
}
