import IconHeader from "@/components/common/table/columns/icon-header";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
import { type ColumnDef } from "@tanstack/react-table";

export default function VariationTemplateColumns(): ColumnDef<Record<string, unknown>>[] {
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
      accessorKey: "values",
      header: () => <IconHeader key="values" columnKey="Values" />,
      cell: ({ getValue }) => {
        console.log(getValue(), 'sadad')
        return (
          <span className="flex flex-col gap-2">
            {getValue()?.map((item: any, index: number) => (
              <span
                key={index}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md"
              >
                <span className="text-gray-600 dark:text-gray-300">•</span>
                {item?.name?.ar}
              </span>
            ))}
          </span>
        )
      }
    }
  ];

  return columns;
}
