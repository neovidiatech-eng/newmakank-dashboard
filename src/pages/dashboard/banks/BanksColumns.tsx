import IconHeader from "@/components/common/table/columns/icon-header";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
import { type ColumnDef } from "@tanstack/react-table";

export default function BanksColumns(): ColumnDef<Record<string, unknown>>[] {
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
    }
  ];

  return columns;
}
