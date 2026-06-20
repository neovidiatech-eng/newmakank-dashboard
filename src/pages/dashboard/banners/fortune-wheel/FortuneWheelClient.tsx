import { fetchHelper } from "@/api/fetch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Gift, Pencil, Plus, Power, RotateCcw, Trash2, X } from "lucide-react";
import { useLocale, useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { useApiQuery } from "@/hooks/useApiQuery";

type RewardType = "DISCOUNT" | "FREE_DELIVERY" | "FIXED_AMOUNT" | "NONE" | "CUSTOM";

type LocalizedText = string | { ar?: string; en?: string } | null | undefined;

type FortuneWheelSettings = {
  displayIntervalHours?: number | null;
  isEnabled?: boolean;
};

type FortuneWheelItem = {
  id: number;
  displayName?: LocalizedText;
  name?: LocalizedText;
  rewardType?: RewardType;
  rewardValue?: number | string | null;
  weight?: number | string | null;
  maxDiscount?: number | string | null;
  minOrderAmount?: number | string | null;
  maxOrderAmount?: number | string | null;
  rewardExpiryHours?: number | string | null;
  active?: boolean;
  isActive?: boolean;
};

type FortuneWheelForm = {
  displayNameAr: string;
  displayNameEn: string;
  rewardType: RewardType;
  rewardValue: string;
  weight: string;
  maxDiscount: string;
  minOrderAmount: string;
  maxOrderAmount: string;
  rewardExpiryHours: string;
};

const rewardTypes: RewardType[] = ["DISCOUNT", "FREE_DELIVERY", "FIXED_AMOUNT", "NONE", "CUSTOM"];
const intervalOptions = [1, 6, 12, 24, 48, 72];

const emptyForm: FortuneWheelForm = {
  displayNameAr: "",
  displayNameEn: "",
  rewardType: "DISCOUNT",


  rewardValue: "",
  weight: "1",
  maxDiscount: "",
  minOrderAmount: "",
  maxOrderAmount: "",
  rewardExpiryHours: "24"
};

const fixedRewardValues: Partial<Record<RewardType, string>> = {
  FREE_DELIVERY: "Free",
  NONE: "Try again"
};

function getLocalizedText(value: LocalizedText, locale: string) {
  if (!value) return "—";
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") {
        return parsed[locale as "ar" | "en"] || parsed.ar || parsed.en || value;
      }
    } catch {
      // ignore
    }
    return value;
  }
  return value[locale as "ar" | "en"] || value.ar || value.en || "—";
}

