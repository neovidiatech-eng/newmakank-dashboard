import BranchesColumns from "@/pages/dashboard/branches/BranchesColumns";
import CategoryColumns from "@/pages/dashboard/category/CategoryColumns";
import OrdersColumns from "@/pages/dashboard/orders/OrdersColumns";
import ServicesColumns from "@/pages/dashboard/services/ServicesColumns";
import CustomTabs, { TabItem } from "@/components/common/CustomTabs/custom-tab";
import TableBasic from "@/components/common/table/TableBasic";
import { Layers, MapPin, Package, ShoppingBag, FileCode2 } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { useMemo } from "react";

interface StoreTabsProps {
  branches: ApiResponse<any[]>;
  categories: ApiResponse<any[]>;
  orders: ApiResponse<any[]>;
  services: ApiResponse<any[]>;
  appliedTemplates?: ApiResponse<any[]>;
  storeId: number;
}

export function StoreTabs({ branches, categories, orders, services, appliedTemplates, storeId }: StoreTabsProps) {
  const t = useTranslations();
  const ordersColumns = OrdersColumns();
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
          data={categories?.data}
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
          columns={[{ accessorKey: "template.name", header: t("Template Name"), cell: ({ row }: any) => {
            const tpl = row.original.template?.name;
            return tpl ? (tpl.ar || tpl.en || tpl) : "-";
          }}, { accessorKey: "appliedAt", header: t("Applied At"), cell: ({ getValue }: any) => new Date(getValue() as string).toLocaleString() }]}
          cardHeader={t("appliedTemplates")}
          hideCreateNew
          isInnerTable={false}
          pagination={{
            total: appliedTemplates?.total
          }}
        />
      )
    }
  ];

  return <CustomTabs tabs={tabs} defaultValue="products" clearSearchParams className="mt-6" />;
}
