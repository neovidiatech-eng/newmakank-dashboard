import { fetchHelper } from "@/api/fetch";
import { revalidatePathAction } from "@/api/global/revalidatePath";
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
import { Textarea } from "@/components/ui/textarea";
import { Megaphone } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { usePathname, useRouter } from "@/lib/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type NoteForDeliveryDialogProps = {
  orderId: number;
  initialNote?: string | null;
  triggerLabel?: string;
  triggerVariant?: ButtonProps["variant"];
  triggerSize?: ButtonProps["size"];
  triggerClassName?: string;
  disabled?: boolean;
};

export default function NoteForDeliveryDialog({
  orderId,
  initialNote,
  triggerLabel,
  triggerVariant = "outline",
  triggerSize = "sm",
  triggerClassName,
  disabled = false
}: NoteForDeliveryDialogProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [noteForDelivery, setNoteForDelivery] = useState(initialNote ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setNoteForDelivery(initialNote ?? "");
    }
  }, [initialNote, open]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetchHelper({
        endPoint: ["orders", orderId, "admin-note"],
        method: "PATCH",
        body: {
          noteForDelivery
        }
      });

      if (!response?.success) {
        throw response;
      }

      toast.success(response?.message || t("Note for delivery updated"));
      setOpen(false);
      await revalidatePathAction(pathname);
      router.refresh();
    } catch (error: any) {
      toast.error(
        error?.result?.message || error?.message || t("Failed to update note for delivery")
      );
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
          <Megaphone className="h-4 w-4 mr-2" />
          {triggerLabel ? t(triggerLabel) : t("Delivery Note")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Delivery Note")}</DialogTitle>
          <DialogDescription>{t("Add or edit a note for the delivery driver")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Textarea
              placeholder={t("Type note for delivery here...")}
              value={noteForDelivery}
              onChange={e => setNoteForDelivery(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
            {t("Cancel")}
          </Button>
          <Button type="button" onClick={handleSubmit} isLoading={isSubmitting}>
            {t("Save Changes")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
