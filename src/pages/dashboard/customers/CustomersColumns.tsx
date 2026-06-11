import ActiveCol from "@/components/common/table/columns/Ative.column";
import EntityInfoCell from "@/components/common/table/columns/entity-info-cell";
import IconHeader from "@/components/common/table/columns/icon-header";
import ToggleStatus from "@/components/common/table/tableActions/ToggleStatus";
import { type ColumnDef } from "@tanstack/react-table";

export default function CustomersColumns(): ColumnDef<Record<string, unknown>>[] {
  const columns = [
    {
      id: "customerInfo",
      header: () => <IconHeader columnKey="Customer" />,
      cell: ({ row }) => (
        <EntityInfoCell
          image={row.original.image as string | null | undefined}
          name={row.original.name as string | null | undefined}
          email={row.original.email as string | null | undefined}
          phone={row.original.phone as string | null | undefined}
        />
      )
    },
    {
      accessorKey: "allowNotification",
      header: () => <IconHeader columnKey="AllowNotification" />,
      cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    },
    {
      accessorKey: "verified",
      header: () => <IconHeader columnKey="Verified" />,
      cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    },

    {
      accessorKey: "active",
      header: () => <IconHeader columnKey="Active" />,
      cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    },
    {
      id: "statusToggle",
      header: () => <IconHeader columnKey="UpdateStatus" />,
      cell: ({ row }) => (
        <ToggleStatus
          id={row.original.id as string | number}
          body={{
            active: !row.original.active as boolean
          }}
          isActive={row.original.active as boolean}
          endpoint={["users"]}
        />
      )
    }

    // {
    //   accessorKey: "createdAt",
    //   header: "CreatedAt",
    //   cell: ({ getValue }) => {
    //     return (
    //       <DateCol date={getValue()} />
    //     );
    //   }
    // },
    // {
    //   accessorKey: "totalOrders",
    //   header: "TotalOrders",
    //   cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    // },
    // {
    //   accessorKey: "totalSpent",
    //   header: "TotalSpent",
    //   cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    // }
  ];

  return columns;
}
