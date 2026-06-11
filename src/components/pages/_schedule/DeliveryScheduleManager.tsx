import { revalidatePathAction } from "@/api/global/revalidatePath";
import DeliveryScheduleFormPage from "@/components/pages/_schedule/deliveryScheduleForm.page";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "@/lib/i18n";
import { usePathname, useRouter } from "@/lib/navigation";
import { useState } from "react";

type Props = {
  deliveryId: string | number;
};

export default function DeliveryScheduleManager({ deliveryId }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          {t("Add Schedule")}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("Schedule Information")}</DialogTitle>
          </DialogHeader>

          <DeliveryScheduleFormPage
            deliveryId={String(deliveryId)}
            redirectOnSuccess={false}
            onSuccess={async () => {
              setOpen(false);
              await revalidatePathAction(pathname);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
