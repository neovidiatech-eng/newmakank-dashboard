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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "@/lib/i18n";
import { usePathname, useRouter } from "@/lib/navigation";
import { Banknote, Wallet, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StoreSettleWalletButtonProps {
  storeId: number;
  currentBalance?: number;
  storeName?: string;
  isPartner?: boolean;
}

export function StoreSettleWalletButton({
  storeId,
  currentBalance = 0,
  storeName,
  isPartner,
}: StoreSettleWalletButtonProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedBalance = Number(currentBalance || 0).toFixed(2);
  const hasPositiveBalance = Number(currentBalance) > 0;

  const handleSettle = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetchHelper({
        endPoint: ["stores", storeId, "settleWallet"] as any,
        method: "PATCH",
        body: {
          note: note.trim() || undefined,
        },
      });

      if (res?.success) {
        toast.success(t("Store Wallet Settled Successfully") || "تمت تسوية وتصفير محفظة المتجر بنجاح");
        setOpen(false);
        setNote("");
        await revalidatePathAction(pathname);
        router.refresh();
      } else {
        toast.error(t("Failed To Settle Store Wallet") || "تعذر تسوية محفظة المتجر", {
          description: res?.result?.message || res?.message,
        });
      }
    } catch (err: any) {
      toast.error(t("Failed To Settle Store Wallet") || "تعذر تسوية محفظة المتجر", {
        description: err?.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={hasPositiveBalance ? "destructive" : "secondary"}
          size="sm"
          className="gap-1.5 shrink-0"
        >
          <Banknote className="h-4 w-4" />
          <span>{t("Settle Store Wallet") || "تسوية وتصفير المحفظة"}</span>
          {hasPositiveBalance && (
            <span className="rounded-md bg-destructive-foreground/20 px-1.5 py-0.5 text-xs font-bold">
              {formattedBalance}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Wallet className="h-5 w-5" />
            {t("Confirm Settle Store Wallet Title") || "تأكيد تسوية وتصفير محفظة المتجر"}
          </DialogTitle>
          <DialogDescription className="pt-1 text-sm leading-relaxed">
            {t("Settle Store Wallet Description") ||
              "سيتم تصفير رصيد المحفظة الحالي وتسجيل معاملة تسوية سحب في سجل المعاملات المالية للمتجر."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Summary of current balance */}
          <div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">
                {t("Current Wallet Balance") || "رصيد المحفظة الحالي"}:
              </span>
            </div>
            <span className="text-base font-bold text-destructive">
              {formattedBalance} {t("EGP") || "ج.م"}
            </span>
          </div>

          {!isPartner && (
            <p className="text-xs text-muted-foreground bg-muted/50 p-2.5 rounded-lg border">
              💡 {t("nonPartnerStoreNotice") || "هذا المتجر غير شريك — الرصيد المتراكم يمثل تعويضات الخصومات التي دفعها المندوب بالخصم وتدين بها المنصة للمتجر."}
            </p>
          )}

          {/* Optional Note */}
          <div className="space-y-1.5">
            <Label htmlFor="settle-note">
              {t("Settlement Note Placeholder") || "ملاحظة التسوية (اختياري - مثلاً: تم تسليم المستحقات نقداً)"}
            </Label>
            <Textarea
              id="settle-note"
              placeholder="مثلاً: تم سداد المبلغ نقداً للمطعم بواسطة الإدارة"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            {t("cancel") || "إلغاء"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleSettle}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (t("loading") || "جاري التنفيذ...")
              : (t("Confirm Settlement") || "تأكيد التسوية والتصفير")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
