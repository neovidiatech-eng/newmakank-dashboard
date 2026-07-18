import IconHeader from "@/components/common/table/columns/icon-header";
import { ImageCell } from "@/components/common/table/columns/img-cell";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
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
      accessorKey: "isCustomStoreCategory",
      header: () => <IconHeader columnKey="Type" />,
      cell: ({ getValue }) => {
        const isCustom = getValue() as boolean;
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
                فئة متجر
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
                فئة قالب
              </>
            )}
          </span>
        );
      }
    },
    {
      accessorKey: "Store.name",
      header: () => <IconHeader columnKey="Store" />,
      cell: ({ row }) => {
        const isCustom = row.original.isCustomStoreCategory as boolean;
        const store = row.original.Store as { name?: { ar?: string; en?: string } } | undefined;
        const storeName = row.original.storeName as string | undefined;
        const storeId = row.original.storeId as number | undefined;

        if (!isCustom) {
          return <span className="text-muted-foreground text-xs">—</span>;
        }

        // Backend may embed the relation (Store.name = {ar,en}) or return a flat storeName
        // string, or (as a last resort) only the raw storeId — handle all three.
        if (store?.name) {
          return (
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              <LocaleViewColumn value={store.name} />
            </span>
          );
        }

        return (
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {storeName ?? (storeId ? `#${storeId}` : "—")}
          </span>
        );
      }
    },
  ];
  return columns;
}
