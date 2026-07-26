import IconHeader from "@/components/common/table/columns/icon-header";
import { ImageCell } from "@/components/common/table/columns/img-cell";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
import ToggleStatus from "@/components/common/table/tableActions/ToggleStatus";
import { type ColumnDef } from "@tanstack/react-table";

export default function StoreCategoryColumns(t: any): ColumnDef<Record<string, unknown>>[] {
  return [
    {
      accessorKey: "name",
      header: () => <IconHeader key="name" columnKey="Name" />,
      cell: ({ row }) => {
        const en = (row.original.name as any)?.en as string;
        const ar = (row.original.name as any)?.ar as string;
        return <LocaleViewColumn value={{ en, ar }} />;
      }
    },
    {
      accessorKey: "image",
      header: () => <IconHeader columnKey="Image" />,
      cell: ({ getValue }) => {
        const image = getValue() as string;
        return (
          <div className="flex items-center justify-center w-full h-12 overflow-hidden">
            <ImageCell cell={image} />
          </div>
        );
      }
    },
    {
      accessorKey: "order",
      header: () => <IconHeader columnKey="sorting Order" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      // templateCategoryId: null  → custom restaurant category (فئة المطعم)
      // templateCategoryId: number → from a template (من القالب)
      accessorKey: "templateCategoryId",
      header: () => <IconHeader columnKey="Type" />,
      cell: ({ getValue }) => {
        const templateCategoryId = getValue() as number | null | undefined;
        const isCustom = templateCategoryId === null || templateCategoryId === undefined;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isCustom
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            }`}
          >
            {isCustom ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                {t("Store Category")}
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
                {t("From Template")}
              </>
            )}
          </span>
        );
      }
    },
    {
      accessorKey: "active",
      header: () => <IconHeader columnKey="Status" />,
      cell: ({ row }) => (
        <ToggleStatus
          id={row.original.id as string | number}
          body={{
            active: !row.original.active as boolean
          }}
          isActive={row.original.active as boolean}
          endpoint={["categories"]}
        />
      )
    }
  ];
}
