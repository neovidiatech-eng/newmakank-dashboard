import { stores } from "@/pages/dashboard/stores/types";
import { StoreAbout } from "./details/StoreAbout";
import { StoreCommotionButton } from "./details/StoreCommotionButton";
import { StoreHero } from "./details/StoreHero";
import { StoreSidebar } from "./details/StoreSidebar";
import { StoreStats } from "./details/StoreStats";
import { StoreTabs } from "./details/StoreTabs";

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
  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Hero + commission action in one strip */}
      <div className="space-y-3">
        <StoreHero data={data} />
        <div className="flex justify-end px-1">
          <StoreCommotionButton
            storeId={Number(data.id)}
            initialValue={Number((data as stores & { commotion?: number })?.commotion ?? 0)}
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
