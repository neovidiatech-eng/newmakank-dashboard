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
import { Coins, Percent, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StoreSettleFortuneDiscountButtonProps {
  storeId: number;
  accumulatedDiscounts?: number;
  storeName?: string;
}

export function StoreSettleFortuneDiscountButton({
  storeId,
  accumulatedDiscounts = 0,
  storeName,
}: StoreSettleFortuneDiscountButtonProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [payoutMethod, setPayoutMethod] = useState<"CASH_BANK_PAYOUT" | "WALLET">("CASH_BANK_PAYOUT");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discounts = Number(accumulatedDiscounts || 0);
  const platformSubsidy = discounts / 2;
  const formattedDiscounts = discounts.toFixed(2);
  const formattedSubsidy = platformSubsidy.toFixed(2);
  const hasDiscountsToSettle = discounts > 0;

  const handleSettle = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetchHelper({
        endPoint: ["stores", storeId, "settleFortuneDiscounts"] as any,
        method: "PATCH",
        body: {
          note: note.trim() || undefined,
          payoutMethod,
        },
      });

      if (res?.success) {
        toast.success(
          t("Fortune Discounts Settled Successfully") ||
            "تمت تسوية وتصفير خصومات المتجر بنجاح (مناصفة 50/50)"
        );
        setOpen(false);
        setNote("");
        await revalidatePathAction(pathname);
        router.refresh();
      } else {
        toast.error(
          t("Failed To Settle Fortune Discounts") || "تعذر تسوية خصومات المتجر",
          {
            description: res?.result?.message || res?.message,
          }
        );
      }
    } catch (err: any) {
      toast.error(
        t("Failed To Settle Fortune Discounts") || "تعذر تسوية خصومات المتجر",
        {
          description: err?.message,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={hasDiscountsToSettle ? "default" : "outline"}
          size="sm"
          className="gap-1.5 shrink-0 bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
        >
          <Percent className="h-4 w-4" />
          <span>{t("Settle Fortune Discounts") || "تسوية خصومات المتجر (50/50)"}</span>
          {hasDiscountsToSettle && (
            <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-xs font-bold text-white">
              {formattedDiscounts}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Coins className="h-5 w-5" />
            {t("Confirm Settle Fortune Discounts") || "تسوية وتصفير خصومات المتجر (مناصفة 50/50)"}
          </DialogTitle>
          <DialogDescription className="pt-1 text-sm leading-relaxed">
            {t("Settle Fortune Discounts Description") ||
              "تحمل المتجر الخصومات بالكامل في الطلبات السابقة. عند التصفير، تلتزم المنصة بنصف القيمة (50%) ويتم تصفير العداد لبدء دورة جديدة."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Discount & 50% Subsidy Breakdown Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 p-3 text-center">
              <span className="text-xs text-muted-foreground block mb-1">
                {t("Total Discounts Absorbed") || "إجمالي الخصومات المعلقة"}
              </span>
              <span className="text-lg font-bold text-amber-700 dark:text-amber-400">
                {formattedDiscounts} {t("EGP") || "ج.م"}
              </span>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 text-center">
              <span className="text-xs text-muted-foreground block mb-1">
                {t("Platform 50% Subsidy") || "حصة المنصة (50%) للمحل"}
              </span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {formattedSubsidy} {t("EGP") || "ج.م"}
              </span>
            </div>
          </div>

          {/* Payout method selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">
              {t("Settlement Payout Method") || "طريقة السداد للمحل"}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPayoutMethod("CASH_BANK_PAYOUT")}
                className={`flex flex-col items-start gap-1 p-2.5 rounded-lg border text-right transition-all ${
                  payoutMethod === "CASH_BANK_PAYOUT"
                    ? "border-primary bg-primary/5 text-primary font-medium ring-1 ring-primary"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{t("Cash/Bank Payout") || "كاش / تحويل بنكي"}</span>
                </div>
                <span className="text-[11px] text-muted-foreground leading-tight">
                  تسوية خارجية دون تغيير رصيد المحفظة
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPayoutMethod("WALLET")}
                className={`flex flex-col items-start gap-1 p-2.5 rounded-lg border text-right transition-all ${
                  payoutMethod === "WALLET"
                    ? "border-primary bg-primary/5 text-primary font-medium ring-1 ring-primary"
                    : "border-border hover:bg-muted/50 text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{t("Credit Store Wallet") || "إيداع في المحفظة"}</span>
                </div>
                <span className="text-[11px] text-muted-foreground leading-tight">
                  إضافة الـ 50% فوراً في رصيد المحل
                </span>
              </button>
            </div>
          </div>

          {/* Optional Note */}
          <div className="space-y-1.5">
            <Label htmlFor="settle-discount-note" className="text-xs">
              {t("Settlement Note") || "ملاحظة التسوية (اختياري)"}
            </Label>
            <Textarea
              id="settle-discount-note"
              placeholder="مثلاً: تم تسليم مبلغ الدعم نقداً لصاحب المحل عن شهر سبتمبر"
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
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={handleSettle}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (t("loading") || "جاري التسوية...")
              : (t("Confirm Settle & Reset") || "تأكيد التسوية وتصفير الرصيد")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
