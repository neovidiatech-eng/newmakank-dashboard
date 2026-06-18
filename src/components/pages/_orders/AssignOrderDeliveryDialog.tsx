import { fetchHelper } from "@/api/fetch";
import { revalidatePathAction } from "@/api/global/revalidatePath";
import SelectPaginated from "@/components/common/Inputs/select/SelectPaginatedInput";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useTranslations } from "@/lib/i18n";
import { usePathname, useRouter } from "@/lib/navigation";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type AssignOrderDeliveryDialogProps = {
  orderId: number;
  currentDeliveryId?: number | null;
  triggerLabel?: string;
  triggerVariant?: ButtonProps["variant"];
  triggerSize?: ButtonProps["size"];
  triggerClassName?: string;
  disabled?: boolean;
};

export default function AssignOrderDeliveryDialog({
  orderId,
  currentDeliveryId,
  triggerLabel,
  triggerVariant = "outline",
  triggerSize = "sm",
  triggerClassName,
  disabled
}: AssignOrderDeliveryDialogProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const defaultLabel = useMemo(() => t("Assign delivery"), [t]);
  const [open, setOpen] = useState(false);
  const [deliveryId, setDeliveryId] = useState<number | string | null>(currentDeliveryId ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setDeliveryId(currentDeliveryId ?? "");
    }
  }, [currentDeliveryId, open]);

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
          orderIds: [Number(orderId)]
        }
      });

      if (!response?.success) {
        throw response;
      }

      const failedAssignments = response?.data?.failed ?? [];
      const succeededAssignments = response?.data?.succeeded ?? [];

      if (failedAssignments.length > 0 && succeededAssignments.length === 0) {
        toast.error(failedAssignments[0]?.reason || t("Failed to assign delivery"));
        return;
      }

      toast.success(response?.message || t("delivery assigned"));
      setOpen(false);
      await revalidatePathAction(pathname);
      router.refresh();
    } catch (error: any) {
      toast.error(error?.result?.message || error?.message || t("Failed to assign delivery"));
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={triggerVariant}
          size={triggerSize}
          className={triggerClassName}
          disabled={disabled}
        >
          {triggerLabel ? t(triggerLabel) : defaultLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-visible">
        <DialogHeader>
          <DialogTitle>{t("Assign delivery")}</DialogTitle>
          <DialogDescription>{t("Select a delivery for this order")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t("Delivery")}
            </div>
            <SelectPaginated
              apiUrl={["delivery"]}
              name="deliveryId"
              value={deliveryId?.toString() ?? ""}
              onChange={value => setDeliveryId(value as string)}
              labelKey="name"
              idKey="id"
              placeholder={t("Select delivery")}
            />
          </div>
        </div>
        <DialogFooter className="flex gap-2 justify-end">
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            {t("Cancel")}
          </Button>
          <Button type="button" onClick={handleAssign} isLoading={isSubmitting}>
            {t("Assign")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
