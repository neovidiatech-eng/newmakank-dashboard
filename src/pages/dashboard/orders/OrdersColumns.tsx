import { PriceAmount } from "@/components/PriceAmount";
import ActiveCol from "@/components/common/table/columns/Ative.column";
import DateCol from "@/components/common/table/columns/date.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import TableStatusBadge from "@/components/common/table/tableHelperComponents/TableStatusBadge";
import AssignOrderDeliveryDialog from "@/components/pages/_orders/AssignOrderDeliveryDialog";
import { OrderCustomerCell } from "@/components/pages/_orders/OrderCustomerCell";
import { OrderServicesCell } from "@/components/pages/_orders/OrderServicesCell";
import OrderStatusSelect from "@/components/pages/_orders/OrderStatusSelect";
import AdminNoteDialog from "@/components/pages/_orders/AdminNoteDialog";
import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

const getNestedValue = (source: Record<string, any>, paths: string[]) => {
  for (const path of paths) {
    const value = path.split(".").reduce<any>((current, key) => current?.[key], source);
    if (value !== undefined && value !== null && value !== "") return value;
  }

  return undefined;
};

const parseDateValue = (value: unknown) => {
  if (!value) return null;
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? null : date;
};

const addMinutes = (date: Date | null, minutes?: number) => {
  if (!date || !minutes) return null;
  return new Date(date.getTime() + minutes * 60 * 1000);
};

const getEstimatedArrivalDate = (order: Record<string, any>) => {
  const explicitArrival = parseDateValue(
    getNestedValue(order, [
      "estimatedArrivalAt",
      "arrivalAt",
      "expectedArrivalAt",
      "expectedDeliveryAt",
      "invoice.estimatedArrivalAt",
      "invoice.expectedDeliveryAt"
    ])
  );
  if (explicitArrival) return explicitArrival;

  const baseDate = parseDateValue(order.date || order.createdAt);
  const estimatedMinutes =
    Number(order.estimatedArrivalMinutes || order.invoice?.estimatedArrivalMinutes) || 0;

  return addMinutes(baseDate, estimatedMinutes);
};

const getDeliveryPickupDate = (order: Record<string, any>) =>
  parseDateValue(
    getNestedValue(order, [
      "deliveryAcceptedAt",
      "deliveryAssignedAt",
      "assignedAt",
      "acceptedAt",
      "pickedUpAt",
      "pickupAt",
      "receivedAt",
      "Delivery.acceptedAt",
      "Delivery.assignedAt",
      "Delivery.pickedUpAt"
    ])
  );

const getDeliveredDate = (order: Record<string, any>) =>
  parseDateValue(
    getNestedValue(order, [
      "deliveredAt",
      "deliveryTime",
      "completedAt",
      "finishedAt",
      "Delivery.deliveredAt",
      "Delivery.completedAt"
    ])
  );

const getDeliveryPerformance = (order: Record<string, any>) => {
  const pickupDate = getDeliveryPickupDate(order);
  const deliveredDate = getDeliveredDate(order);
  const estimatedMinutes =
    Number(order.estimatedArrivalMinutes || order.invoice?.estimatedArrivalMinutes) || 0;

  if (!pickupDate || !deliveredDate || !estimatedMinutes) return "PENDING_DELIVERY_TIME";

  const actualMinutes = Math.round((deliveredDate.getTime() - pickupDate.getTime()) / 60000);
  if (actualMinutes <= estimatedMinutes) return "ON_TIME_DELIVERY";
  if (actualMinutes <= estimatedMinutes + 10) return "NEAR_DELAY_DELIVERY";
  return "DELAYED_DELIVERY";
};

const DeliveryPerformanceBadge = ({ status }: { status: string }) => {
  const t = useTranslations();
  const styles: Record<string, string> = {
    ON_TIME_DELIVERY: "border-emerald-500/30 bg-emerald-500/15 text-emerald-500",
    NEAR_DELAY_DELIVERY: "border-orange-500/30 bg-orange-500/15 text-orange-400",
    DELAYED_DELIVERY: "border-red-500/30 bg-red-500/15 text-red-400",
    PENDING_DELIVERY_TIME: "border-orange-500/30 bg-orange-500/15 text-orange-400"
  };

  return (
    <Badge variant="outline" className={styles[status]}>
      {t(status)}
    </Badge>
  );
};

const getLocalizedName = (value: any) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.ar || value.en || "";
};

