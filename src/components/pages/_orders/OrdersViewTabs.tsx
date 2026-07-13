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
    name: "orderType",
    type: "select",
    options: [
      { label: t("DELIVERY"), value: "DELIVERY" },
      { label: t("PICKUP"), value: "PICKUP" },
      { label: t("CUSTOM_DELIVERY"), value: "CUSTOM_DELIVERY" }
    ],
    isQuick: true
  },
  {
    name: "customDeliveryKind",
    label: t("Delivery Service"),
    type: "tabs",
    options: [
      { label: t("PURCHASE"), value: "PURCHASE" },
      { label: t("RESTAURANT"), value: "RESTAURANT" },
      { label: t("ONLINE"), value: "ONLINE" }
    ],
    isQuick: true
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
  const resolvedFilters = (filters ?? getDefaultFilters(t)).map(filter => {
    if (filter.name === "customDeliveryKind") {
      return {
        ...filter,
        isHidden: searchParams.get("orderType") !== "CUSTOM_DELIVERY"
      };
    }
    return filter;
  });
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Build params from URL search params — fromDate/toDate are sent to the server like
  // any other filter (storeId, branchId, ...) instead of being filtered client-side.
  // Filtering client-side only covered the current page of results and silently missed
  // matches on other pages, so it was dropped in favor of the same server-side pattern
  // used everywhere else.
  const params: Record<string, unknown> = {};
  searchParams.forEach((value, key) => {
    if (key === "orderType" && value === "CUSTOM_DELIVERY") {
      // Do not send orderType=CUSTOM_DELIVERY to the backend API
    } else if (key === "customDeliveryKind") {
      params["kind"] = value;
    } else {
      params[key] = value;
    }
  });

  const isCustomDeliveryWithoutKind = searchParams.get("orderType") === "CUSTOM_DELIVERY" && !searchParams.get("customDeliveryKind");

  const queryKey = [endPoint.join("/"), JSON.stringify(params)];
  const { data: response } = useApiQuery({
    queryKey,
    endPoint,
    params,
    staleTime: 0,
    enabled: !isCustomDeliveryWithoutKind
  });

  const orders: Record<string, unknown>[] = Array.isArray(response?.data) ? response.data : [];
  const total = response?.total ?? orders.length;

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
