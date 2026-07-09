import { PriceAmount } from "@/components/PriceAmount";
import DateCol from "@/components/common/table/columns/date.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import { type ColumnDef } from "@tanstack/react-table";

export default function CashSettlementsColumns(): ColumnDef<Record<string, unknown>>[] {
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
      accessorKey: "note",
      header: () => <IconHeader columnKey="Note" />,
      cell: ({ getValue }) => <span>{(getValue() as string) || "-"}</span>
    },
    {
      accessorKey: "createdAt",
      header: () => <IconHeader columnKey="CreatedAt" />,
      cell: ({ getValue }) => <DateCol date={getValue()} />
    }
  ];

  return columns;
}
