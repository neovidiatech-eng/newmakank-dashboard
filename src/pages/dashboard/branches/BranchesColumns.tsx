'use client'
import ActiveCol from "@/components/common/table/columns/Ative.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
import PhoneDirectionCol from "@/components/common/table/columns/Phone.direction";
import { type ColumnDef } from "@tanstack/react-table";

export default function BranchesColumns(): ColumnDef<Record<string, unknown>>[] {

  const columns = [
    {
      accessorKey: "name",
      header: () => <IconHeader key="name" columnKey="Name" />,
      cell: ({ row }) => {
        const en = row.original.name?.en as string;
        const ar = row.original.name?.ar as string;
        return (
          <LocaleViewColumn value={{ en, ar }} />
        );
      }
    },
    {
      accessorKey: "phone",
      header: () => <IconHeader columnKey="Phone" />,
      cell: ({ getValue }) => <PhoneDirectionCol value={getValue() as string} />
    },
    {
      accessorKey: "address",
      header: () => <IconHeader columnKey="Address" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      accessorKey: "isActive",
      header: () => <IconHeader columnKey="IsActive" />,
      cell: ({ getValue }) => <>{getValue()}
        <ActiveCol value={getValue() as boolean} />
      </>
    },
    {
      accessorKey: "closed",
      header: () => <IconHeader columnKey="Closed" />,
      cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    },
    {
      accessorKey: "rating",
      header: () => <IconHeader columnKey="Rating" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      accessorKey: "review",
      header: () => <IconHeader columnKey="Review" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      accessorKey: "bestRated",
      header: () => <IconHeader columnKey="BestRated" />,
      cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    },
    // {
    //   accessorKey: "temporarilyClosed",
    //   header: () => <IconHeader columnKey="TemporarilyClosed" />,
    //   cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    // },
    // {
    //   accessorKey: "storeSchedule",
    //   header: "StoreSchedule",
    //   cell: ({ getValue }) => <span>{getValue() as string}</span>
    // },
    // {
    //   accessorKey: "Store",
    //   header: "Store",
    //   cell: ({ getValue }) => <span>{getValue() as string}</span>
    // },
    {
      accessorKey: "isOpen",
      header: () => <IconHeader columnKey="IsOpen" />,
      cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    }
  ];

  return columns;
}
