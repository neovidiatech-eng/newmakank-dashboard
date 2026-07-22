"use client";

import { fetchHelper } from "@/api/fetch";
import { revalidatePathAction } from "@/api/global/revalidatePath";
import { Button } from "@/components/ui/button";
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

interface SingleOrderDeleteActionProps {
  orderId: number | string;
}

export default function SingleOrderDeleteAction({ orderId }: SingleOrderDeleteActionProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetchHelper({
        endPoint: ["orders", "bulk-delete"],
        method: "POST",
        body: {
          orderIds: [Number(orderId)]
        }
      });

      if (!response?.success) throw response;

      const deletedCount = response?.data?.deletedCount ?? response?.deletedCount ?? 0;
      const failedDeletions = response?.data?.failed ?? [];

      if (deletedCount > 0) {
        toast.success(t("Orders Deleted Successfully"));
      } else if (failedDeletions.length > 0) {
        toast.error(failedDeletions[0]?.reason || t("Some Orders Failed To Delete"));
      }

      setIsOpen(false);
      await revalidatePathAction(pathname);
      router.refresh();
    } catch (error: any) {
      toast.error(error?.result?.message || error?.message || t("Some Orders Failed To Delete"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 dark:text-rose-400 dark:hover:bg-rose-500/20"
        title={t("Delete")}
        onClick={e => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t("Confirm Delete")}
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed">
              {t("Are you sure you want to delete this order?")} #{orderId}
              <br />
              {t("Bulk Delete Warning")}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              isLoading={isLoading}
            >
              {t("Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
