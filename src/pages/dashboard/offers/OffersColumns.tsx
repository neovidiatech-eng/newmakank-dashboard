import DateCol from "@/components/common/table/columns/date.column";
import IconHeader from "@/components/common/table/columns/icon-header";
import LocaleViewColumn from "@/components/common/table/columns/locale-view.column";
import { ImageCell } from "@/components/common/table/columns/img-cell";
import ToggleStatus from "@/components/common/table/tableActions/ToggleStatus";
import { type ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "@/lib/i18n";

export default function OffersColumns(): ColumnDef<Record<string, unknown>>[] {
  const t = useTranslations();
  const columns = [
    {
      accessorKey: "image",
      header: () => <IconHeader columnKey="Image" />,
      cell: ({ getValue }) => (
        <div className="flex items-center justify-center w-full h-12 overflow-hidden">
          <ImageCell cell={getValue() as string} />
        </div>
      )
    },
    {
      accessorKey: "title",
      header: () => <IconHeader columnKey="Title" />,
      cell: ({ getValue }) => {
        const value = getValue() as { en?: string; ar?: string } | undefined;
        return <LocaleViewColumn value={{ en: value?.en, ar: value?.ar }} />;
      }
    },
    {
      id: "rule",
      header: () => <IconHeader columnKey="Offer Rule" />,
      cell: ({ row }) => {
        const paid = row.original.requiredPaidQuantity as number;
        const free = row.original.freeQuantity as number;
        const paidSizeRule = row.original.paidSizeRule as string;
        const paidSizeName = row.original.paidRequiredSizeName as string;
        const freeSizeRule = row.original.freeSizeRule as string;
        const freeSizeName = row.original.freeRequiredSizeName as string;
        const freeValueRule = row.original.freeValueRule as string;
        const maxFreeValue = row.original.maxFreeItemValue as number;

        let ruleText = `${t("Buy")} ${paid} ${t("Get")} ${free} ${t("Free")}`;
        
        const details: string[] = [];
        if (paidSizeRule === "NAME" && paidSizeName) {
          details.push(`${t("Paid size", "مقاس المدفوع")}: ${paidSizeName}`);
        }
        if (freeSizeRule === "NAME" && freeSizeName) {
          details.push(`${t("Free size", "مقاس الهدية")}: ${freeSizeName}`);
        }
        if (freeValueRule === "MAX_FREE_VALUE" && maxFreeValue) {
          details.push(`${t("Max free value", "سقف")}: ${maxFreeValue} EGP`);
        } else if (freeValueRule === "CAP_TO_CHEAPEST_PAID") {
          details.push(t("Cap to cheapest paid", "سقف سعر الهدية = أرخص مدفوع"));
        }

        return (
          <div className="flex flex-col text-start">
            <span className="font-semibold text-sm">{ruleText}</span>
            {details.length > 0 && (
              <span className="text-xs text-muted-foreground mt-0.5">
                {details.join(" | ")}
              </span>
            )}
          </div>
        );
      }
    },
    {
      accessorKey: "startDate",
      header: () => <IconHeader columnKey="startDate" />,
      cell: ({ getValue }) => (getValue() ? <DateCol date={getValue()} /> : <span>-</span>)
    },
    {
      accessorKey: "endDate",
      header: () => <IconHeader columnKey="endDate" />,
      cell: ({ getValue }) => (getValue() ? <DateCol date={getValue()} /> : <span>-</span>)
    },
    {
      accessorKey: "isActive",
      header: () => <IconHeader columnKey="Status" />,
      cell: ({ row }) => (
        <ToggleStatus
          id={row.original.id as string | number}
          isActive={row.original.isActive as boolean}
          endpoint={["bundles"]}
          body={{ isActive: !row.original.isActive }}
        />
      )
    },
    {
      accessorKey: "createdAt",
      header: () => <IconHeader columnKey="CreatedAt" />,
      cell: ({ getValue }) => <DateCol date={getValue()} />
    }
  ];

  return columns;
}