export default function OrdersColumns(): any {
  const t = useTranslations();
  const columns = [
    {
      accessorKey: "id",
      header: () => <IconHeader columnKey="ID" />,
      cell: ({ getValue }) => <span className="font-mono text-sm">{getValue() as string}</span>
    },
    {
      id: "customer",
      header: () => <IconHeader columnKey="Customer" />,
      cell: ({ row }) => <OrderCustomerCell customer={row?.original?.Customer} />
    },
    {
      accessorKey: "invoice.store.name",
      header: () => <IconHeader columnKey="Store Name" />,
      cell: ({ row }) => {
        const store = row?.original?.invoice?.store;
        const branch =
          row?.original?.Branch ||
          row?.original?.branch ||
          row?.original?.invoice?.branch ||
          row?.original?.invoice?.Branch;
        const storeName = getLocalizedName(store?.name || row?.original?.storeName);
        const branchName = getLocalizedName(branch?.name || row?.original?.branchName);
        const value = branchName && storeName ? `${storeName} (${branchName})` : storeName || branchName || "-";

        return <span>{value}</span>;
      }
    },
    {
      accessorKey: "type",
      header: () => <IconHeader columnKey="Order Type" />,
      cell: ({ getValue }) => {
        const orderType = String(getValue() || "DELIVERY");
        return <Badge variant="outline">{t(orderType)}</Badge>;
      }
    },
    {
      accessorKey: "isGift",
      header: () => <IconHeader columnKey="Gift Order" />,
      cell: ({ getValue }) => {
        const isGift = Boolean(getValue());
        return isGift ? (
          <Badge variant="outline" className="gap-1 border-pink-400 text-pink-500">
            <Gift className="h-3.5 w-3.5" />
            {t("Gift")}
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      }
    },
    {
      id: "services",
      header: () => <IconHeader columnKey="Services" />,
      cell: ({ row }) => <OrderServicesCell items={row?.original?.OrderItems} />
    },
    {
      accessorKey: "summary.total",
      header: () => <IconHeader columnKey="Invoice > Total" />,
      cell: ({ row }) => <PriceAmount value={row?.original?.invoice?.summary?.total} />
    },
    {
      accessorKey: "price",
      header: () => <IconHeader columnKey="Price" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    },
    {
      accessorKey: "note",
      header: () => <IconHeader columnKey="Note" />,
      cell: ({ getValue }) => <span>{(getValue() as string) || "-"}</span>
    },
    {
      id: "estimatedArrival",
      header: () => <IconHeader columnKey="Order Arrival" />,
      cell: ({ row }) => {
        const arrivalDate = getEstimatedArrivalDate(row.original);
        return arrivalDate ? <DateCol date={arrivalDate.toISOString()} /> : <span>-</span>;
      }
    },
    {
      id: "deliveryPickup",
      header: () => <IconHeader columnKey="Delivery Pickup" />,
      cell: ({ row }) => {
        const pickupDate = getDeliveryPickupDate(row.original);
        return pickupDate ? <DateCol date={pickupDate.toISOString()} /> : <span>-</span>;
      }
    },
    {
      id: "deliveredAt",
      header: () => <IconHeader columnKey="Delivery Time" />,
      cell: ({ row }) => {
        const deliveredDate = getDeliveredDate(row.original);
        return deliveredDate ? <DateCol date={deliveredDate.toISOString()} /> : <span>-</span>;
      }
    },
    {
      id: "deliveryPerformance",
      header: () => <IconHeader columnKey="Delivery Performance" />,
      cell: ({ row }) => (
        <DeliveryPerformanceBadge status={getDeliveryPerformance(row.original)} />
      )
    },
    {
      accessorKey: "totalPriceAfterDiscount",
      header: () => <IconHeader columnKey="TotalPriceAfterDiscount" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    },
    {
      id: "combinedDiscount",
      header: () => <IconHeader columnKey="Combined Discount" />,
      cell: ({ row }) => (
        <PriceAmount value={(row.original.discountValue ?? row.original.discountAmount) as number} />
      )
    },
    {
      accessorKey: "paidWithWallet",
      header: () => <IconHeader columnKey="PaidWithWallet" />,
      cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    },
    {
      accessorKey: "adminCommission",
      header: () => <IconHeader columnKey="AdminCommission" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    },
    {
      accessorKey: "globalCommission",
      header: () => <IconHeader columnKey="Platform Fee" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    },
    {
      accessorKey: "storeCommission",
      header: () => <IconHeader columnKey="Store Commission" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    },
    {
      accessorKey: "shipping",
      header: () => <IconHeader columnKey="Shipping" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    },
    {
      accessorKey: "tax",
      header: () => <IconHeader columnKey="Tax" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    },
    {
      accessorKey: "paymentStatus",
      header: () => <IconHeader columnKey="PaymentStatus" />,
      cell: ({ getValue }) => {
        const paymentStatus = getValue() as string;
        return <TableStatusBadge status={paymentStatus} />;
      }
    },
    {
      accessorKey: "status",
      header: () => <IconHeader columnKey="Status" />,
      cell: ({ row, getValue }) => {
        const status = getValue() as string;

        return (
          <div className="flex flex-col items-center gap-3 min-w-[200px]">
            <TableStatusBadge status={status} />
            <div className="">
              <OrderStatusSelect orderId={row?.original?.id} status={status} compact />
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "Delivery.User.name",
      header: () => <IconHeader columnKey="Delivery Name" />,
      cell: ({ row }) => {
        const value = row?.original?.Delivery?.User?.name;
        return <span>{value || "-"}</span>;
      }
    },
    {
      id: "assignDelivery",
      header: () => <IconHeader columnKey="Assign Delivery" />,
      cell: ({ row }) => (
        <AssignOrderDeliveryDialog
          orderId={row?.original?.id}
          currentDeliveryId={row?.original?.Delivery?.User?.id}
          triggerLabel={t("Assign")}
          triggerVariant="outline"
          triggerSize="sm"
        />
      )
    },
    {
      id: "adminNote",
      header: () => <IconHeader columnKey="Admin Note" />,
      cell: ({ row }) => {
        const status = row?.original?.status;
        const isDisabled = status === "DELIVERED";
        const note = row?.original?.adminNote;
        return (
          <div className="flex flex-col gap-2 min-w-[150px]">
            {note && (
              <span className="text-sm text-muted-foreground whitespace-pre-wrap">
                {note}
              </span>
            )}
            <AdminNoteDialog
              orderId={row?.original?.id}
              initialNote={note}
              disabled={isDisabled}
            />
          </div>
        );
      }
    }
  ];

  return columns;
}
