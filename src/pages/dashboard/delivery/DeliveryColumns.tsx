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
      id: "verifiedToggle",
      header: () => <IconHeader columnKey="Verified Status" />,
      cell: ({ row }) => {
        const isVerified = Boolean(row.original.isVerified ?? row.original.verified);
        return (
          <ToggleStatus
            id={row.original.id as string | number}
            body={{
              verified: !isVerified
            }}
            isActive={isVerified}
            endpoint={["delivery"]}
          />
        );
      }
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
    },
    {
      id: "currentOrder",
      header: () => <IconHeader columnKey="Current Order" />,
      cell: ({ row }) => {
        const currentOrder = (row.original as any)?.currentOrder;
        if (!currentOrder) {
          return (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-300">
              🟢 {t("Available") || "متاح"}
            </Badge>
          );
        }

        const statusText =
          currentOrder.status === "ON_THE_WAY"
            ? "في الطريق"
            : currentOrder.status === "READY_PICKUP"
            ? "جاهز للاستلام"
            : currentOrder.status === "PREPARING"
            ? "جاري التحضير"
            : currentOrder.status === "PENDING"
            ? "قيد الانتظار"
            : currentOrder.status;

        return (
          <div className="flex flex-col gap-1 text-xs">
            <Badge variant="outline" className="w-fit gap-1 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 font-semibold">
              🔴 {t("Busy") || "مشغول"} (#{currentOrder.id})
            </Badge>
            {currentOrder.storeName && (
              <span className="text-muted-foreground font-medium text-[11px]">
                {currentOrder.storeName}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground">
              {statusText}
            </span>
          </div>
        );
      }
    }
  ];

  return columns;
}
