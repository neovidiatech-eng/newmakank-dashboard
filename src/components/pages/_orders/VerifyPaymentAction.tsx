"use client";

import { fetchHelper } from "@/api/fetch";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function VerifyPaymentAction({ orderId }: { orderId: number }) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const submit = async (approved: boolean) => {
    setIsSaving(true);
    const res = await fetchHelper({
      endPoint: ["orders", orderId, "verifyPayment"],
      method: "PATCH",
      body: { approved, ...(reason ? { reason } : {}) }
    });

    if (res?.success) {
      toast.success(approved ? t("paymentApproved") : t("paymentRejected"));
      setOpen(false);
      setReason("");
      router.refresh();
    } else {
      toast.error(res?.result?.message ?? t("error"));
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <ShieldCheck className="h-4 w-4 mr-2" />
          {t("Verify Payment")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Payment Verification")}</DialogTitle>
          <DialogDescription>{t("verifyPaymentDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="payment-reject-reason">{t("Rejection Reason")}</Label>
          <Textarea
            id="payment-reject-reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
            disabled={isSaving}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="destructive" disabled={isSaving} onClick={() => submit(false)}>
            <XCircle className="h-4 w-4 mr-1" />
            {t("Reject")}
          </Button>
          <Button disabled={isSaving} onClick={() => submit(true)}>
            <CheckCircle2 className="h-4 w-4 mr-1" />
            {t("Approve")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
