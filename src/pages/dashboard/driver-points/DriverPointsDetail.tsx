import { fetchHelper } from "@/api/fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useLocale, useTranslations } from "@/lib/i18n";
import { Link } from "@/lib/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Gift, PlusCircle, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LevelBadge } from "./DriverPointsClient";
import { type DriverLevel, extractList, extractTotal, formatDate, localized } from "./driver-points-utils";

type Summary = {
  deliveryId: number;
  name: string;
  points: number;
  monthPoints: number;
  level: DriverLevel | null;
  nextLevel: DriverLevel | null;
  pointsToNext: number | null;
  allTimeRank: number;
  monthRank: number;
  stats: {
    deliveredOrders: number;
    averageRating: number;
    ratingsCount: number;
    badRatings: number;
    rejectedOrders: number;
    timedOutOrders: number;
    averageDeliveryMinutes: number | null;
  };
};

function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "good" | "bad" }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`mt-1 text-xl font-bold ${tone === "bad" ? "text-red-600" : tone === "good" ? "text-green-600" : ""}`}>{value}</p>
    </div>
  );
}

function Paged<T>({
  query,
  render,
  empty,
  head
}: {
  query: (page: number) => { data: any; isLoading: boolean };
  render: (row: T) => React.ReactNode;
  empty: string;
  head: React.ReactNode;
}) {
  const t = useTranslations();
  const [page, setPage] = useState(1);
  const { data, isLoading } = query(page);
  const rows = extractList<T>(data);
  const pages = Math.max(1, Math.ceil(extractTotal(data) / 15));
  return (
    <div className="grid gap-3">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>{head}</TableHeader>
          <TableBody>
            {!isLoading && rows.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">{empty}</TableCell></TableRow>
            )}
            {rows.map(render)}
          </TableBody>
        </Table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-end gap-2 text-sm">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>{t("Previous")}</Button>
          <span>{page} / {pages}</span>
          <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>{t("Next")}</Button>
        </div>
      )}
    </div>
  );
}

