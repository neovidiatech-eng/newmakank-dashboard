import { fetchHelper } from "@/api/fetch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useLocale, useTranslations } from "@/lib/i18n";
import { Link } from "@/lib/navigation";
import { Pencil, Plus, Save, Star, Trash2, Trophy, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type DriverLevel,
  type DriverPointsSettings,
  extractList,
  extractTotal,
  type LeaderboardRow,
  localized
} from "./driver-points-utils";

// ---------------------------------------------------------------------------
// Level badge (shared with the driver page)
// ---------------------------------------------------------------------------

export function LevelBadge({ level }: { level: DriverLevel | null | undefined }) {
  const locale = useLocale();
  if (!level) return <span className="text-muted-foreground">—</span>;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold"
      style={{ borderColor: level.color || undefined, color: level.color || undefined }}
    >
      <Trophy className="h-3 w-3" />
      {localized(level.name, locale)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Ranking tab
// ---------------------------------------------------------------------------

function RankingTab() {
  const t = useTranslations();
  const [period, setPeriod] = useState<"month" | "all">("month");
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isLoading } = useApiQuery({
    queryKey: ["driverPointsLeaderboard", period, page],
    endPoint: ["driverPoints", "driverPointsAdmin", "driverPointsLeaderboard"],
    params: { period, page, limit },
    staleTime: 0
  });
  const rows = extractList<LeaderboardRow>(data);
  const pages = Math.max(1, Math.ceil(extractTotal(data) / limit));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>{t("driverRanking")}</CardTitle>
          <CardDescription>{period === "month" ? t("driverRankingMonthHint") : t("driverRankingAllHint")}</CardDescription>
        </div>
        <Tabs value={period} onValueChange={v => { setPeriod(v as "month" | "all"); setPage(1); }}>
          <TabsList>
            <TabsTrigger value="month">{t("driverThisMonth")}</TabsTrigger>
            <TabsTrigger value="all">{t("driverAllTime")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>{t("driverName")}</TableHead>
                <TableHead>{t("driverLevel")}</TableHead>
                <TableHead>{period === "month" ? t("driverMonthPoints") : t("driverTotalPoints")}</TableHead>
                <TableHead>{t("driverTotalPoints")}</TableHead>
                <TableHead>{t("driverRating")}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">{t("driverNoPointsYet")}</TableCell>
                </TableRow>
              )}
              {rows.map(row => (
                <TableRow key={row.deliveryId}>
                  <TableCell className="font-bold">{row.rank <= 3 ? ["🥇", "🥈", "🥉"][row.rank - 1] : row.rank}</TableCell>
                  <TableCell>
                    <div className="font-medium">{row.name || `#${row.deliveryId}`}</div>
                    {row.phone && <div className="text-xs text-muted-foreground" dir="ltr">{row.phone}</div>}
                  </TableCell>
                  <TableCell><LevelBadge level={row.level} /></TableCell>
                  <TableCell className="font-semibold">{row.points}</TableCell>
                  <TableCell>{row.totalPoints}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {Number(row.rating || 0).toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link href={`/driver-points/${row.deliveryId}`} className="text-sm text-primary hover:underline">
                      {t("driverDetails")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
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
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Settings tab
// ---------------------------------------------------------------------------

const numberFields: { key: keyof DriverPointsSettings; label: string; hint?: string }[] = [
  { key: "perOrder", label: "driverPtsPerOrder" },
  { key: "goodRating", label: "driverPtsGoodRating" },
  { key: "badRating", label: "driverPtsBadRating" },
  { key: "fastMinutes", label: "driverFastMinutes" },
  { key: "fast", label: "driverPtsFast" },
  { key: "lateMinutes", label: "driverLateMinutes" },
  { key: "late", label: "driverPtsLate" },
  { key: "reject", label: "driverPtsReject" },
  { key: "timeout", label: "driverPtsTimeout" }
];

function SettingsTab() {
  const t = useTranslations();
  const { data, refetch } = useApiQuery({
    queryKey: ["driverPointsSettings"],
    endPoint: ["driverPoints", "driverPointsAdmin", "driverPointsSettings"],
    staleTime: 0
  });
  const settings: DriverPointsSettings | null = data?.data ?? null;
  const [form, setForm] = useState<Record<string, string | boolean>>({ enabled: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!settings) return;
    const next: Record<string, string | boolean> = { enabled: Boolean(settings.enabled) };
    for (const f of numberFields) next[f.key] = String(settings[f.key] ?? 0);
    setForm(next);
  }, [settings]);

  const save = async (next = form) => {
    setSaving(true);
    const body: Record<string, unknown> = { enabled: next.enabled === true };
    for (const f of numberFields) body[f.key] = Math.max(0, Math.floor(Number(next[f.key]) || 0));
    const response = await fetchHelper({
      endPoint: ["driverPoints", "driverPointsAdmin", "driverPointsSettings"],
      method: "PATCH",
      body,
      redirectOnUnauthorized: false
    });
    setSaving(false);
    if (response?.success) {
      toast.success(t("Success"));
      refetch();
    }
  };

  const n = (key: string) => Number(form[key]) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("driverPointsSettings")}</CardTitle>
        <CardDescription>{t("driverPointsSettingsHint")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="font-medium">{t("driverPointsEnabled")}</p>
            <p className="text-sm text-muted-foreground">{t("driverPointsEnabledHint")}</p>
          </div>
          <Switch
            checked={form.enabled === true}
            disabled={saving}
            onCheckedChange={value => {
              const next = { ...form, enabled: value };
              setForm(next);
              save(next);
            }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {numberFields.map(f => (
            <div key={f.key} className="grid gap-2">
              <Label>{t(f.label)}</Label>
              <Input
                type="number"
                min={0}
                value={String(form[f.key] ?? "")}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        <div className="grid gap-1 rounded-lg bg-muted/50 p-4 text-sm">
          <p className="mb-1 font-medium">{t("loyaltyPreview")}</p>
          <p>✅ {t("driverPrevOrder").replace("{n}", String(n("perOrder")))}</p>
          {n("fast") > 0 && n("fastMinutes") > 0 && (
            <p>⚡ {t("driverPrevFast").replace("{m}", String(n("fastMinutes"))).replace("{n}", String(n("fast")))}</p>
          )}
          {n("late") > 0 && n("lateMinutes") > 0 && (
            <p>🐢 {t("driverPrevLate").replace("{m}", String(n("lateMinutes"))).replace("{n}", String(n("late")))}</p>
          )}
          {n("goodRating") > 0 && <p>⭐ {t("driverPrevGood").replace("{n}", String(n("goodRating")))}</p>}
          {n("badRating") > 0 && <p>👎 {t("driverPrevBad").replace("{n}", String(n("badRating")))}</p>}
          {n("reject") > 0 && <p>✋ {t("driverPrevReject").replace("{n}", String(n("reject")))}</p>}
          {n("timeout") > 0 && <p>⏰ {t("driverPrevTimeout").replace("{n}", String(n("timeout")))}</p>}
          <p className="mt-1 text-muted-foreground">{t("driverPrevNotes")}</p>
        </div>

        <div>
          <Button onClick={() => save()} disabled={saving}>
            <Save className="me-2 h-4 w-4" />
            {t("Save")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Levels tab
// ---------------------------------------------------------------------------

type LevelForm = { nameAr: string; nameEn: string; minPoints: string; rewardAmount: string; color: string };
const emptyLevel: LevelForm = { nameAr: "", nameEn: "", minPoints: "", rewardAmount: "", color: "#D4AF37" };

function LevelsTab() {
  const t = useTranslations();
  const locale = useLocale();
  const { data, refetch } = useApiQuery({
    queryKey: ["driverLevels"],
    endPoint: ["driverPoints", "driverPointsAdmin", "driverPointsLevels"],
    staleTime: 0
  });
  const levels = extractList<DriverLevel>(data);
  const [form, setForm] = useState<LevelForm>(emptyLevel);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setForm(emptyLevel);
    setEditingId(null);
  };

  const submit = async () => {
    if (!form.nameAr.trim() || !form.nameEn.trim()) return toast.error(t("loyaltyNameRequired"));
    if (form.minPoints === "" || Number(form.minPoints) < 0) return toast.error(t("driverLevelPointsRequired"));
    setSaving(true);
    const response = await fetchHelper({
      endPoint: editingId
        ? ["driverPoints", "driverPointsAdmin", "driverPointsLevels", editingId]
        : ["driverPoints", "driverPointsAdmin", "driverPointsLevels"],
      method: editingId ? "PATCH" : "POST",
      body: {
        name: { ar: form.nameAr.trim(), en: form.nameEn.trim() },
        minPoints: Math.floor(Number(form.minPoints) || 0),
        rewardAmount: Math.max(0, Number(form.rewardAmount) || 0),
        color: form.color || null
      },
      redirectOnUnauthorized: false
    });
    setSaving(false);
    if (response?.success) {
      toast.success(t("Success"));
      reset();
      refetch();
    }
  };

  const edit = (level: DriverLevel) => {
    const name = typeof level.name === "object" && level.name ? level.name : { ar: localized(level.name, "ar"), en: localized(level.name, "en") };
    setEditingId(level.id);
    setForm({
      nameAr: name.ar || "",
      nameEn: name.en || "",
      minPoints: String(level.minPoints),
      rewardAmount: level.rewardAmount ? String(level.rewardAmount) : "",
      color: level.color || "#D4AF37"
    });
  };

  const remove = async (level: DriverLevel) => {
    if (!window.confirm(t("driverLevelDeleteConfirm"))) return;
    const response = await fetchHelper({
      endPoint: ["driverPoints", "driverPointsAdmin", "driverPointsLevels", level.id],
      method: "DELETE",
      redirectOnUnauthorized: false
    });
    if (response?.success) {
      toast.success(t("Deleted"));
      refetch();
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? t("driverEditLevel") : t("driverAddLevel")}</CardTitle>
          <CardDescription>{t("driverLevelsHint")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="grid gap-2">
              <Label>{t("loyaltyNameAr")}</Label>
              <Input value={form.nameAr} onChange={e => setForm({ ...form, nameAr: e.target.value })} placeholder="دهبي" />
            </div>
            <div className="grid gap-2">
              <Label>{t("loyaltyNameEn")}</Label>
              <Input value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} placeholder="Gold" />
            </div>
            <div className="grid gap-2">
              <Label>{t("driverLevelMinPoints")}</Label>
              <Input type="number" min={0} value={form.minPoints} onChange={e => setForm({ ...form, minPoints: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>{t("driverLevelReward")}</Label>
              <Input type="number" min={0} value={form.rewardAmount} placeholder="0" onChange={e => setForm({ ...form, rewardAmount: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>{t("driverLevelColor")}</Label>
              <Input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="h-10 p-1" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={submit} disabled={saving}>
              {editingId ? <Save className="me-2 h-4 w-4" /> : <Plus className="me-2 h-4 w-4" />}
              {editingId ? t("Save") : t("driverAddLevel")}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={reset}>
                <X className="me-2 h-4 w-4" />
                {t("Cancel")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("driverLevel")}</TableHead>
                <TableHead>{t("driverLevelMinPoints")}</TableHead>
                <TableHead>{t("driverLevelReward")}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {levels.map(level => (
                <TableRow key={level.id}>
                  <TableCell><LevelBadge level={level} /></TableCell>
                  <TableCell>{level.minPoints}</TableCell>
                  <TableCell>
                    {level.rewardAmount > 0 ? (
                      <Badge variant="default">{level.rewardAmount} {t("EGP")}</Badge>
                    ) : (
                      <span className="text-muted-foreground">{t("driverNoReward")}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => edit(level)} title={t("Edit")}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(level)} title={t("Delete")}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {levels.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">{t("loyaltyNoRewards")}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <p className="mt-3 text-xs text-muted-foreground">
            {t("driverLevelsNote").replace("{levels}", levels.map(l => localized(l.name, locale)).join(" ← "))}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page body
// ---------------------------------------------------------------------------

export default function DriverPointsClient() {
  const t = useTranslations();
  return (
    <Tabs defaultValue="ranking" className="grid gap-4">
      <TabsList className="w-fit">
        <TabsTrigger value="ranking">{t("driverRanking")}</TabsTrigger>
        <TabsTrigger value="settings">{t("loyaltyTabSettings")}</TabsTrigger>
        <TabsTrigger value="levels">{t("driverLevels")}</TabsTrigger>
      </TabsList>
      <TabsContent value="ranking"><RankingTab /></TabsContent>
      <TabsContent value="settings"><SettingsTab /></TabsContent>
      <TabsContent value="levels"><LevelsTab /></TabsContent>
    </Tabs>
  );
}
