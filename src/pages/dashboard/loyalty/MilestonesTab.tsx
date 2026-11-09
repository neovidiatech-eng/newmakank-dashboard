import { fetchHelper } from "@/api/fetch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useLocale, useTranslations } from "@/lib/i18n";
import { Link } from "@/lib/navigation";
import { Pencil, Plus, Power, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ProductPicker, rewardSummary } from "./LoyaltyClient";
import {
  extractList,
  extractTotal,
  formatDate,
  localized,
  type LocalizedText,
  type LoyaltyDiscountType,
  type LoyaltyRewardType,
  numberOrNull,
  rewardTypes
} from "./loyalty-utils";

// "After N delivered orders → a reward" rules. The backend counts delivered
// orders per rule from the moment the rule is created and hands the reward out
// automatically (it lands in the customer's rewards, never expires; wallet
// credit goes straight to the wallet). The platform pays 100%.

type MilestoneRule = {
  id: number;
  name: LocalizedText;
  description?: LocalizedText;
  everyOrders: number;
  repeat: boolean;
  type: LoyaltyRewardType;
  value?: number | null;
  discountType?: LoyaltyDiscountType | null;
  maxDiscount?: number | null;
  minOrderAmount?: number | null;
  storeId?: number | null;
  serviceId?: number | null;
  isActive: boolean;
  sortOrder?: number;
  createdAt: string;
  Store?: { id: number; name: LocalizedText } | null;
  Service?: { id: number; name: LocalizedText } | null;
  _count?: { Grants?: number };
};

type MilestoneGrant = {
  id: number;
  orderId: number;
  orderNumber: number;
  walletAmount?: number | null;
  reversedAt?: string | null;
  createdAt: string;
  Rule?: { id: number; name: LocalizedText; type: LoyaltyRewardType } | null;
  User?: { id: number; name?: string; phone?: string } | null;
};

