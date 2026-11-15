import ActiveCol from "@/components/common/table/columns/Ative.column";
import DateCol from "@/components/common/table/columns/date.column";
import EntityInfoCell from "@/components/common/table/columns/entity-info-cell";
import IconHeader from "@/components/common/table/columns/icon-header";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
import TableStatusBadge from "@/components/common/table/tableHelperComponents/TableStatusBadge";
import { PriceAmount } from "@/components/PriceAmount";
import { type ColumnDef } from "@tanstack/react-table";
import ToggleStatus from "@/components/common/table/tableActions/ToggleStatus";

export default function ServicesColumns(): ColumnDef<Record<string, unknown>>[] {
  const columns = [
    {
      id: "serviceInfo",
      header: () => <IconHeader columnKey="Service" />,
      cell: ({ row }) => (
        <EntityInfoCell
          image={row.original.image as string | null | undefined}
          name={row.original.name?.en as string | null | undefined}
          email={row.original.name?.ar as string | null | undefined}
        />
      )
    },
    {
      accessorKey: "description",
      header: () => <IconHeader key="description" columnKey="Description" />,
      cell: ({ row }) => {
        const en = row.original.description?.en as string;
        const ar = row.original.description?.ar as string;
        return (
          <LocaleViewColumn value={{ en, ar }} />
        );
      }
    },
    {
      accessorKey: "durationMinutes",
      header: () => <IconHeader columnKey="DurationMinutes" />,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      accessorKey: "price",
      header: () => <IconHeader columnKey="Price" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    },
    {
      accessorKey: "status",
      header: () => <IconHeader columnKey="Status" />,
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return <TableStatusBadge status={status} />;
      }
    },
    {
      accessorKey: "totalOrders",
      header: () => <IconHeader columnKey="TotalOrders" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
    },
    {
      accessorKey: "totalAmountSold",
      header: () => <IconHeader columnKey="TotalAmountSold" />,
      cell: ({ getValue }) => <PriceAmount value={getValue() as number} />
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
    {
      accessorKey: "mostSeller",
      header: () => <IconHeader columnKey="MostSeller" />,
      cell: ({ getValue }) => <ActiveCol value={getValue() as boolean} />
    },
    {
      accessorKey: "available",
      header: () => <IconHeader columnKey="available" />,
      cell: ({ row }) => (
        <ToggleStatus
          id={row.original.id as string | number}
          body={{
            available: !row.original.available as boolean
          }}
          isActive={row.original.available as boolean}
          endpoint={["services"]}
        />
      )
    },
    {
      accessorKey: "createdAt",
      header: () => <IconHeader columnKey="CreatedAt" />,
      cell: ({ getValue }) => {
        return <DateCol date={getValue()} />;
      }
    },
    {
      accessorKey: "priceWithDefaultOptions",
      header: () => <IconHeader columnKey="PriceWithDefaultOptions" />,
      cell: ({ row, getValue }) => {
        const hasDiscount = row.original.hasDiscount;
        const price = row.original.price as number;
        const effectivePrice = row.original.effectivePrice as number;
        const priceWithDefault = getValue() as number;

        if (hasDiscount) {
          return (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground line-through">
                <PriceAmount value={price} />
              </span>
              <div className="flex items-center gap-1">
                <span className="bg-destructive text-destructive-foreground text-[10px] px-1 rounded font-bold">Sale</span>
                <PriceAmount value={effectivePrice || priceWithDefault} />
              </div>
            </div>
          );
        }
        return <PriceAmount value={effectivePrice || priceWithDefault || price} />;
      }
    },
    {
      accessorKey: "Store.name",
      header: () => <IconHeader columnKey="Store > Name" />,
      cell: ({ row }) => {
        const value = row.original.Store?.name;
        return <LocaleViewColumn value={value} />;
      }
    }
  ];

  return columns;
}
