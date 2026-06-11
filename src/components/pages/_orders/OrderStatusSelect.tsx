import { updateOrderStatus } from "@/api/orders/update-order-status";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_OPTIONS, type OrderStatus } from "@/utils/options/orderStatusOptions";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "@/lib/i18n";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const STATUS_COLOR_MAP: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500",
  PREPARING: "bg-blue-500",
  READY_PICKUP: "bg-emerald-500",
  ON_THE_WAY: "bg-violet-500",
  DELIVERED: "bg-green-600",
  CANCELLED: "bg-rose-500",
  REJECTED: "bg-red-500",
  PAYMENT_FAILD: "bg-orange-500",
  PENDING_PAYMENT: "bg-yellow-500"
};

export default function OrderStatusSelect({
  orderId,
  status,
  compact = false
}: {
  orderId: number;
  status: string;
  compact?: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    (ORDER_STATUS_OPTIONS.includes(status as OrderStatus) ? status : "PENDING") as OrderStatus
  );

  const handleStatusChange = (nextStatus: string) => {
    const previousStatus = selectedStatus;
    const typedNextStatus = nextStatus as OrderStatus;
    setSelectedStatus(typedNextStatus);

    startTransition(() => {
      toast.promise(updateOrderStatus(orderId, typedNextStatus), {
        loading: t("Updating"),
        success: () => {
          router.refresh();
          return t("Updated Successfully");
        },
        error: err => {
          setSelectedStatus(previousStatus);
          return t(err?.message || "Something went wrong");
        }
      });
    });
  };

  return (
    <div className={cn("space-y-2", compact && "space-y-1")}>
      <Select value={selectedStatus} onValueChange={handleStatusChange} disabled={isPending}>
        <SelectTrigger className={cn("min-w-[180px]", compact && "h-8 min-w-[150px]")}>
          <SelectValue placeholder={t("Status")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t("Change Status")}</SelectLabel>
            {ORDER_STATUS_OPTIONS.map(option => (
              <SelectItem key={option} value={option}>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex h-2 w-2 rounded-full",
                      STATUS_COLOR_MAP[option] ?? "bg-muted-foreground"
                    )}
                  />
                  <span>{t(option)}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {!compact && (
        <Badge variant="outline" className="w-fit text-xs font-normal">
          {t("Current")}: {t(selectedStatus)}
        </Badge>
      )}
    </div>
  );
}
