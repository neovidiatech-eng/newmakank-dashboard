import OrdersColumns from "@/pages/dashboard/orders/OrdersColumns";
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import TableBasic from "@/components/common/table/TableBasic";
import { useTranslations } from "@/lib/i18n";
import { useState } from "react";
import BulkAssignOrdersAction from "./BulkAssignOrdersAction";

type OrdersViewTabsProps = {
  orders: Record<string, unknown>[];
  total?: number;
  tableTitle: string;
  filters?: FormInput[];
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
  }
];

export default function OrdersViewTabs({
  orders,
  total,
  tableTitle,
  filters
}: OrdersViewTabsProps) {
  const t = useTranslations();
  const columns = OrdersColumns();
  const resolvedFilters = filters ?? getDefaultFilters(t);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

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
