'use client'
import DateCol from "@/components/common/table/columns/date.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import { ImageCell } from "@/components/common/table/columns/img-cell";
import StatusCol from "@/components/common/table/columns/status.column";
import { type ColumnDef } from "@tanstack/react-table";

export default function TransactionsColumns(): ColumnDef<Record<string, unknown>>[] {

  const columns = [
  {
    accessorKey: "credit",
    header: () => <IconHeader columnKey="Credit" />,
    cell: ({ getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: "debit",
    header: () => <IconHeader columnKey="Debit" />,
    cell: ({ getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: "balance",
    header: () => <IconHeader columnKey="Balance" />,
    cell: ({ getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: "createdAt",
    header: () => <IconHeader columnKey="CreatedAt" />,
   cell: ({ getValue }) => {
		  return (
			<DateCol date={getValue()} />
		  );
		}
  },
  {
    accessorKey: "type",
    header: () => <IconHeader columnKey="Type" />,
    cell: ({ getValue }) => <StatusCol value={getValue() as string} />
  },
  {
    accessorKey: "userType",
    header: () => <IconHeader columnKey="UserType" />,
    cell: ({ getValue }) => <StatusCol value={getValue() as string} />
  },
  {
    accessorKey: "Customer.name",
    header: () => <IconHeader columnKey="Customer > Name" />,
    cell: ({ row }) => {
      const value = row.original.Customer?.name;
      return <span>{value || '-'}</span>;
    }
  },
  {
    accessorKey: "Customer.image",
    header: () => <IconHeader columnKey="Customer > Image" />,
    cell: ({ row }) => {
      const image = row.original.Customer?.image;
      return (
        <div className="flex items-center justify-center w-full h-12 overflow-hidden">
          <ImageCell cell={image} />
        </div>
      );
    }
  }
  ];

  return columns;
}
