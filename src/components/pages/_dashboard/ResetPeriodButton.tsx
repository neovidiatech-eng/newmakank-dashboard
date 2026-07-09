import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useTranslations } from "@/lib/i18n";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { endpointType } from "@/utils/endpoints";

export default function ResetPeriodButton({
  endPoint,
  label,
  variant = "outline"
}: {
  endPoint: endpointType;
  label: string;
  variant?: "default" | "outline" | "secondary";
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const mutation = useApiMutation({
    endPoint,
    method: "POST",
    invalidate: [["statistics"]]
  });

  const handleConfirm = () => {
    mutation.mutate(undefined, {
      onSuccess: res => {
        if ((res as any)?.success === false) {
          toast.error((res as any)?.result?.message ?? t("error"));
          return;
        }
        toast.success(t("periodReset"));
        setOpen(false);
      },
      onError: (err: any) => {
        toast.error(err?.message ?? t("error"));
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>{t("resetPeriodConfirm")}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button disabled={mutation.isPending} isLoading={mutation.isPending} onClick={handleConfirm}>
            {label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
