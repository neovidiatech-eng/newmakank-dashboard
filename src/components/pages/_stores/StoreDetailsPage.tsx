import { stores } from "@/pages/dashboard/stores/types";
import { StoreAbout } from "./details/StoreAbout";
import { StoreCommotionButton } from "./details/StoreCommotionButton";
import { StoreHero } from "./details/StoreHero";
import { StoreSidebar } from "./details/StoreSidebar";
import { StoreStats } from "./details/StoreStats";
import { StoreTabs } from "./details/StoreTabs";
import { useTranslations } from "@/lib/i18n";

interface StoreDetailsPageProps {
  data: stores;
  branches: ApiResponse<any[]>;
  categories: ApiResponse<any[]>;
  orders: ApiResponse<any[]>;
  services: ApiResponse<any[]>;
}

export default function StoreDetailsPage({
  data,
  branches,
  categories,
  orders,
  services
}: StoreDetailsPageProps) {
  const t = useTranslations();
  const currentCommission = Number((data as any)?.commission ?? (data as any)?.commotion ?? 0);
  const currentCommissionType = ((data as any)?.commissionType === "FIXED" ? "FIXED" : "PERCENTAGE") as
    | "PERCENTAGE"
    | "FIXED";
  const commissionLabel =
    currentCommissionType === "PERCENTAGE" ? `${currentCommission}%` : String(currentCommission);

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Hero + commission action in one strip */}
      <div className="space-y-3">
        <StoreHero data={data} />
        <div className="flex justify-end items-center gap-4 px-1">
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg border">
            <span>{t("Store Commission")}:</span>
            <span className="text-foreground font-semibold">{commissionLabel}</span>
            <span className="text-xs">({t(currentCommissionType)})</span>
          </div>
          <StoreCommotionButton
            storeId={Number(data.id)}
            initialValue={currentCommission}
            initialType={currentCommissionType}
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
        storeId={Number(data.id)}
      />
    </div>
  );
}
