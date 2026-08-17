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
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ResetWalletActionProps {
  deliveryId: number | string;
}

export default function ResetWalletAction({ deliveryId }: ResetWalletActionProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    try {
      setIsLoading(true);
      const response = await fetchHelper({
        endPoint: ["delivery", deliveryId, "resetWallet"] as any,
        method: "PATCH"
      });

      if (!response?.success) throw response;

      toast.success(t("Driver Wallet Reset Successfully"));
      setIsOpen(false);
      await revalidatePathAction(pathname);
      router.refresh();
    } catch (error: any) {
      toast.error(error?.result?.message || error?.message || t("Failed To Reset Wallet"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="gap-1.5 rounded-xl shadow-xs"
        onClick={() => setIsOpen(true)}
      >
        <RotateCcw className="h-4 w-4" />
        {t("Reset Wallet")}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t("Confirm Reset Wallet Title")}
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed">
              {t("Reset Wallet Warning")}
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
              onClick={handleReset}
              isLoading={isLoading}
            >
              {t("Reset Wallet")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
