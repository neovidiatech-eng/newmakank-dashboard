import { fetchHelper } from "@/api/fetch";
import SelectPaginated from "@/components/common/Inputs/select/SelectPaginatedInput";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateCashSettlementDialog() {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deliveryId, setDeliveryId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!deliveryId || !amount) {
      toast.error(t("Please fill all required fields"));
      return;
    }
    setIsSaving(true);
    const res = await fetchHelper({
      endPoint: ["deliveryCashSettlements"],
      method: "POST",
      body: {
        deliveryId: Number(deliveryId),
        amount: Number(amount),
        ...(note ? { note } : {})
      }
    });

    if (res?.success) {
      toast.success(t("settlementRegistered"));
      setOpen(false);
      setDeliveryId("");
      setAmount("");
      setNote("");
      router.refresh();
    } else {
      toast.error(res?.result?.message ?? t("error"));
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t("Register Settlement")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md overflow-visible">
        <DialogHeader>
          <DialogTitle>{t("Register Settlement")}</DialogTitle>
          <DialogDescription>{t("Cash Settlement")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{t("Delivery")}</Label>
            <SelectPaginated
              apiUrl={["delivery"]}
              name="deliveryId"
              value={deliveryId}
              onChange={value => setDeliveryId(value as string)}
              labelKey="name"
              idKey="id"
              placeholder={t("Select delivery")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settlement-amount">{t("Amount")}</Label>
            <Input
              id="settlement-amount"
              type="number"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              disabled={isSaving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settlement-note">{t("Note")}</Label>
            <Textarea id="settlement-note" value={note} onChange={e => setNote(e.target.value)} disabled={isSaving} />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button disabled={isSaving} isLoading={isSaving} onClick={handleSave}>
            {t("Register Settlement")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