type RuleForm = {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  everyOrders: string;
  repeat: boolean;
  type: LoyaltyRewardType;
  value: string;
  discountType: LoyaltyDiscountType;
  maxDiscount: string;
  minOrderAmount: string;
  storeId: string;
  serviceId: string;
  serviceName: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyForm: RuleForm = {
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  descriptionEn: "",
  everyOrders: "",
  repeat: true,
  type: "FREE_DELIVERY",
  value: "",
  discountType: "PERCENT",
  maxDiscount: "",
  minOrderAmount: "",
  storeId: "all",
  serviceId: "",
  serviceName: "",
  sortOrder: "0",
  isActive: true
};

function ruleText(rule: { everyOrders: number; repeat: boolean }, t: (k: string) => string) {
  return (rule.repeat ? t("milestoneEveryN") : t("milestoneOnceAtN")).replace("{n}", String(rule.everyOrders));
}

export default function MilestonesTab() {
  const t = useTranslations();
  const locale = useLocale();
  const { data, refetch } = useApiQuery({
    queryKey: ["loyaltyMilestones"],
    endPoint: ["loyalty", "loyaltyAdmin", "loyaltyMilestones"],
    params: { limit: -1 },
    staleTime: 0
  });
  const { data: storesRes } = useApiQuery({
    queryKey: ["loyaltyStores"],
    endPoint: ["stores"],
    params: { limit: -1 }
  });
  const rules = extractList<MilestoneRule>(data);
  const stores = extractList<{ id: number; name: any }>(storesRes);

  const [form, setForm] = useState<RuleForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [grantsKey, setGrantsKey] = useState(0);

  const update = <K extends keyof RuleForm>(key: K, value: RuleForm[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const validate = () => {
    if (!form.nameAr.trim() || !form.nameEn.trim()) return t("loyaltyNameRequired");
    if (!(Math.floor(Number(form.everyOrders)) >= 1)) return t("milestoneEveryRequired");
    const value = Number(form.value);
    if (form.type === "WALLET_CREDIT" && !(value > 0)) return t("loyaltyValueRequired");
    if (form.type === "DISCOUNT") {
      if (!(value > 0)) return t("loyaltyValueRequired");
      if (form.discountType === "PERCENT" && value > 100) return t("loyaltyPercentMax");
    }
    if (form.type === "FREE_PRODUCT" && (form.storeId === "all" || !form.serviceId)) {
      return t("loyaltyProductRequired");
    }
    return "";
  };

  const buildPayload = () => ({
    name: { ar: form.nameAr.trim(), en: form.nameEn.trim() },
    description:
      form.descriptionAr.trim() || form.descriptionEn.trim()
        ? { ar: form.descriptionAr.trim(), en: form.descriptionEn.trim() }
        : undefined,
    everyOrders: Math.floor(Number(form.everyOrders)),
    repeat: form.repeat,
    type: form.type,
    value: form.type === "FREE_DELIVERY" || form.type === "FREE_PRODUCT" ? null : numberOrNull(form.value),
    serviceId: form.type === "FREE_PRODUCT" ? Number(form.serviceId) : null,
    discountType: form.type === "DISCOUNT" ? form.discountType : null,
    maxDiscount: form.type === "DISCOUNT" && form.discountType === "PERCENT" ? numberOrNull(form.maxDiscount) : null,
    minOrderAmount: form.type === "WALLET_CREDIT" ? null : numberOrNull(form.minOrderAmount),
    storeId: form.type === "WALLET_CREDIT" || form.storeId === "all" ? null : Number(form.storeId),
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
        ? ["loyalty", "loyaltyAdmin", "loyaltyMilestones", editingId]
        : ["loyalty", "loyaltyAdmin", "loyaltyMilestones"],
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

  const edit = (rule: MilestoneRule) => {
    const name =
      typeof rule.name === "object" && rule.name
        ? rule.name
        : { ar: localized(rule.name, "ar"), en: localized(rule.name, "en") };
    const description = typeof rule.description === "object" && rule.description ? rule.description : { ar: "", en: "" };
    setEditingId(rule.id);
    setForm({
      nameAr: name.ar || "",
      nameEn: name.en || "",
      descriptionAr: description.ar || "",
      descriptionEn: description.en || "",
      everyOrders: String(rule.everyOrders ?? ""),
      repeat: rule.repeat,
      type: rule.type,
      value: rule.value === null || rule.value === undefined ? "" : String(rule.value),
      discountType: rule.discountType ?? "PERCENT",
      maxDiscount: rule.maxDiscount ? String(rule.maxDiscount) : "",
      minOrderAmount: rule.minOrderAmount ? String(rule.minOrderAmount) : "",
      storeId: rule.storeId ? String(rule.storeId) : "all",
      serviceId: rule.serviceId ? String(rule.serviceId) : "",
      serviceName: rule.Service ? localized(rule.Service.name, locale) : "",
      sortOrder: String(rule.sortOrder ?? 0),
      isActive: rule.isActive
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggle = async (rule: MilestoneRule) => {
    const response = await fetchHelper({
      endPoint: ["loyalty", "loyaltyAdmin", "loyaltyMilestones", rule.id],
      method: "PATCH",
      body: { isActive: !rule.isActive },
      redirectOnUnauthorized: false
    });
    if (response?.success) refetch();
  };

  const remove = async (rule: MilestoneRule) => {
    if (!window.confirm(t("milestoneDeleteConfirm"))) return;
    const response = await fetchHelper({
      endPoint: ["loyalty", "loyaltyAdmin", "loyaltyMilestones", rule.id],
      method: "DELETE",
      redirectOnUnauthorized: false
    });
    if (response?.success) {
      toast.success(t("Deleted"));
      if (editingId === rule.id) reset();
      refetch();
      setGrantsKey(k => k + 1);
    }
  };

  const isFreeProduct = form.type === "FREE_PRODUCT";
  const showValue = form.type !== "FREE_DELIVERY" && !isFreeProduct;
  const showOrderRules = form.type !== "WALLET_CREDIT";
  const n = Math.floor(Number(form.everyOrders)) || 0;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? t("milestoneEdit") : t("milestoneAdd")}</CardTitle>
          <CardDescription>{t("milestoneHint")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>{t("loyaltyNameAr")}</Label>
              <Input value={form.nameAr} onChange={e => update("nameAr", e.target.value)} placeholder={t("milestoneNameArPlaceholder")} />
            </div>
            <div className="grid gap-2">
              <Label>{t("loyaltyNameEn")}</Label>
              <Input value={form.nameEn} onChange={e => update("nameEn", e.target.value)} placeholder="Free delivery gift" />
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
              <Label>{t("milestoneEveryOrders")}</Label>
              <Input type="number" min={1} value={form.everyOrders} onChange={e => update("everyOrders", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>{t("milestoneMode")}</Label>
              <Select value={form.repeat ? "repeat" : "once"} onValueChange={value => update("repeat", value === "repeat")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="repeat">{t("milestoneModeRepeat")}</SelectItem>
                  <SelectItem value="once">{t("milestoneModeOnce")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                </SelectContent>
              </Select>
            </div>
            {form.type === "DISCOUNT" && (
              <div className="grid gap-2">
                <Label>{t("loyaltyDiscountType")}</Label>
                <Select value={form.discountType} onValueChange={value => update("discountType", value as LoyaltyDiscountType)}>
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
                  {form.type === "DISCOUNT" && form.discountType === "PERCENT" ? t("loyaltyValuePercent") : t("loyaltyValueEgp")}
                </Label>
                <Input type="number" min={0} value={form.value} onChange={e => update("value", e.target.value)} />
              </div>
            )}
            {form.type === "DISCOUNT" && form.discountType === "PERCENT" && (
              <div className="grid gap-2">
                <Label>{t("loyaltyMaxDiscount")}</Label>
                <Input type="number" min={0} value={form.maxDiscount} onChange={e => update("maxDiscount", e.target.value)} />
              </div>
            )}
            {showOrderRules && (
              <>
                <div className="grid gap-2">
                  <Label>{t("loyaltyMinOrderAmount")}</Label>
                  <Input type="number" min={0} value={form.minOrderAmount} onChange={e => update("minOrderAmount", e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label>{t("loyaltyStore")}</Label>
                  <Select
                    value={form.storeId}
                    onValueChange={value => setForm(prev => ({ ...prev, storeId: value, serviceId: "", serviceName: "" }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("loyaltyChooseStore")} />
                    </SelectTrigger>
                    <SelectContent>
                      {!isFreeProduct && <SelectItem value="all">{t("loyaltyAllStores")}</SelectItem>}
                      {stores.map(store => (
                        <SelectItem key={store.id} value={String(store.id)}>
                          {localized(store.name, locale)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {isFreeProduct && (
                  <ProductPicker
                    storeId={form.storeId === "all" ? null : Number(form.storeId)}
                    serviceId={form.serviceId}
                    serviceName={form.serviceName}
                    onPick={(id, name) => setForm(prev => ({ ...prev, serviceId: id, serviceName: name }))}
                  />
                )}
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

          <div className="rounded-lg bg-muted/50 p-4 text-sm">
            <p className="mb-1 font-medium">{t("loyaltyPreview")}</p>
            {n > 0 ? (
              <p>
                {(form.repeat ? t("milestonePreviewRepeat") : t("milestonePreviewOnce"))
                  .replace("{n}", String(n))
                  .replace("{n2}", String(n * 2))
                  .replace("{n3}", String(n * 3))
                  .replace("{reward}", t(`loyaltyType_${form.type}`))}
              </p>
            ) : (
              <p className="text-muted-foreground">{t("milestoneEveryRequired")}</p>
            )}
            <p className="mt-1 text-muted-foreground">{t("milestonePreviewNotes")}</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={submit} disabled={submitting}>
              {editingId ? <Save className="me-2 h-4 w-4" /> : <Plus className="me-2 h-4 w-4" />}
              {editingId ? t("Save") : t("milestoneAdd")}
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
          <CardTitle>{t("milestoneRules")}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("loyaltyRewardName")}</TableHead>
                <TableHead>{t("milestoneRule")}</TableHead>
                <TableHead>{t("loyaltyRewardType")}</TableHead>
                <TableHead>{t("loyaltyRewardValue")}</TableHead>
                <TableHead>{t("loyaltyStore")}</TableHead>
                <TableHead>{t("milestoneGrantedCount")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    {t("milestoneNoRules")}
                  </TableCell>
                </TableRow>
              )}
              {rules.map(rule => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{localized(rule.name, locale)}</TableCell>
                  <TableCell>{ruleText(rule, t)}</TableCell>
                  <TableCell>{t(`loyaltyType_${rule.type}`)}</TableCell>
                  <TableCell>{rewardSummary(rule, t, locale)}</TableCell>
                  <TableCell>{rule.Store ? localized(rule.Store.name, locale) : t("loyaltyAllStores")}</TableCell>
                  <TableCell>{rule._count?.Grants ?? 0}</TableCell>
                  <TableCell>
                    <Badge variant={rule.isActive ? "default" : "outline"}>
                      {rule.isActive ? t("Active") : t("loyaltyInactive")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => toggle(rule)} title={t("loyaltyToggle")}>
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => edit(rule)} title={t("Edit")}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(rule)} title={t("Delete")}>
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

      <Card>
        <CardHeader>
          <CardTitle>{t("milestoneGrantsLog")}</CardTitle>
          <CardDescription>{t("milestoneGrantsHint")}</CardDescription>
        </CardHeader>
        <CardContent>
          <GrantsTable key={grantsKey} />
        </CardContent>
      </Card>
    </div>
  );
}

function GrantsTable() {
  const t = useTranslations();
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const limit = 15;
  const { data, isLoading } = useApiQuery({
    queryKey: ["loyaltyMilestoneGrants", page],
    endPoint: ["loyalty", "loyaltyAdmin", "loyaltyMilestones", "loyaltyMilestoneGrants"],
    params: { page, limit },
    staleTime: 0
  });
  const rows = extractList<MilestoneGrant>(data);
  const pages = Math.max(1, Math.ceil(extractTotal(data) / limit));

  return (
    <div className="grid gap-3">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Date")}</TableHead>
              <TableHead>{t("Customer")}</TableHead>
              <TableHead>{t("loyaltyRewardName")}</TableHead>
              <TableHead>{t("milestoneOrderNumber")}</TableHead>
              <TableHead>{t("Order")}</TableHead>
              <TableHead>{t("Status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  {t("milestoneNoGrants")}
                </TableCell>
              </TableRow>
            )}
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell className="whitespace-nowrap">{formatDate(row.createdAt, locale)}</TableCell>
                <TableCell>
                  {row.User ? (
                    <Link href={`/customers/${row.User.id}`} className="text-primary hover:underline">
                      {row.User.name || `#${row.User.id}`}
                    </Link>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {row.Rule ? localized(row.Rule.name, locale) : "—"}
                  {row.walletAmount ? ` · +${row.walletAmount} ${t("EGP")}` : ""}
                </TableCell>
                <TableCell>{row.orderNumber}</TableCell>
                <TableCell>#{row.orderId}</TableCell>
                <TableCell>
                  <Badge variant={row.reversedAt ? "outline" : "default"}>
                    {row.reversedAt ? t("milestoneGrantReversed") : t("milestoneGrantGiven")}
                  </Badge>
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
