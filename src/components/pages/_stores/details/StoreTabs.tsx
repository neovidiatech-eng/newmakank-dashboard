import BranchesColumns from "@/pages/dashboard/branches/BranchesColumns";
import CategoryColumns from "@/pages/dashboard/category/CategoryColumns";
import OrdersColumns from "@/pages/dashboard/orders/OrdersColumns";
import ServicesColumns from "@/pages/dashboard/services/ServicesColumns";
import CustomTabs, { TabItem } from "@/components/common/CustomTabs/custom-tab";
import TableBasic from "@/components/common/table/TableBasic";
import BtnAction from "@/components/common/table/tableActions/btn-action";
import { StoreZonePricingTab } from "./StoreZonePricingTab";
import { Layers, MapPin, MapPinned, Package, ShoppingBag, FileCode2, Trash2, Gift } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import OffersColumns from "@/pages/dashboard/offers/OffersColumns";
import { useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "@/lib/navigation";

interface StoreTabsProps {
  branches: ApiResponse<any[]>;
  categories: ApiResponse<any[]>;
  orders: ApiResponse<any[]>;
  services: ApiResponse<any[]>;
  appliedTemplates?: ApiResponse<any[]>;
  bundles?: ApiResponse<any[]>;
  storeId: number;
}

export function StoreTabs({ branches, categories, orders, services, appliedTemplates, bundles, storeId }: StoreTabsProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const currentTab = searchParams.get("tab") || "products";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(); // Clear other params when changing tab, like page and limit
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const ordersColumns = OrdersColumns();
  const offersColumns = OffersColumns();
  const formattedBranches = useMemo(() => {
    const arabicNumberFormatter = new Intl.NumberFormat("ar-EG", {
      useGrouping: false
    });

    return branches?.data?.map((branch, index) => {
      const branchNumber = index + 1;
      const branchName = branch?.name ?? {};
      const storeName = branch?.Store?.name ?? branchName;
      const storeNameAr = storeName?.ar || branchName?.ar || "";
      const storeNameEn = storeName?.en || branchName?.en || "";

      return {
        ...branch,
        name: {
          ar: `${storeNameAr} (فرع ${arabicNumberFormatter.format(branchNumber)})`,
          en: `${storeNameEn} (Branch ${branchNumber})`
        }
      };
    }) ?? [];
  }, [branches?.data]);

  const sortedCategories = useMemo(() => {
    if (!categories?.data) return [];
    return [...categories.data].sort((a, b) => {
      const orderA = typeof a.order === 'number' ? a.order : 0;
      const orderB = typeof b.order === 'number' ? b.order : 0;
      return orderA - orderB;
    });
  }, [categories?.data]);

  const tabs: TabItem[] = [
    {
      value: "branches",
      label: (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {t("Branches")}
        </div>
      ),
      content: (
        <TableBasic
          data={formattedBranches}
          columns={BranchesColumns}
          cardHeader={t("Store Branches")}
          pagination={{
            total: branches?.total
          }}
          createNewLink={`/stores/${storeId}/branches/create`}
          hideCreateNew={false}
          tableActions={{
            onDelete: ["branches"],
            onEdit: "/branches",
            onInfo: "/branches",
            fixedActions: true
          }}
          isInnerTable={false}
        />
      )
    },
    {
      value: "products",
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
          createNewLink={`/stores/${storeId}/products/create`}
          hideCreateNew={false}
          pagination={{
            total: services?.total
          }}
          filters={[
            {
              name: "categoryId",
              type: "selectPaginated",
              apiUrl: ["storeCategories"],
              searchFilters: [{ key: "storeId", value: storeId }]
            }
          ]}
          tableActions={{
            onDelete: ["services"],
            onEdit: `/stores/${storeId}/products`,
            fixedActions: true,
            onInfo: `/services`
          }}
          isInnerTable={false}
        />
      )
    },
    {
      value: "categories",
      label: (
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          {t("Categories")}
        </div>
      ),
      content: (
        <TableBasic
          data={sortedCategories}
          columns={CategoryColumns}
          cardHeader={t("Store Categories")}
          createNewLink={`/stores/${storeId}/categories/create`}
          hideCreateNew={false}
          isInnerTable={false}
          pagination={{
            total: categories?.total
          }}
          tableActions={{
            onDelete: ["categories"],
            onEdit: `/stores/${storeId}/categories`,
            onInfo: `/stores/${storeId}/categories`
          }}
        />
      )
    },
    {
      value: "offers",
      label: (
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4" />
          {t("Offers")}
        </div>
      ),
      content: (
        <TableBasic
          data={bundles?.data}
          columns={offersColumns}
          cardHeader={t("Offers")}
          createNewLink={`/stores/${storeId}/offers/create`}
          hideCreateNew={false}
          isInnerTable={false}
          pagination={{
            total: bundles?.total
          }}
          tableActions={{
            onDelete: ["bundles"] as any,
            onEdit: `/offers`,
            fixedActions: true
          }}
        />
      )
    },
    {
      value: "orders",
      label: (
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          {t("Orders")}
        </div>
      ),
      content: (
        <TableBasic
          data={orders?.data}
          columns={ordersColumns}
          cardHeader={t("Store Orders")}
          hideCreateNew
          isInnerTable={false}
          pagination={{
            total: orders?.total
          }}
          tableActions={{
            onInfo: true,
            fixedActions: true
          }}
        />
      )
    },
    {
      value: "appliedTemplates",
      label: (
        <div className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4" />
          {t("appliedTemplates")}
        </div>
      ),
      content: (
        <TableBasic
          data={appliedTemplates?.data}
          columns={[{
            accessorKey: "template.name", header: t("Template Name"), cell: ({ row }: any) => {
              const tpl = row.original.template?.name;
              return tpl ? (tpl.ar || tpl.en || tpl) : "-";
            }
          }, { accessorKey: "appliedAt", header: t("Applied At"), cell: ({ getValue }: any) => new Date(getValue() as string).toLocaleString() },
          {
            id: "actions",
            header: t("Actions"),
            cell: ({ row }: any) => {
              const templateId = row.original.templateId ?? row.original.template?.id;
              if (!templateId) return null;
              return (
                <BtnAction
                  variant="destructive"
                  method="DELETE"
                  endpoint={["stores", storeId, "applyTemplate", templateId]}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t("Remove Template")}
                </BtnAction>
              );
            }
          }]}
          cardHeader={t("appliedTemplates")}
          hideCreateNew
          isInnerTable={false}
          pagination={{
            total: appliedTemplates?.total
          }}
        />
      )
    },
    {
      value: "zonePricing",
      label: (
        <div className="flex items-center gap-2">
          <MapPinned className="w-4 h-4" />
          {t("Zone Pricing")}
        </div>
      ),
      content: <StoreZonePricingTab storeId={storeId} />
    }
  ];

  return (
    <CustomTabs
      tabs={tabs}
      value={currentTab}
      onValueChange={handleTabChange}
      className="mt-6 w-full"
    />
  );
}
