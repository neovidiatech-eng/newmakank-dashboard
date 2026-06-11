import ActiveCol from "@/components/common/table/columns/Ative.column";
import DateCol from "@/components/common/table/columns/date.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
import { type ColumnDef } from "@tanstack/react-table";

export default function ZonesColumns(): ColumnDef<Record<string, unknown>>[] {
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
      accessorKey: "City.name",
      header: () => <IconHeader columnKey="City" />,
      cell: ({ row }) => {
        const city = row.original.City as { name?: { en?: string; ar?: string } } | undefined;
        return <span>{city?.name?.ar || city?.name?.en || "-"}</span>;
      }
    },
    // {
    //   accessorKey: "coordinates",
    //   header: "Coordinates",
    //   cell: ({ getValue }) => <span>{getValue() as string}</span>
    // },
    {
      accessorKey: "createdAt",
      header: () => <IconHeader columnKey="CreatedAt" />,
      cell: ({ getValue }) => {
        return <DateCol date={getValue()} />;
      }
    },
    {
      accessorKey: "active",
      header: () => <IconHeader columnKey="Active" />,
      cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    }
  ];

  return columns;
}