export default function DriverPointsDetail({ deliveryId }: { deliveryId: number }) {
  const t = useTranslations();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const base = ["driverPoints", "driverPointsAdmin", "driverPointsDrivers", deliveryId] as const;
  const { data } = useApiQuery({ queryKey: ["driverPointsDriver", deliveryId], endPoint: [...base], staleTime: 0 });
  const s: Summary | null = data?.data ?? null;

  const [adjust, setAdjust] = useState({ points: "", note: "" });
  const [bonus, setBonus] = useState({ amount: "", note: "" });
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["driverPointsDriver", deliveryId] });
    queryClient.invalidateQueries({ queryKey: ["driverPointsTx", deliveryId] });
  };

  const sendAdjust = async () => {
    const points = Math.trunc(Number(adjust.points));
    if (!points) return toast.error(t("driverAdjustRequired"));
    setBusy(true);
    const response = await fetchHelper({
      endPoint: [...base, "driverPointsAdjust"],
      method: "POST",
      body: { points, note: adjust.note.trim() || undefined },
      redirectOnUnauthorized: false
    });
    setBusy(false);
    if (response?.success) {
      toast.success(t("Success"));
      setAdjust({ points: "", note: "" });
      refresh();
    }
  };

  const sendBonus = async () => {
    const amount = Number(bonus.amount);
    if (!(amount > 0)) return toast.error(t("driverBonusRequired"));
    if (!window.confirm(t("driverBonusConfirm").replace("{amount}", String(amount)))) return;
    setBusy(true);
    const response = await fetchHelper({
      endPoint: [...base, "driverPointsBonus"],
      method: "POST",
      body: { amount, note: bonus.note.trim() || undefined },
      redirectOnUnauthorized: false
    });
    setBusy(false);
    if (response?.success) {
      toast.success(t("Success"));
      setBonus({ amount: "", note: "" });
      refresh();
    }
  };

  const progress =
    s?.nextLevel && s.level
      ? Math.min(100, Math.round(((s.points - s.level.minPoints) / Math.max(1, s.nextLevel.minPoints - s.level.minPoints)) * 100))
      : 100;

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-3">
        <Link href="/driver-points" className="text-sm text-primary hover:underline">
          <ArrowRight className="me-1 inline h-4 w-4" />
          {t("driverRanking")}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-3">
            {s?.name || `#${deliveryId}`}
            <LevelBadge level={s?.level} />
          </CardTitle>
          <CardDescription>
            <Link href={`/delivery/${deliveryId}`} className="text-primary hover:underline">{t("driverOpenProfile")}</Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Stat label={t("driverTotalPoints")} value={s?.points ?? "—"} />
            <Stat label={t("driverMonthPoints")} value={s?.monthPoints ?? "—"} />
            <Stat label={t("driverMonthRank")} value={s ? `#${s.monthRank}` : "—"} />
            <Stat label={t("driverAllTimeRank")} value={s ? `#${s.allTimeRank}` : "—"} />
          </div>
          {s && (
            <div className="grid gap-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground">
                {s.nextLevel
                  ? t("driverToNext").replace("{n}", String(s.pointsToNext)).replace("{level}", localized(s.nextLevel.name, locale))
                  : t("driverTopLevel")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("driverChecklist")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          <Stat label={t("driverDelivered")} value={s?.stats.deliveredOrders ?? "—"} />
          <Stat
            label={t("driverAvgRating")}
            value={s ? <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{s.stats.averageRating} <span className="text-xs text-muted-foreground">({s.stats.ratingsCount})</span></span> : "—"}
          />
          <Stat label={t("driverBadRatings")} value={s?.stats.badRatings ?? "—"} tone={s?.stats.badRatings ? "bad" : undefined} />
          <Stat label={t("driverAvgSpeed")} value={s?.stats.averageDeliveryMinutes != null ? `${s.stats.averageDeliveryMinutes} ${t("driverMin")}` : "—"} />
          <Stat label={t("driverRejected")} value={s?.stats.rejectedOrders ?? "—"} tone={s?.stats.rejectedOrders ? "bad" : undefined} />
          <Stat label={t("driverTimedOut")} value={s?.stats.timedOutOrders ?? "—"} tone={s?.stats.timedOutOrders ? "bad" : undefined} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PlusCircle className="h-4 w-4" />{t("driverAdjustTitle")}</CardTitle>
            <CardDescription>{t("driverAdjustHint")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label>{t("loyaltyPoints")}</Label>
              <Input type="number" value={adjust.points} placeholder="+50 / -20" onChange={e => setAdjust({ ...adjust, points: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>{t("driverReason")}</Label>
              <Input value={adjust.note} onChange={e => setAdjust({ ...adjust, note: e.target.value })} />
            </div>
            <div><Button onClick={sendAdjust} disabled={busy}>{t("Save")}</Button></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Gift className="h-4 w-4" />{t("driverBonusTitle")}</CardTitle>
            <CardDescription>{t("driverBonusHint")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-2">
              <Label>{t("driverBonusAmount")}</Label>
              <Input type="number" min={0} value={bonus.amount} onChange={e => setBonus({ ...bonus, amount: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>{t("driverReason")}</Label>
              <Input value={bonus.note} onChange={e => setBonus({ ...bonus, note: e.target.value })} />
            </div>
            <div><Button onClick={sendBonus} disabled={busy}>{t("driverBonusSend")}</Button></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t("driverHistory")}</CardTitle></CardHeader>
        <CardContent>
          <Paged<any>
            query={page =>
              useApiQuery({
                queryKey: ["driverPointsTx", deliveryId, page],
                endPoint: [...base, "driverPointsTransactions"],
                params: { page, limit: 15 },
                staleTime: 0
              })
            }
            empty={t("loyaltyNoTransactions")}
            head={
              <TableRow>
                <TableHead>{t("Date")}</TableHead>
                <TableHead>{t("loyaltyTxType")}</TableHead>
                <TableHead>{t("loyaltyPoints")}</TableHead>
                <TableHead>{t("loyaltyBalanceAfter")}</TableHead>
                <TableHead>{t("loyaltyDetails")}</TableHead>
              </TableRow>
            }
            render={row => (
              <TableRow key={row.id}>
                <TableCell className="whitespace-nowrap">{formatDate(row.createdAt, locale)}</TableCell>
                <TableCell>{t(`driverTx_${row.type}`)}</TableCell>
                <TableCell dir="ltr" className={row.points >= 0 ? "font-medium text-green-600" : "font-medium text-red-600"}>
                  {row.points > 0 ? `+${row.points}` : row.points}
                </TableCell>
                <TableCell>{row.balanceAfter}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {[
                    row.orderId ? `${t("Order")} #${row.orderId}` : "",
                    row.value != null && ["FAST_DELIVERY", "LATE_DELIVERY"].includes(row.type) ? `${row.value} ${t("driverMin")}` : "",
                    row.value != null && ["GOOD_RATING", "BAD_RATING"].includes(row.type) ? `${row.value} ★` : "",
                    row.note ?? ""
                  ].filter(Boolean).join(" · ") || "—"}
                </TableCell>
              </TableRow>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{t("driverReviews")}</CardTitle></CardHeader>
        <CardContent>
          <Paged<any>
            query={page =>
              useApiQuery({
                queryKey: ["driverPointsReviews", deliveryId, page],
                endPoint: [...base, "driverPointsReviews"],
                params: { page, limit: 15 },
                staleTime: 0
              })
            }
            empty={t("driverNoReviews")}
            head={
              <TableRow>
                <TableHead>{t("Date")}</TableHead>
                <TableHead>{t("driverRating")}</TableHead>
                <TableHead>{t("driverComment")}</TableHead>
                <TableHead>{t("Customer")}</TableHead>
                <TableHead>{t("Order")}</TableHead>
              </TableRow>
            }
            render={row => (
              <TableRow key={row.id} className={row.rating <= 2 ? "bg-red-50 dark:bg-red-950/20" : undefined}>
                <TableCell className="whitespace-nowrap">{formatDate(row.createdAt, locale)}</TableCell>
                <TableCell>{"★".repeat(Math.round(row.rating))}<span className="text-muted-foreground">{"★".repeat(Math.max(0, 5 - Math.round(row.rating)))}</span></TableCell>
                <TableCell className="max-w-md">{row.comment || "—"}</TableCell>
                <TableCell>{row.Customer ? <Link href={`/customers/${row.Customer.id}`} className="text-primary hover:underline">{row.Customer.name}</Link> : "—"}</TableCell>
                <TableCell>#{row.orderId}</TableCell>
              </TableRow>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
