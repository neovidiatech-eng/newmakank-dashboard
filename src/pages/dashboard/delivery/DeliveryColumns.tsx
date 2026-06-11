import EntityInfoCell from "@/components/common/table/columns/entity-info-cell";
import IconHeader from "@/components/common/table/columns/icon-header";
import ToggleStatus from "@/components/common/table/tableActions/ToggleStatus";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "@/lib/i18n";

export default function DeliveryColumns(): ColumnDef<Record<string, unknown>>[] {
  const t = useTranslations();
  const columns = [
    {
      id: "deliveryInfo",
      header: () => <IconHeader columnKey="Delivery" />,
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
      id: "statusToggle",
      header: () => <IconHeader columnKey="Forced Availability" />,
      cell: ({ row }) => {
        const forceAvailable = (row.original.forceAvailable ??
          (row.original as any).DeliveryDetails?.[0]?.forceAvailable) as boolean;
        return (
          <ToggleStatus
            id={row.original.id as string | number}
            body={{
              forceAvailable: !forceAvailable
            }}
            isActive={forceAvailable}
            endpoint={["delivery"]}
          />
        );
      }
    },
    {
      id: "availableToday",
      header: () => <IconHeader columnKey="Working Today" />,
      cell: ({ row }) => {
        const details = (row.original as any).DeliveryDetails?.[0];
        const availableNow = (row.original.availableNow ?? details?.availableNow) as boolean;

        return (
          <div className="flex flex-col items-center gap-2">
            <ToggleStatus
              id={row.original.id as string | number}
              body={{
                availableNow: !availableNow
              }}
              isActive={availableNow}
              endpoint={["delivery"]}
            />
            <Badge
              variant={availableNow ? "success" : "muted"}
              className="rounded-full text-[11px]"
            >
              {availableNow ? t("Working") : t("Not Working")}
            </Badge>
          </div>
        );
      }
    }
  ];

  return columns;
}
