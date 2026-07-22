import { fetchHelper } from "@/api/fetch";
import { revalidatePathAction } from "@/api/global/revalidatePath";
import SelectPaginated from "@/components/common/Inputs/select/SelectPaginatedInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useTranslations } from "@/lib/i18n";
import { usePathname, useRouter } from "@/lib/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleBulkDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetchHelper({
        endPoint: ["orders", "bulk-delete"],
        method: "POST",
        body: {
          orderIds: selectedOrderIds.map(Number)
        }
      });

      if (!response?.success) throw response;

      const deletedCount = response?.data?.deletedCount ?? response?.deletedCount ?? 0;
      const failedDeletions = response?.data?.failed ?? [];

      if (deletedCount > 0) {
        toast.success(`${t("Orders Deleted Successfully")} (${deletedCount})`);
      }

      if (failedDeletions.length > 0) {
        toast.error(
          `${t("Some Orders Failed To Delete")} (${failedDeletions.length})`,
          {
            description: failedDeletions
              .slice(0, 3)
              .map((item: { id: number; reason: string }) => `#${item.id}: ${item.reason}`)
              .join(" | ")
          }
        );
      }

      setIsDeleteDialogOpen(false);
      onClearSelection();
      await revalidatePathAction(pathname);
      router.refresh();
    } catch (error: any) {
      toast.error(error?.result?.message || error?.message || t("Some Orders Failed To Delete"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="border-primary/30 bg-primary/5 p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">{t("Bulk assign delivery")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("Selected orders count")}: {selectedOrderIds.length}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end lg:w-auto">
            <div className="min-w-[240px] space-y-2">
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

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={onClearSelection}>
                {t("Cancel")}
              </Button>
              <Button type="button" onClick={handleAssign} isLoading={isSubmitting}>
                {t("Assign delivery")}
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="gap-1.5"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                {t("Delete Selected")}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t("Confirm Bulk Delete Title")}
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm">
              {t("Bulk Delete Warning")}
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm font-medium text-destructive">
            {t("Selected orders count")}: {selectedOrderIds.length} ({selectedOrderIds.map(id => `#${id}`).join(", ")})
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleBulkDelete}
              isLoading={isDeleting}
            >
              {t("Delete Selected")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

