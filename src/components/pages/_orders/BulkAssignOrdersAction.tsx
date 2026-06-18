import { fetchHelper } from "@/api/fetch";
import { revalidatePathAction } from "@/api/global/revalidatePath";
import SelectPaginated from "@/components/common/Inputs/select/SelectPaginatedInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslations } from "@/lib/i18n";
import { usePathname, useRouter } from "@/lib/navigation";
import { useState } from "react";
import { toast } from "sonner";

type BulkAssignOrdersActionProps = {
  selectedOrderIds: string[];
  onClearSelection: () => void;
};

export default function BulkAssignOrdersAction({
  selectedOrderIds,
  onClearSelection
}: BulkAssignOrdersActionProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [deliveryId, setDeliveryId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (selectedOrderIds.length === 0) return null;

  const handleAssign = async () => {
    if (!deliveryId) {
      toast.error(t("Please select a delivery"));
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetchHelper({
        endPoint: ["orders", "assign"],
        method: "PATCH",
        body: {
          specialistId: Number(deliveryId),
          orderIds: selectedOrderIds.map(Number)
        }
      });

      if (!response?.success) throw response;

      const succeededAssignments = response?.data?.succeeded ?? [];
      const failedAssignments = response?.data?.failed ?? [];

      if (succeededAssignments.length > 0) {
        toast.success(
          `${t("Selected orders assigned successfully")} (${succeededAssignments.length})`
        );
      }

      if (failedAssignments.length > 0) {
        toast.error(
          `${t("Some orders failed to assign")} (${failedAssignments.length})`,
          {
            description: failedAssignments
              .slice(0, 3)
              .map((item: { orderId: number; reason: string }) => `#${item.orderId}: ${item.reason}`)
              .join(" | ")
          }
        );
      }

      if (succeededAssignments.length > 0) {
        setDeliveryId("");
        onClearSelection();
        await revalidatePathAction(pathname);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error?.result?.message || error?.message || t("Failed to assign selected orders"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-primary/30 bg-primary/5 p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">{t("Bulk assign delivery")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("Selected orders count")}: {selectedOrderIds.length}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end lg:w-auto">
          <div className="min-w-[260px] space-y-2">
            <div className="text-sm font-medium text-foreground">{t("Delivery")}</div>
            <SelectPaginated
              apiUrl={["delivery"]}
              name="bulkDeliveryId"
              value={deliveryId}
              onChange={value => setDeliveryId(String(value))}
              labelKey="name"
              idKey="id"
              placeholder={t("Select delivery")}
              searchFilters={[{ key: "active", value: "true" }]}
              onLabelAction={(res: any) => {
                const filterFunc = (d: any) => {
                  const details = d.DeliveryDetails?.[0] ?? {};
                  const forceAvailable = Boolean(d.isAvailable ?? d.forceAvailable ?? details.forceAvailable);
                  const isOnShift = Boolean(d.isOnShift ?? details.availableNow);
                  return isOnShift || forceAvailable;
                };

                if (res?.data && Array.isArray(res.data)) {
                  res.data = res.data.filter(filterFunc);
                } else if (Array.isArray(res)) {
                  res = res.filter(filterFunc);
                }
                return res;
              }}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClearSelection}>
              {t("Cancel")}
            </Button>
            <Button type="button" onClick={handleAssign} isLoading={isSubmitting}>
              {t("Assign delivery")}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
