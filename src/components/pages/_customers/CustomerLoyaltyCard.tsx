import { fetchHelper } from "@/api/fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useTranslations } from "@/lib/i18n";
import { TransactionsTable } from "@/pages/dashboard/loyalty/LoyaltyClient";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

type Summary = {
  points: number;
  wallet: number;
  ordersCounted: number;
  ordersUntilBonus: number | null;
  settings: { enabled: boolean };
};

/** Customer details page: points balance, manual adjustment and points history. */
export default function CustomerLoyaltyCard({ customerId }: { customerId: number }) {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { data, refetch } = useApiQuery({
    queryKey: ["loyaltyCustomer", customerId],
    endPoint: ["loyalty", "loyaltyAdmin", "loyaltyCustomers", customerId],
    staleTime: 0
  });
  const summary: Summary | null = data?.data ?? null;

  const [points, setPoints] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const adjust = async (sign: 1 | -1) => {
    const amount = Math.floor(Math.abs(Number(points)));
    if (!amount) {
      toast.error(t("loyaltyAdjustInvalid"));
      return;
    }
    setSaving(true);
    const response = await fetchHelper({
      endPoint: ["loyalty", "loyaltyAdmin", "loyaltyCustomers", customerId, "loyaltyAdjust"],
      method: "POST",
      body: { points: sign * amount, note: note.trim() || undefined },
      redirectOnUnauthorized: false
    });
    setSaving(false);
    if (response?.success) {
      toast.success(t("Success"));
      setPoints("");
      setNote("");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["loyaltyTransactions", customerId] });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("loyaltyPoints")}</CardTitle>
        {summary && !summary.settings?.enabled && (
          <CardDescription>{t("loyaltyProgramOff")}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-4 text-center">
            <p className="text-2xl font-bold text-primary">{summary?.points ?? 0}</p>
            <p className="text-sm text-muted-foreground">{t("loyaltyPointsBalance")}</p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-2xl font-bold text-primary">{summary?.ordersCounted ?? 0}</p>
            <p className="text-sm text-muted-foreground">{t("loyaltyOrdersCounted")}</p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <p className="text-2xl font-bold text-primary">{summary?.ordersUntilBonus ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{t("loyaltyOrdersUntilBonus")}</p>
          </div>
        </div>

        <div className="grid gap-3 rounded-lg border p-4">
          <p className="font-medium">{t("loyaltyAdjustTitle")}</p>
          <div className="grid gap-3 md:grid-cols-[160px_1fr_auto]">
            <div className="grid gap-1">
              <Label>{t("loyaltyPoints")}</Label>
              <Input type="number" min={1} value={points} onChange={e => setPoints(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label>{t("loyaltyAdjustNote")}</Label>
              <Input value={note} onChange={e => setNote(e.target.value)} />
            </div>
            <div className="flex items-end gap-2">
              <Button disabled={saving} onClick={() => adjust(1)}>
                {t("loyaltyAddPoints")}
              </Button>
              <Button disabled={saving} variant="outline" onClick={() => adjust(-1)}>
                {t("loyaltyRemovePoints")}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <p className="font-medium">{t("loyaltyHistory")}</p>
          <TransactionsTable userId={customerId} />
        </div>
      </CardContent>
    </Card>
  );
}
