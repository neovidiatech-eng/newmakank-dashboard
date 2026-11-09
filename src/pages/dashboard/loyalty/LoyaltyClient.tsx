import { fetchHelper } from "@/api/fetch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useLocale, useTranslations } from "@/lib/i18n";
import { Link } from "@/lib/navigation";
import { Pencil, Plus, Power, Save, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  extractList,
  extractTotal,
  formatDate,
  localized,
  type LoyaltyDiscountType,
  type LoyaltyReward,
  type LoyaltyRewardType,
  type LoyaltySettings,
  type LoyaltyTransaction,
  type LoyaltyTransactionType,
  numberOrNull,
  rewardTypes,
  transactionTypes
} from "./loyalty-utils";

// ---------------------------------------------------------------------------
// Settings tab
// ---------------------------------------------------------------------------

function SettingsTab() {
  const t = useTranslations();
  const { data, refetch } = useApiQuery({
    queryKey: ["loyaltySettings"],
    endPoint: ["loyalty", "loyaltySettings"],
    staleTime: 0
  });
  const settings: LoyaltySettings | null = data?.data ?? null;

  const [form, setForm] = useState({
    enabled: false,
    pointsPerOrder: "0",
    bonusEveryOrders: "0",
    bonusPoints: "0"
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setForm({
      enabled: Boolean(settings.enabled),
      pointsPerOrder: String(settings.pointsPerOrder ?? 0),
      bonusEveryOrders: String(settings.bonusEveryOrders ?? 0),
      bonusPoints: String(settings.bonusPoints ?? 0)
    });
  }, [settings]);

  const save = async (next = form) => {
    setSaving(true);
    const response = await fetchHelper({
      endPoint: ["loyalty", "loyaltySettings"],
      method: "PATCH",
      body: {
        enabled: next.enabled,
        pointsPerOrder: Math.max(0, Math.floor(Number(next.pointsPerOrder) || 0)),
        bonusEveryOrders: Math.max(0, Math.floor(Number(next.bonusEveryOrders) || 0)),
        bonusPoints: Math.max(0, Math.floor(Number(next.bonusPoints) || 0))
      },
      redirectOnUnauthorized: false
    });
    setSaving(false);
    if (response?.success) {
      toast.success(t("Success"));
      refetch();
    }
  };

  const every = Number(form.bonusEveryOrders) || 0;
  const bonus = Number(form.bonusPoints) || 0;
  const perOrder = Number(form.pointsPerOrder) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("loyaltySettingsTitle")}</CardTitle>
        <CardDescription>{t("loyaltySettingsHint")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="font-medium">{t("loyaltyEnabled")}</p>
            <p className="text-sm text-muted-foreground">{t("loyaltyEnabledHint")}</p>
          </div>
          <Switch
            checked={form.enabled}
            disabled={saving}
            onCheckedChange={value => {
              const next = { ...form, enabled: value };
              setForm(next);
              save(next);
            }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <Label>{t("loyaltyPointsPerOrder")}</Label>
            <Input
              type="number"
              min={0}
              value={form.pointsPerOrder}
              onChange={e => setForm({ ...form, pointsPerOrder: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>{t("loyaltyBonusEveryOrders")}</Label>
            <Input
              type="number"
              min={0}
              value={form.bonusEveryOrders}
              onChange={e => setForm({ ...form, bonusEveryOrders: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>{t("loyaltyBonusPoints")}</Label>
            <Input
              type="number"
              min={0}
              value={form.bonusPoints}
              onChange={e => setForm({ ...form, bonusPoints: e.target.value })}
            />
          </div>
        </div>

        <div className="rounded-lg bg-muted/50 p-4 text-sm">
          <p className="font-medium mb-1">{t("loyaltyPreview")}</p>
          <p>
            {t("loyaltyPreviewPerOrder").replace("{points}", String(perOrder))}
          </p>
          {every > 0 && bonus > 0 ? (
            <p>
              {t("loyaltyPreviewBonus")
                .replace("{orders}", String(every))
                .replace("{points}", String(bonus))}
            </p>
          ) : (
            <p className="text-muted-foreground">{t("loyaltyPreviewNoBonus")}</p>
          )}
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
// Rewards tab
// ---------------------------------------------------------------------------

type RewardForm = {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  type: LoyaltyRewardType;
  pointsCost: string;
  value: string;
  discountType: LoyaltyDiscountType;
  maxDiscount: string;
  minOrderAmount: string;
  storeId: string;
  validityDays: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyRewardForm: RewardForm = {
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  descriptionEn: "",
  type: "WALLET_CREDIT",
  pointsCost: "",
  value: "",
  discountType: "PERCENT",
  maxDiscount: "",
  minOrderAmount: "",
  storeId: "all",
  validityDays: "30",
  sortOrder: "0",
  isActive: true
};

function rewardSummary(reward: LoyaltyReward, t: (k: string) => string) {
  switch (reward.type) {
    case "WALLET_CREDIT":
      return `${reward.value ?? 0} ${t("EGP")}`;
    case "DISCOUNT":
      return reward.discountType === "PERCENT"
        ? `${reward.value ?? 0}%${reward.maxDiscount ? ` (${t("loyaltyMax")} ${reward.maxDiscount})` : ""}`
        : `${reward.value ?? 0} ${t("EGP")}`;
    case "FREE_DELIVERY":
      return t("loyaltyType_FREE_DELIVERY");
    default:
      return "—";
  }
}

function RewardsTab() {
  const t = useTranslations();
  const locale = useLocale();
  const { data, refetch } = useApiQuery({
    queryKey: ["loyaltyRewardsAdmin"],
    endPoint: ["loyalty", "loyaltyAdmin", "loyaltyRewards"],
    params: { limit: 100 },
    staleTime: 0
  });
  const { data: storesRes } = useApiQuery({
    queryKey: ["loyaltyStores"],
    endPoint: ["stores"],
    params: { limit: -1 }
  });
  const rewards = extractList<LoyaltyReward>(data);
  const stores = extractList<{ id: number; name: any }>(storesRes);

  const [form, setForm] = useState<RewardForm>(emptyRewardForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof RewardForm>(key: K, value: RewardForm[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const reset = () => {
    setForm(emptyRewardForm);
    setEditingId(null);
  };

  const validate = () => {
    if (!form.nameAr.trim() || !form.nameEn.trim()) return t("loyaltyNameRequired");
    if (!(Number(form.pointsCost) >= 1)) return t("loyaltyPointsCostRequired");
    const value = Number(form.value);
    if (form.type === "WALLET_CREDIT" && !(value > 0)) return t("loyaltyValueRequired");
    if (form.type === "DISCOUNT") {
      if (!(value > 0)) return t("loyaltyValueRequired");
      if (form.discountType === "PERCENT" && value > 100) return t("loyaltyPercentMax");
    }
    return "";
  };

  const buildPayload = () => ({
    name: { ar: form.nameAr.trim(), en: form.nameEn.trim() },
    description:
      form.descriptionAr.trim() || form.descriptionEn.trim()
        ? { ar: form.descriptionAr.trim(), en: form.descriptionEn.trim() }
        : undefined,
    type: form.type,
    pointsCost: Math.floor(Number(form.pointsCost)),
    value: form.type === "FREE_DELIVERY" ? null : numberOrNull(form.value),
    discountType: form.type === "DISCOUNT" ? form.discountType : null,
    maxDiscount:
      form.type === "DISCOUNT" && form.discountType === "PERCENT" ? numberOrNull(form.maxDiscount) : null,
    minOrderAmount: form.type === "WALLET_CREDIT" ? null : numberOrNull(form.minOrderAmount),
    storeId: form.type === "WALLET_CREDIT" || form.storeId === "all" ? null : Number(form.storeId),
    validityDays: form.type === "WALLET_CREDIT" ? null : numberOrNull(form.validityDays),
    sortOrder: numberOrNull(form.sortOrder) ?? 0,
    isActive: form.isActive
  });

  const submit = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    setSubmitting(true);
    const response = await fetchHelper({
      endPoint: editingId
        ? ["loyalty", "loyaltyAdmin", "loyaltyRewards", editingId]
        : ["loyalty", "loyaltyAdmin", "loyaltyRewards"],
      method: editingId ? "PATCH" : "POST",
      body: buildPayload(),
      redirectOnUnauthorized: false
    });
    setSubmitting(false);
    if (response?.success) {
      toast.success(t("Success"));
      reset();
      refetch();
    }
  };

  const edit = (reward: LoyaltyReward) => {
    const name = typeof reward.name === "object" && reward.name ? reward.name : { ar: localized(reward.name, "ar"), en: localized(reward.name, "en") };
    const description =
      typeof reward.description === "object" && reward.description ? reward.description : { ar: "", en: "" };
    setEditingId(reward.id);
    setForm({
      nameAr: name.ar || "",
      nameEn: name.en || "",
      descriptionAr: description.ar || "",
      descriptionEn: description.en || "",
      type: reward.type,
      pointsCost: String(reward.pointsCost ?? ""),
      value: reward.value === null || reward.value === undefined ? "" : String(reward.value),
      discountType: reward.discountType ?? "PERCENT",
      maxDiscount: reward.maxDiscount ? String(reward.maxDiscount) : "",
      minOrderAmount: reward.minOrderAmount ? String(reward.minOrderAmount) : "",
      storeId: reward.storeId ? String(reward.storeId) : "all",
      validityDays: reward.validityDays ? String(reward.validityDays) : "",
      sortOrder: String(reward.sortOrder ?? 0),
      isActive: reward.isActive
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggle = async (reward: LoyaltyReward) => {
    const response = await fetchHelper({
      endPoint: ["loyalty", "loyaltyAdmin", "loyaltyRewards", reward.id],
      method: "PATCH",
      body: { isActive: !reward.isActive },
      redirectOnUnauthorized: false
    });
    if (response?.success) refetch();
  };

  const remove = async (reward: LoyaltyReward) => {
    if (!window.confirm(t("loyaltyDeleteConfirm"))) return;
    const response = await fetchHelper({
      endPoint: ["loyalty", "loyaltyAdmin", "loyaltyRewards", reward.id],
      method: "DELETE",
      redirectOnUnauthorized: false
    });
    if (response?.success) {
      toast.success(t("Deleted"));
      if (editingId === reward.id) reset();
      refetch();
    }
  };

  const showValue = form.type !== "FREE_DELIVERY";
  const showOrderRules = form.type !== "WALLET_CREDIT";

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? t("loyaltyEditReward") : t("loyaltyAddReward")}</CardTitle>
          <CardDescription>{t("loyaltyRewardHint")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>{t("loyaltyNameAr")}</Label>
              <Input value={form.nameAr} onChange={e => update("nameAr", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>{t("loyaltyNameEn")}</Label>
              <Input value={form.nameEn} onChange={e => update("nameEn", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>{t("loyaltyDescriptionAr")}</Label>
              <Input value={form.descriptionAr} onChange={e => update("descriptionAr", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>{t("loyaltyDescriptionEn")}</Label>
              <Input value={form.descriptionEn} onChange={e => update("descriptionEn", e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label>{t("loyaltyRewardType")}</Label>
              <Select value={form.type} onValueChange={value => update("type", value as LoyaltyRewardType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rewardTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {t(`loyaltyType_${type}`)}
                    </SelectItem>
                  ))}
                  <SelectItem value="FREE_PRODUCT" disabled>
                    {t("loyaltyType_FREE_PRODUCT")} ({t("loyaltyComingSoon")})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{t("loyaltyPointsCost")}</Label>
              <Input
                type="number"
                min={1}
                value={form.pointsCost}
                onChange={e => update("pointsCost", e.target.value)}
              />
            </div>
            {form.type === "DISCOUNT" && (
              <div className="grid gap-2">
                <Label>{t("loyaltyDiscountType")}</Label>
                <Select
                  value={form.discountType}
                  onValueChange={value => update("discountType", value as LoyaltyDiscountType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENT">{t("loyaltyDiscount_PERCENT")}</SelectItem>
                    <SelectItem value="FIXED">{t("loyaltyDiscount_FIXED")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {showValue && (
              <div className="grid gap-2">
                <Label>
                  {form.type === "DISCOUNT" && form.discountType === "PERCENT"
                    ? t("loyaltyValuePercent")
                    : t("loyaltyValueEgp")}
                </Label>
                <Input type="number" min={0} value={form.value} onChange={e => update("value", e.target.value)} />
              </div>
            )}
            {form.type === "DISCOUNT" && form.discountType === "PERCENT" && (
              <div className="grid gap-2">
                <Label>{t("loyaltyMaxDiscount")}</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.maxDiscount}
                  onChange={e => update("maxDiscount", e.target.value)}
                />
              </div>
            )}
            {showOrderRules && (
              <>
                <div className="grid gap-2">
                  <Label>{t("loyaltyMinOrderAmount")}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.minOrderAmount}
                    onChange={e => update("minOrderAmount", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("loyaltyValidityDays")}</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder={t("loyaltyNoExpiry")}
                    value={form.validityDays}
                    onChange={e => update("validityDays", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>{t("loyaltyStore")}</Label>
                  <Select value={form.storeId} onValueChange={value => update("storeId", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("loyaltyAllStores")}</SelectItem>
                      {stores.map(store => (
                        <SelectItem key={store.id} value={String(store.id)}>
                          {localized(store.name, locale)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="grid gap-2">
              <Label>{t("loyaltySortOrder")}</Label>
              <Input type="number" value={form.sortOrder} onChange={e => update("sortOrder", e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={form.isActive} onCheckedChange={value => update("isActive", value)} />
            <span className="text-sm">{t("loyaltyActive")}</span>
          </div>

          <div className="flex gap-2">
            <Button onClick={submit} disabled={submitting}>
              {editingId ? <Save className="me-2 h-4 w-4" /> : <Plus className="me-2 h-4 w-4" />}
              {editingId ? t("Save") : t("loyaltyAddReward")}
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
        <CardHeader>
          <CardTitle>{t("loyaltyRewardsCatalog")}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("loyaltyRewardName")}</TableHead>
                <TableHead>{t("loyaltyRewardType")}</TableHead>
                <TableHead>{t("loyaltyRewardValue")}</TableHead>
                <TableHead>{t("loyaltyPointsCost")}</TableHead>
                <TableHead>{t("loyaltyStore")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    {t("loyaltyNoRewards")}
                  </TableCell>
                </TableRow>
              )}
              {rewards.map(reward => (
                <TableRow key={reward.id}>
                  <TableCell className="font-medium">{localized(reward.name, locale)}</TableCell>
                  <TableCell>{t(`loyaltyType_${reward.type}`)}</TableCell>
                  <TableCell>{rewardSummary(reward, t)}</TableCell>
                  <TableCell>{reward.pointsCost}</TableCell>
                  <TableCell>{reward.Store ? localized(reward.Store.name, locale) : t("loyaltyAllStores")}</TableCell>
                  <TableCell>
                    <Badge variant={reward.isActive ? "default" : "outline"}>
                      {reward.isActive ? t("Active") : t("loyaltyInactive")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => toggle(reward)} title={t("loyaltyToggle")}>
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => edit(reward)} title={t("Edit")}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(reward)} title={t("Delete")}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Transactions log (shared with the customer page)
// ---------------------------------------------------------------------------

export function TransactionsTable({ userId }: { userId?: number }) {
  const t = useTranslations();
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [type, setType] = useState<string>("all");
  const limit = 15;

  const params: Record<string, unknown> = { page, limit };
  if (userId) params.userId = userId;
  if (type !== "all") params.type = type;

  const { data, isLoading } = useApiQuery({
    queryKey: ["loyaltyTransactions", userId ?? "all", page, type],
    endPoint: ["loyalty", "loyaltyAdmin", "loyaltyTransactions"],
    params,
    staleTime: 0
  });
  const rows = extractList<LoyaltyTransaction>(data);
  const total = extractTotal(data);
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <Select
          value={type}
          onValueChange={value => {
            setType(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("loyaltyAllTypes")}</SelectItem>
            {transactionTypes.map(tx => (
              <SelectItem key={tx} value={tx}>
                {t(`loyaltyTx_${tx}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Date")}</TableHead>
              {!userId && <TableHead>{t("Customer")}</TableHead>}
              <TableHead>{t("loyaltyTxType")}</TableHead>
              <TableHead>{t("loyaltyPoints")}</TableHead>
              <TableHead>{t("loyaltyBalanceAfter")}</TableHead>
              <TableHead>{t("loyaltyDetails")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={userId ? 5 : 6} className="text-center text-muted-foreground">
                  {t("loyaltyNoTransactions")}
                </TableCell>
              </TableRow>
            )}
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell className="whitespace-nowrap">{formatDate(row.createdAt, locale)}</TableCell>
                {!userId && (
                  <TableCell>
                    {row.User ? (
                      <Link href={`/customers/${row.User.id}`} className="text-primary hover:underline">
                        {row.User.name || `#${row.User.id}`}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <Badge variant="outline">{t(`loyaltyTx_${row.type}`)}</Badge>
                </TableCell>
                <TableCell className={row.points >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"} dir="ltr">
                  {row.points > 0 ? `+${row.points}` : row.points}
                </TableCell>
                <TableCell>{row.balanceAfter}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {[
                    row.orderId ? `${t("Order")} #${row.orderId}` : "",
                    row.Reward ? localized(row.Reward.name, locale) : "",
                    row.walletAmount ? `+${row.walletAmount} ${t("EGP")}` : "",
                    row.note ?? ""
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-end gap-2 text-sm">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            {t("Previous")}
          </Button>
          <span>
            {page} / {pages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage(p => p + 1)}>
            {t("Next")}
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page body
// ---------------------------------------------------------------------------

export default function LoyaltyClient() {
  const t = useTranslations();
  return (
    <Tabs defaultValue="settings" className="grid gap-4">
      <TabsList className="w-fit">
        <TabsTrigger value="settings">{t("loyaltyTabSettings")}</TabsTrigger>
        <TabsTrigger value="rewards">{t("loyaltyTabRewards")}</TabsTrigger>
        <TabsTrigger value="log">{t("loyaltyTabLog")}</TabsTrigger>
      </TabsList>
      <TabsContent value="settings">
        <SettingsTab />
      </TabsContent>
      <TabsContent value="rewards">
        <RewardsTab />
      </TabsContent>
      <TabsContent value="log">
        <Card>
          <CardHeader>
            <CardTitle>{t("loyaltyTabLog")}</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionsTable />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