function getNumberOrNull(value: string) {
  if (value === "") return null;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

export default function FortuneWheelClient() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const { data: settingsRes, refetch: refetchSettings } = useApiQuery({
    queryKey: ["fortuneWheelSettings"],
    endPoint: ["fortuneWheel", "fortuneWheelSettings"]
  });
  const { data: itemsRes, refetch: refetchItems } = useApiQuery({
    queryKey: ["fortuneWheelItems"],
    endPoint: ["fortuneWheel"]
  });

  const settings: FortuneWheelSettings | null = settingsRes?.data ?? null;
  const items: FortuneWheelItem[] = Array.isArray(itemsRes?.data) ? itemsRes.data : [];

  const refetchAll = () => { refetchSettings(); refetchItems(); };

  const [form, setForm] = useState<FortuneWheelForm>(emptyForm);
  const [displayIntervalHours, setDisplayIntervalHours] = useState("24");
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  useEffect(() => {
    if (settings) {
      if (settings.displayIntervalHours !== undefined && settings.displayIntervalHours !== null) {
        setDisplayIntervalHours(String(settings.displayIntervalHours));
      }
      if (settings.isEnabled !== undefined && settings.isEnabled !== null) {
        setIsEnabled(settings.isEnabled);
      }
    }
  }, [settings]);

  const isFixedRewardValue = form.rewardType in fixedRewardValues;
  const currentRewardValue = isFixedRewardValue ? fixedRewardValues[form.rewardType] || "" : form.rewardValue;

  const sortedItems = useMemo(() => [...items].sort((a, b) => Number(a.id) - Number(b.id)), [items]);

  const updateForm = <K extends keyof FortuneWheelForm>(field: K, value: FortuneWheelForm[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingItemId(null);
  };

  const saveSettings = async (nextSettings: FortuneWheelSettings) => {
    setIsSavingSettings(true);
    const response = await fetchHelper({
      endPoint: ["fortuneWheel", "fortuneWheelSettings"],
      method: "PATCH",
      body: nextSettings,
      redirectOnUnauthorized: false
    });
    setIsSavingSettings(false);

    if (response?.success) {
      toast.success(t("Success"));
      refetchAll();
    } else {
      toast.error(response?.message || t("Something went wrong"));
    }
  };

  const handleIntervalChange = (value: string) => {
    setDisplayIntervalHours(value);
    saveSettings({ displayIntervalHours: Number(value), isEnabled });
  };

  const handleEnabledChange = (value: boolean) => {
    setIsEnabled(value);
    saveSettings({ displayIntervalHours: Number(displayIntervalHours), isEnabled: value });
  };

  const validate = () => {
    if (!form.displayNameAr.trim() || !form.displayNameEn.trim()) return t("fortuneNameRequired");
    if (form.rewardType === "DISCOUNT") {
      const value = Number(form.rewardValue);
      if (!value || value < 1 || value > 100) return t("fortuneDiscountRequired");
    }
    if (form.rewardType === "FIXED_AMOUNT" && (!Number(form.rewardValue) || Number(form.rewardValue) <= 0)) {
      return t("fortuneFixedAmountRequired");
    }


    const min = getNumberOrNull(form.minOrderAmount);
    const max = getNumberOrNull(form.maxOrderAmount);
    if (min !== null && max !== null && min > max) return t("fortuneMinMaxInvalid");
    return "";
  };

  const buildPayload = () => ({
    displayName: JSON.stringify({ ar: form.displayNameAr, en: form.displayNameEn }),
    rewardType: form.rewardType,
    rewardValue: ["FREE_DELIVERY", "NONE"].includes(form.rewardType) ? null : getNumberOrNull(form.rewardValue),
    weight: getNumberOrNull(form.weight) ?? 1,
    maxDiscount: getNumberOrNull(form.maxDiscount),
    minOrderAmount: getNumberOrNull(form.minOrderAmount),
    maxOrderAmount: getNumberOrNull(form.maxOrderAmount),
    rewardExpiryHours: getNumberOrNull(form.rewardExpiryHours) ?? 24,
    isActive: true,
    sortOrder: 0
  });

  const handleAddItem = async () => {
    const validationMessage = validate();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    if (!form.displayNameAr.trim() || !form.displayNameEn.trim()) {
      toast.error(t("fortuneNameRequired"));
      return;
    }

    setIsSubmitting(true);
    const response = await fetchHelper({
      endPoint: editingItemId ? ["fortuneWheel", editingItemId] : ["fortuneWheel"],
      method: editingItemId ? "PATCH" : "POST",
      body: buildPayload(),
      redirectOnUnauthorized: false
    });
    setIsSubmitting(false);

    if (response?.success) {
      toast.success(t("Success"));
      resetForm();
      refetchAll();
    } else {
      toast.error(response?.message || t("Something went wrong"));
    }
  };

  const handleEditItem = (item: FortuneWheelItem) => {
    const displayName = item.displayName || item.name;
    // Ensure displayName is present and not empty in both locales
    const isEmpty =
      typeof displayName === "string"
        ? !displayName.trim()
        : !(displayName?.ar?.trim() || displayName?.en?.trim());
    if (isEmpty) {
      toast.error(t("displayNameMissing"));
      return;
    }
    const localizedName =
      typeof displayName === "string"
        ? { ar: displayName, en: displayName }
        : {
          ar: displayName?.ar || "",
          en: displayName?.en || "",
        };
    setEditingItemId(item.id);
    setForm({
      displayNameAr: localizedName.ar,
      displayNameEn: localizedName.en,
      rewardType: item.rewardType ?? "DISCOUNT",
      rewardValue:
        item.rewardValue === null || item.rewardValue === undefined ? "" : String(item.rewardValue),
      weight: item.weight === null || item.weight === undefined ? "1" : String(item.weight),
      maxDiscount:
        item.maxDiscount === null || item.maxDiscount === undefined
          ? ""
          : String(item.maxDiscount),
      minOrderAmount:
        item.minOrderAmount === null || item.minOrderAmount === undefined
          ? ""
          : String(item.minOrderAmount),
      maxOrderAmount:
        item.maxOrderAmount === null || item.maxOrderAmount === undefined
          ? ""
          : String(item.maxOrderAmount),
      rewardExpiryHours:
        item.rewardExpiryHours === null || item.rewardExpiryHours === undefined
          ? "24"
          : String(item.rewardExpiryHours),
    });
  };
  // const handleDeleteItem = async (id: number) => {
  //   const response = await fetchHelper({
  //     endPoint: ["fortuneWheel", id],
  //     method: "DELETE"
  //   });

  //   if (response?.success) {
  //     toast.success(t("Deleted"));
  //     router.refresh();
  //   } else {
  //     toast.error(response?.message || t("Something went wrong"));
  //   }
  // };
  const handleDeleteItem = async (id: number) => {
    const response = await fetchHelper({
      endPoint: ["fortuneWheel", id],
      method: "DELETE",
      redirectOnUnauthorized: false
    });

    if (response?.success) {
      toast.success(t("Deleted"));
      refetchAll();
    } else {
      toast.error(response?.message || t("Something went wrong"));
    }
  };

  const handleToggleStatus = async (id: number) => {
    const response = await fetchHelper({
      endPoint: ["fortuneWheel", id, "toggleStatus"],
      method: "PATCH",
      redirectOnUnauthorized: false
    });

    if (response?.success) {
      toast.success(t("Success"));
      refetchAll();
    } else {
      toast.error(response?.message || t("Failed to change status"));
    }
  };

  return (
    <div className="grid gap-6">
      <Card className="overflow-hidden border-gray-200/80 bg-white dark:border-gray-800 dark:bg-slate-950">
        <CardHeader className="gap-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <RotateCcw className="h-5 w-5" />
                </span>
                {t("fortuneWheel")}
              </CardTitle>
              <CardDescription className="mt-2">{t("fortuneWheelDescription")}</CardDescription>
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[220px]">
                <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">{t("appearanceInterval")}</label>
                <Select value={displayIntervalHours} onValueChange={handleIntervalChange} disabled={isSavingSettings}>
                  <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder={t("appearanceInterval")} /></SelectTrigger>
                  <SelectContent>
                    {intervalOptions.map(interval => (
                      <SelectItem key={interval} value={String(interval)}>{interval} {t("hours")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex h-10 items-center gap-3 rounded-xl border px-4">
                <span className="text-sm font-medium">{t("enabled")}</span>
                <Switch checked={isEnabled} onCheckedChange={handleEnabledChange} disabled={isSavingSettings} />
              </div>
              <Badge variant="info" className="rounded-full">{t("connectedToApi")}</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-5">
          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-slate-900/40">
            <div className="mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{t("addFortuneWheelRow")}</h2>
            </div>

            <div className="grid gap-3 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">{t("titleAr")}</label>
                <Input value={form.displayNameAr} onChange={event => updateForm("displayNameAr", event.target.value)} placeholder={t("fortuneWheelItemNamePlaceholder")} />
              </div>
              <div className="lg:col-span-3">
                <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">{t("titleEn")}</label>
                <Input value={form.displayNameEn} onChange={event => updateForm("displayNameEn", event.target.value)} placeholder="10% discount" />
              </div>
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">{t("rewardType")}</label>
                <Select
                  value={form.rewardType}
                  onValueChange={value => {
                    const rewardType = value as RewardType;
                    setForm(prev => ({
                      ...prev,
                      rewardType,
                      rewardValue: fixedRewardValues[rewardType] ? "" : prev.rewardValue
                    }));
                  }}
                >
                  <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder={t("rewardType")} /></SelectTrigger>
                  <SelectContent>
                    {rewardTypes.map(type => <SelectItem key={type} value={type}>{t(`fortuneRewardApi.${type}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">{t("rewardValue")}</label>
                <Input value={currentRewardValue} onChange={event => updateForm("rewardValue", event.target.value)} placeholder={t("rewardValuePlaceholder")} disabled={isFixedRewardValue} />
              </div>
              {/* <div className="lg:col-span-1">
                <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">{t("weight")}</label>
                <Input type="number" min="1" value={form.weight} onChange={event => updateForm("weight", event.target.value)} />
              </div> */}
              <div className="flex items-end lg:col-span-1">
                <Button type="button" className="h-10 w-full rounded-xl" onClick={handleAddItem} disabled={isSubmitting || !form.displayNameAr.trim() || !form.displayNameEn.trim()}>
                  {editingItemId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
              <div className="lg:col-span-3">
                <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">{t("maxDiscount")} ({t("optional")})</label>
                <Input type="number" value={form.maxDiscount} onChange={event => updateForm("maxDiscount", event.target.value)} />
              </div>
              <div className="lg:col-span-3">
                <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">{t("minOrderAmount")} ({t("optional")})</label>
                <Input type="number" value={form.minOrderAmount} onChange={event => updateForm("minOrderAmount", event.target.value)} />
              </div>
              <div className="lg:col-span-3">
                <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">{t("maxOrderAmount")} ({t("optional")})</label>
                <Input type="number" value={form.maxOrderAmount} onChange={event => updateForm("maxOrderAmount", event.target.value)} />
              </div>
              <div className="lg:col-span-3">
                <label className="mb-2 block text-sm text-gray-600 dark:text-gray-300">{t("rewardExpiryHours")}</label>
                <Input type="number" min="1" value={form.rewardExpiryHours} onChange={event => updateForm("rewardExpiryHours", event.target.value)} />
              </div>
            </div>
            {editingItemId ? (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Badge variant="warning">{t("Edit")} #{editingItemId}</Badge>
                <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                  <X className="h-4 w-4" />
                  {t("Cancel")}
                </Button>
              </div>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead className="text-center">{t("fortuneWheelItemName")}</TableHead>
                  <TableHead className="text-center">{t("rewardType")}</TableHead>
                  <TableHead className="text-center">{t("rewardValue")}</TableHead>
                  <TableHead className="text-center">{t("weight")}</TableHead>
                  <TableHead className="text-center">{t("rewardExpiryHours")}</TableHead>
                  <TableHead className="text-center">{t("status")}</TableHead>
                  <TableHead className="text-center">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">{t("No Data")}</TableCell>
                  </TableRow>
                ) : sortedItems.map(item => {
                  const active = item.active ?? item.isActive ?? true;
                  return (
                    <TableRow key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/50">
                      <TableCell className="text-center font-medium">{getLocalizedText(item.displayName || item.name, locale)}</TableCell>
                      <TableCell className="text-center"><Badge variant="outline">{t(`fortuneRewardApi.${item.rewardType || "NONE"}`)}</Badge></TableCell>
                      <TableCell className="text-center">{item.rewardValue ?? "—"}</TableCell>
                      <TableCell className="text-center">{item.weight ?? 1}</TableCell>
                      <TableCell className="text-center">{item.rewardExpiryHours ?? 24} {t("hours")}</TableCell>
                      <TableCell className="text-center"><Badge variant={active ? "success" : "muted"}>{active ? t("Active") : t("inactive")}</Badge></TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button type="button" variant="outline" size="icon" className="rounded-full" onClick={() => handleEditItem(item)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="outline" size="icon" className="rounded-full" onClick={() => handleToggleStatus(item.id)}>
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="outline" size="icon" className="rounded-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white" onClick={() => handleDeleteItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
