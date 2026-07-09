import { PriceAmount } from "@/components/PriceAmount";
import DateCol from "@/components/common/table/columns/date.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import DeliveryWithdrawalAction from "@/components/pages/_delivery/DeliveryWithdrawalAction";
import { type ColumnDef } from "@tanstack/react-table";

export default function DeliveryWithdrawalsColumns(): ColumnDef<Record<string, unknown>>[] {
  const columns = [
    {
      accessorKey: "Delivery.User.name",
      header: () => <IconHeader columnKey="Delivery Name" />,
      cell: ({ row }) => {
        const value = row.original.Delivery?.User?.name ?? row.original.Delivery?.name;
        return <span>{value || "-"}</span>;
      }
    },
    {
      accessorKey: "amount",
      header: () => <IconHeader columnKey="Amount" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    },
    {
      accessorKey: "payoutMethod",
      header: () => <IconHeader columnKey="payoutMethod" />,
      cell: ({ getValue }) => <span>{(getValue() as string) || "-"}</span>
    },
    {
      accessorKey: "payoutDetails",
      header: () => <IconHeader columnKey="payoutDetails" />,
      cell: ({ getValue }) => <span>{(getValue() as string) || "-"}</span>
    },
    {
      accessorKey: "createdAt",
      header: () => <IconHeader columnKey="CreatedAt" />,
      cell: ({ getValue }) => <DateCol date={getValue()} />
    },
    {
      accessorKey: "adminNote",
      header: () => <IconHeader columnKey="Admin Note" />,
      cell: ({ getValue }) => <span>{(getValue() as string) || "-"}</span>
    },
    {
      id: "status",
      header: () => <IconHeader columnKey="Status" />,
      cell: ({ row }) => (
        <DeliveryWithdrawalAction
          withdrawalId={row.original.id as number}
          status={row.original.status as string}
        />
      )
    }
  ];

  return columns;
}
