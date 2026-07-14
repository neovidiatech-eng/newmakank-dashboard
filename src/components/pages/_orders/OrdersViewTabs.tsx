import OrdersColumns from "@/pages/dashboard/orders/OrdersColumns";
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import TableBasic from "@/components/common/table/TableBasic";
import { useTranslations } from "@/lib/i18n";
import { useState } from "react";
import BulkAssignOrdersAction from "./BulkAssignOrdersAction";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useSearchParams } from "@/lib/navigation";

type OrdersViewTabsProps = {
  tableTitle: string;
  filters?: FormInput[];
  endPoint?: (string | number)[];
};

const getDefaultFilters = (t: ReturnType<typeof useTranslations>): FormInput[] => [
  {
    name: "type",
    type: "select",
    options: [
      { label: t("DELIVERY"), value: "DELIVERY" },
      { label: t("PICKUP"), value: "PICKUP" },
      { label: t("CUSTOM_DELIVERY"), value: "CUSTOM_DELIVERY" }
    ]
  },
  {
    name: "category",
    type: "select",
    options: [
      { label: t("NORMAL"), value: "NORMAL" },
      { label: t("SCHEDULED"), value: "SCHEDULED" }
    ]
  },
  {
    name: "branchId",
    type: "selectPaginated",
    apiUrl: ["branches"],
    labelFormat: "storeBranch"
  },
  {
    name: "deliveryId",
    type: "selectPaginated",
    apiUrl: ["delivery"]
  },
  {
    name: "userId",
    type: "selectPaginated",
    apiUrl: ["users"]
  },
  {
    name: "cityId",
    type: "selectPaginated",
    apiUrl: ["cities"]
  },
  {
    name: "zoneId",
    type: "selectPaginated",
    apiUrl: ["zones"]
  },
  {
    name: "fromDate",
    type: "date"
  },
  {
    name: "toDate",
    type: "date"
  }
];

export default function OrdersViewTabs({
  tableTitle,
  filters,
  endPoint = ["orders"]
}: OrdersViewTabsProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const columns = OrdersColumns();
  const resolvedFilters = filters ?? getDefaultFilters(t);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Build params from URL search params.
  // The "type" filter (DELIVERY / PICKUP / CUSTOM_DELIVERY) is handled client-side
  // so we don't make a separate API call for each type.
  const clientSideFilterKeys = ["type"];
  const params: Record<string, unknown> = {};
  searchParams.forEach((value, key) => { params[key] = value; });

  // Extract client-side filter values then remove them from the server params
  const selectedType = params.type as string | undefined;
  for (const key of clientSideFilterKeys) { delete params[key]; }

  // Always fetch ALL orders from the server (no server pagination).
  // Pagination and type filtering are handled entirely client-side.
  const currentPage = Number(params.page) || 1;
  const currentLimit = Number(params.limit) || 10;
  delete params.page;
  delete params.limit;

  const queryKey = [endPoint.join("/"), JSON.stringify(params)];
  const { data: response } = useApiQuery({ queryKey, endPoint, params, staleTime: 0 });

  const allOrders: Record<string, unknown>[] = Array.isArray(response?.data) ? response.data : [];

  // Client-side filtering by order type, then manual pagination
  let orders: Record<string, unknown>[];
  let total: number;

  if (selectedType) {
    const filtered = allOrders.filter(order => order.type === selectedType);
    orders = filtered.slice((currentPage - 1) * currentLimit, currentPage * currentLimit);
    total = filtered.length;
  } else {
    orders = allOrders;
    total = response?.total ?? orders.length;
  }

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrderIds(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleVisibleOrdersSelection = (orderIds: string[]) => {
    setSelectedOrderIds(prev => {
      const allVisibleSelected = orderIds.every(id => prev.includes(id));
      if (allVisibleSelected) {
        return prev.filter(id => !orderIds.includes(id));
      }

      return Array.from(new Set([...prev, ...orderIds]));
    });
  };

  return (
    <div className="space-y-4">
      <BulkAssignOrdersAction
        selectedOrderIds={selectedOrderIds}
        onClearSelection={() => setSelectedOrderIds([])}
      />
      <TableBasic
        data={orders}
        hideCreateNew
        columns={columns}
        pagination={{
          total: total ?? orders?.length
        }}
        tableActions={{
          onInfo: true,
          fixedActions: true
        }}
        cardHeader={tableTitle}
        filters={resolvedFilters}
        rowSelection={{
          selectedIds: selectedOrderIds,
          onToggle: toggleOrderSelection,
          onToggleAll: toggleVisibleOrdersSelection,
          getRowId: row => String(row.id)
        }}
      />
    </div>
  );
}
