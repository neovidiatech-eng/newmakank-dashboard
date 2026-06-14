// Store templates columns configuration
import IconHeader from "@/components/common/table/columns/icon-header";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
import ToggleStatus from "@/components/common/table/tableActions/ToggleStatus";
import { type ColumnDef } from "@tanstack/react-table";

export default function Columns(): ColumnDef<Record<string, unknown>>[] {
  const columns = [
    {
      accessorKey: "name",
      header: () => <IconHeader key="name" columnKey="Name" />,
      cell: ({ row }) => {
        const en = row.original.name?.en as string;
        const ar = row.original.name?.ar as string;
        return <LocaleViewColumn value={{ en, ar }} />;
      }
    },
    {
      accessorKey: "moduleType",
      header: () => <IconHeader columnKey="Module Type" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      accessorKey: "order",
      header: () => <IconHeader columnKey="sorting Order" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      accessorKey: "active",
      header: () => <IconHeader columnKey="Status" />,
      cell: ({ row }) => {
        const active = Boolean(row.original.active);
        return <ToggleStatus 
          id={row.original.id as string | number}
          isActive={active} 
          endpoint={["storeTemplates"]} 
          body={{ active: !active }} 
        />;
      }
    }
  ];
  return columns as ColumnDef<Record<string, unknown>>[];
}
