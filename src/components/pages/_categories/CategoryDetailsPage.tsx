import ServicesColumns from "@/pages/dashboard/services/ServicesColumns";
import StoresColumns from "@/pages/dashboard/stores/StoresColumns";
import CustomTabs, { TabItem } from "@/components/common/CustomTabs/custom-tab";
import TableBasic from "@/components/common/table/TableBasic";
import { Package, Store } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { useParams } from "@/lib/navigation";

interface CategoryDetailsPageProps {
  category: any;
  stores?: ApiResponse<any[]>;
  services?: ApiResponse<any[]>;
}

export default function CategoryDetailsPage({
  category,
  stores,
  services
}: CategoryDetailsPageProps) {
  const t = useTranslations();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const storesColumns = StoresColumns();

  const categoryName =
    typeof category?.name === "object"
      ? category.name[locale] || category.name.en || category.name.ar
      : category?.name;

  const tabs: TabItem[] = [
    services && {
      value: "services",
      label: (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          {t("Services")}
        </div>
      ),
      content: (
        <TableBasic
          data={services?.data}
          columns={ServicesColumns}
          cardHeader={t("Services")}
          pagination={{
            total: services?.total
          }}
          tableActions={{
            onDelete: ["services"],
            onEdit: `/services`,
            onInfo: `/services`,
            fixedActions: true
          }}
          isInnerTable={false}
        />
      )
    },
    stores && {
      value: "stores",
      label: (
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4" />
          {t("Stores")}
        </div>
      ),
      content: (
        <TableBasic
          data={stores?.data}
          columns={storesColumns}
          cardHeader={t("Stores")}
          pagination={{
            total: stores?.total
          }}
          tableActions={{
            onDelete: ["stores"],
            onEdit: "/stores",
            onInfo: "/stores",
            fixedActions: true
          }}
          isInnerTable={false}
        />
      )
    }
  ].filter(Boolean) as TabItem[];

  return (
    <div className="flex flex-col gap-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{categoryName}</h1>
        <p className="text-muted-foreground">
          {t("View products and stores associated with this category")}
        </p>
      </div>

      <CustomTabs tabs={tabs} defaultValue="services" clearSearchParams className="mt-2" />
    </div>
  );
}
