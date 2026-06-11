import { PriceAmount } from "@/components/PriceAmount";
import ActiveCol from "@/components/common/table/columns/Ative.column";
import DateCol from "@/components/common/table/columns/date.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import StatusCol from "@/components/common/table/columns/status.column";
import TableStatusBadge from "@/components/common/table/tableHelperComponents/TableStatusBadge";
import { OrderCustomerCell } from "@/components/pages/_orders/OrderCustomerCell";
import { OrderServicesCell } from "@/components/pages/_orders/OrderServicesCell";
import RealizeOrderButton from "@/components/pages/_orders/RealizeOrderButton";
import { useTranslations } from "@/lib/i18n";

export default function ArchivedOrdersColumns(): any {
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
        return <span>{store?.name?.en || store?.name?.ar || "-"}</span>;
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
      accessorKey: "date",
      header: () => <IconHeader columnKey="Date" />,
      cell: ({ getValue }) => {
        return <DateCol date={getValue()} />;
      }
    },
    {
      accessorKey: "createdAt",
      header: () => <IconHeader columnKey="CreatedAt" />,
      cell: ({ getValue }) => {
        return <DateCol date={getValue()} />;
      }
    },
    {
      accessorKey: "totalPriceAfterDiscount",
      header: () => <IconHeader columnKey="TotalPriceAfterDiscount" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    },
    {
      accessorKey: "discountAmount",
      header: () => <IconHeader columnKey="DiscountAmount" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    },
    {
      accessorKey: "paidWithWallet",
      header: () => <IconHeader columnKey="PaidWithWallet" />,
      cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    },
    {
      accessorKey: "adminCommission",
      header: () => <IconHeader columnKey="AdminCommission" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      accessorKey: "shipping",
      header: () => <IconHeader columnKey="Shipping" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      accessorKey: "tax",
      header: () => <IconHeader columnKey="Tax" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
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
      accessorKey: "paymentMethod",
      header: () => <IconHeader columnKey="PaymentMethod" />,
      cell: ({ getValue }) => <StatusCol value={getValue() as string} />
    },
    {
      accessorKey: "status",
      header: () => <IconHeader columnKey="Status" />,
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return <TableStatusBadge status={status} />;
      }
    },
    {
      accessorKey: "type",
      header: () => <IconHeader columnKey="Type" />,
      cell: ({ getValue }) => <span>{t(getValue() as string)}</span>
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
      id: "actions",
      header: () => <IconHeader columnKey="Actions" />,
      cell: ({ row }) => (
        <RealizeOrderButton orderId={row?.original?.id} />
      )
    }
  ];

  return columns;
}
