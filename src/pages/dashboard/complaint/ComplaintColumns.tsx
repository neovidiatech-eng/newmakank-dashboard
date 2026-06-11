import DateCol from "@/components/common/table/columns/date.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import PhoneDirectionCol from "@/components/common/table/columns/Phone.direction";
import ChangeStatusTableAction from "@/components/common/table/tableActions/ChangeStatusTableAction";
import TableStatusBadge from "@/components/common/table/tableHelperComponents/TableStatusBadge";
import { PriceAmount } from "@/components/PriceAmount";
import { ComplaintTypeOptions } from "@/utils/options/typesOptions";
import { type ColumnDef } from "@tanstack/react-table";

export default function ComplaintColumns(): ColumnDef<Record<string, unknown>>[] {
  const columns = [
    {
      accessorKey: "id",
      header: () => <IconHeader columnKey="Id" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      accessorKey: "User.name",
      header: () => <IconHeader columnKey="User > Name" />,
      cell: ({ row }) => {
        const value = row.original.User?.name;
        return <span>{value || "-"}</span>;
      }
    },
    {
      accessorKey: "User.phone",
      header: () => <IconHeader columnKey="User > Phone" />,
      cell: ({ row }) => <PhoneDirectionCol value={row.original.User?.phone} />
    },
    {
      accessorKey: "reason",
      header: () => <IconHeader columnKey="Reason" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
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
      accessorKey: "createdAt",
      header: () => <IconHeader columnKey="CreatedAt" />,
      cell: ({ getValue }) => {
        return <DateCol date={getValue()} />;
      }
    },
    {
      accessorKey: "updatedAt",
      header: () => <IconHeader columnKey="UpdatedAt" />,
      cell: ({ getValue }) => {
        return <DateCol date={getValue()} />;
      }
    },
    {
      accessorKey: "Order.status",
      header: () => <IconHeader columnKey="Order > Status" />,
      cell: ({ row }) => {
        const Order_status = row.original.Order?.status;

        return <TableStatusBadge status={Order_status} />;
      }
    },
    {
      accessorKey: "Order.totalPriceAfterDiscount",
      header: () => <IconHeader columnKey="Order > TotalPriceAfterDiscount" />,
      cell: ({ row }) => <PriceAmount value={row.original.Order?.totalPriceAfterDiscount} />
    },
    {
      accessorKey: "id",
      header: () => <IconHeader columnKey="status" />,
      cell: ({ getValue, row }) => (
        <>
          <ChangeStatusTableAction
            status={row.original.status}
            statusKey={"status"}
            type="select"
            endpoint={["complaint", getValue() as number, "status"]}
            options={ComplaintTypeOptions(t => t).map(option => option.value)}
          />
        </>
      )
    }
  ];

  return columns;
}
