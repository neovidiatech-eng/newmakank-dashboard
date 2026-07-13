import IconHeader from "@/components/common/table/columns/icon-header";
import DateCol from "@/components/common/table/columns/date.column";
import TableStatusBadge from "@/components/common/table/tableHelperComponents/TableStatusBadge";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import { PriceAmount } from "@/components/PriceAmount";

export default function OnlineDeliveryColumns(): ColumnDef<Record<string, unknown>>[] {
  const columns: ColumnDef<Record<string, unknown>>[] = [
    {
      accessorKey: "id",
      header: () => <IconHeader columnKey="Order ID" />,
      cell: ({ getValue }) => (
        <span className="font-semibold">#{getValue() as number}</span>
      )
    },
    {
      accessorKey: "senderName",
      header: () => <IconHeader columnKey="Sender" />,
      cell: ({ row }) => {
        const stations = (row.original as any)?.Stations ?? [];
        const pickup = stations.find((s: any) => s.type === "PICKUP");
        const name = pickup?.name || (row.original as any)?.senderName || "-";
        const phone = pickup?.contactPhone || (row.original as any)?.senderPhone || "";
        return (
          <div>
            <div className="font-medium">{name}</div>
            {phone && (
              <div dir="ltr" className="text-xs text-muted-foreground">
                {phone}
              </div>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "recipientsCount",
      header: () => <IconHeader columnKey="Recipients" />,
      cell: ({ row }) => {
        const stations = (row.original as any)?.Stations ?? [];
        const dropoffs = stations.filter((s: any) => s.type === "DROPOFF");
        return (
          <Badge variant="secondary" className="font-mono">
            {dropoffs.length || "-"}
          </Badge>
        );
      }
    },
    {
      accessorKey: "totalPriceAfterDiscount",
      header: () => <IconHeader columnKey="Total" />,
      cell: ({ getValue }) => (
        <span className="font-medium">
          <PriceAmount value={getValue() as number} />
        </span>
      )
    },
    {
      accessorKey: "shipping",
      header: () => <IconHeader columnKey="Shipping" />,
      cell: ({ getValue }) => (
        <PriceAmount value={getValue() as number} />
      )
    },
    {
      accessorKey: "paymentMethod",
      header: () => <IconHeader columnKey="Payment Method" />,
      cell: ({ getValue }) => (
        <Badge variant="outline" className="capitalize">
          {getValue() as string}
        </Badge>
      )
    },
    {
      accessorKey: "status",
      header: () => <IconHeader columnKey="Status" />,
      cell: ({ getValue }) => <TableStatusBadge status={getValue() as string} />
    },
    {
      accessorKey: "createdAt",
      header: () => <IconHeader columnKey="CreatedAt" />,
      cell: ({ getValue }) => <DateCol date={getValue() as string} />
    }
  ];

  return columns;
}
