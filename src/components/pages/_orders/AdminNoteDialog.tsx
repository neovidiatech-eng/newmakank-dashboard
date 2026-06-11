import { fetchHelper } from "@/api/fetch";
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
import { useTranslations } from "@/lib/i18n";
import { usePathname, useRouter } from "@/lib/navigation";
import { revalidatePathAction } from "@/api/global/revalidatePath";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { StickyNote } from "lucide-react";

type AdminNoteDialogProps = {
  orderId: number;
  initialNote?: string | null;
  triggerLabel?: string;
  triggerVariant?: ButtonProps["variant"];
  triggerSize?: ButtonProps["size"];
  triggerClassName?: string;
  disabled?: boolean;
};

export default function AdminNoteDialog({
  orderId,
  initialNote,
  triggerLabel,
  triggerVariant = "outline",
  triggerSize = "sm",
  triggerClassName,
  disabled = false
}: AdminNoteDialogProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [adminNote, setAdminNote] = useState(initialNote ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setAdminNote(initialNote ?? "");
    }
  }, [initialNote, open]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetchHelper({
        endPoint: ["orders", orderId, "admin-note"],
        method: "PATCH",
        body: {
          adminNote
        }
      });

      if (!response?.success) {
        throw response;
      }

      toast.success(response?.message || t("Admin note updated"));
      setOpen(false);
      await revalidatePathAction(pathname);
      router.refresh();

    } catch (error: any) {
      toast.error(error?.result?.message || error?.message || t("Failed to update admin note"));
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
          <StickyNote className="h-4 w-4 mr-2" />
          {triggerLabel ? t(triggerLabel) : t("Admin Note")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Admin Note")}</DialogTitle>
          <DialogDescription>{t("Add or edit administrative note for this order")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Textarea
              placeholder={t("AdminNotePlaceholder")}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
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
