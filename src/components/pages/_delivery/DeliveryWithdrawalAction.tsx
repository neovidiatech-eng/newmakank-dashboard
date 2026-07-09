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
import TableStatusBadge from "@/components/common/table/tableHelperComponents/TableStatusBadge";
import { useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DeliveryWithdrawalAction({
  withdrawalId,
  status
}: {
  withdrawalId: number;
  status: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (status !== "PENDING") {
    return <TableStatusBadge status={status} />;
  }

  const submit = async (nextStatus: "APPROVED" | "DENIED") => {
    setIsSaving(true);
    const res = await fetchHelper({
      endPoint: ["deliveryWithdrawals", withdrawalId],
      method: "PATCH",
      body: { status: nextStatus, ...(adminNote ? { adminNote } : {}) }
    });

    if (res?.success) {
      toast.success(t("Updated Successfully"));
      setOpen(false);
      setAdminNote("");
      router.refresh();
    } else {
      toast.error(res?.result?.message ?? t("error"));
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <TableStatusBadge status={status} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Driver Withdrawals")}</DialogTitle>
          <DialogDescription>{t("Change Status")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="admin-note">{t("Admin Note")}</Label>
          <Textarea id="admin-note" value={adminNote} onChange={e => setAdminNote(e.target.value)} disabled={isSaving} />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="destructive" disabled={isSaving} onClick={() => submit("DENIED")}>
            <XCircle className="h-4 w-4 mr-1" />
            {t("DENIED")}
          </Button>
          <Button disabled={isSaving} onClick={() => submit("APPROVED")}>
            <CheckCircle2 className="h-4 w-4 mr-1" />
            {t("APPROVED")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
