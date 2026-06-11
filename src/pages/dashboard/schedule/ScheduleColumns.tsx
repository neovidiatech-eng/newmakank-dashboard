'use client'
import DateCol from "@/components/common/table/columns/date.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import StatusCol from "@/components/common/table/columns/status.column";
import { type ColumnDef } from "@tanstack/react-table";

export default function ScheduleColumns(): ColumnDef<Record<string, unknown>>[] {

  const columns = [
  {
    accessorKey: "id",
    header: () => <IconHeader columnKey="Id" />,
    cell: ({ getValue }) => <span>{getValue() as string}</span>
  },
  {
    accessorKey: "openingTime", 
    header: () => <IconHeader columnKey="OpeningTime" />,
   cell: ({ getValue }) => {
		  return (
			<DateCol date={getValue()} />
		  );
		}
  },
  {
    accessorKey: "closingTime",
    header: () => <IconHeader columnKey="ClosingTime" />,
   cell: ({ getValue }) => {
		  return (
			<DateCol date={getValue()} />
		  );
		}
  },
  {
    accessorKey: "day",
    header: () => <IconHeader columnKey="Day" />,
    cell: ({ getValue }) => <StatusCol value={getValue() as string} />
  },
  {
    accessorKey: "branchId",
    header: () => <IconHeader columnKey="BranchId" />,
    cell: ({ getValue }) => <span>{getValue() as string}</span>
  }
  ];

  return columns;
}
