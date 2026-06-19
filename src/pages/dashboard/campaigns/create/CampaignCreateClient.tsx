import { fetchHelper } from "@/api/fetch";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import SelectPaginated from "@/components/common/Inputs/select/SelectPaginatedInput";
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
import { Textarea } from "@/components/ui/textarea";
import { Bell, Gift, ImagePlus, Save, Send } from "lucide-react";
import type { endpointType } from "@/utils/endpoints";
import { useLocale, useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type CampaignFormType = "NOTIFICATION" | "OFFER";
type IncentiveType = "none" | "freeDelivery" | "discount";
type CampaignTargetType = "ALL" | "CUSTOMER" | "STORE" | "SERVICE" | "SELECTED_USERS";

type LocalizedText = string | { ar?: string; en?: string } | null | undefined;

type CampaignData = {
  id?: number;
  type?: CampaignFormType;
  title?: LocalizedText;
  description?: LocalizedText;
  featureText?: LocalizedText;
  valueText?: LocalizedText;
  image?: string | null;
  targetType?: CampaignTargetType;
  targetUserIds?: Array<string | number>;
  storeId?: string | number | null;
  serviceId?: string | number | null;
  startAt?: string | null;
  endAt?: string | null;
  displayIntervalHours?: number | null;
};

type CampaignFormState = {
  type: CampaignFormType;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  incentiveType: IncentiveType;
  discountValueAr: string;
  discountValueEn: string;
  image: File | null;
  targetType: CampaignTargetType;
  targetUserIds: string[];
  storeId: string;
  serviceId: string;
  startAt: string;
  endAt: string;
  displayIntervalHours: string;
};

const incentiveTypes: IncentiveType[] = ["none", "freeDelivery", "discount"];
const targetTypes: CampaignTargetType[] = ["ALL", "CUSTOMER", "STORE", "SERVICE", "SELECTED_USERS"];
const intervalOptions = ["0", "1", "6", "12", "24", "48"];

function getLocalizedText(value: LocalizedText, locale: string) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale as "ar" | "en"] || value.ar || value.en || "";
}

function toDatetimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function toIsoDate(value: string) {
  return value ? new Date(value).toISOString() : "";
}

function getInitialForm(data?: CampaignData | null, locale = "ar"): CampaignFormState {
  const valueTextStr = data?.valueText ? getLocalizedText(data.valueText, locale) : "";
  const isFreeDelivery = valueTextStr.includes("توصيل") || valueTextStr.toLowerCase().includes("free");
  const incentiveType: IncentiveType = isFreeDelivery ? "freeDelivery" : (data?.valueText ? "discount" : "none");

  let discountValueAr = "";
  let discountValueEn = "";
  if (incentiveType === "discount" && data?.valueText) {
    if (typeof data.valueText === "object" && data.valueText !== null) {
      discountValueAr = data.valueText.ar || "";
      discountValueEn = data.valueText.en || "";
    } else if (typeof data.valueText === "string") {
      discountValueAr = data.valueText;
      discountValueEn = data.valueText;
    }

    if (discountValueAr.trim().startsWith("خصم")) {
      discountValueAr = discountValueAr.trim().substring(3).trim();
    }
    if (discountValueEn.trim().toLowerCase().endsWith("discount")) {
      const trimmed = discountValueEn.trim();
      discountValueEn = trimmed.substring(0, trimmed.length - 8).trim();
    }
  }

  return {
    type: data?.type || "NOTIFICATION",
    titleAr: typeof data?.title === "object" ? data?.title?.ar || "" : locale === "ar" ? data?.title || "" : "",
    titleEn: typeof data?.title === "object" ? data?.title?.en || "" : locale === "en" ? data?.title || "" : "",
    descriptionAr: typeof data?.description === "object" ? data?.description?.ar || "" : locale === "ar" ? data?.description || "" : "",
    descriptionEn: typeof data?.description === "object" ? data?.description?.en || "" : locale === "en" ? data?.description || "" : "",
    incentiveType,
    discountValueAr,
    discountValueEn,
    image: null,
    targetType: data?.targetType || "ALL",
    targetUserIds: data?.targetUserIds?.map(String) || [],
    storeId: data?.storeId ? String(data.storeId) : "",
    serviceId: data?.serviceId ? String(data.serviceId) : "",
    startAt: toDatetimeLocal(data?.startAt),
    endAt: toDatetimeLocal(data?.endAt),
    displayIntervalHours: data?.displayIntervalHours === null || data?.displayIntervalHours === undefined ? "24" : String(data.displayIntervalHours)
  };
}

export default function CampaignCreateClient({ data }: { data?: CampaignData | null }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [form, setForm] = useState<CampaignFormState>(() => getInitialForm(data, locale));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = Boolean(data?.id);

  const isOffer = form.type === "OFFER";
  const requiresDescription = form.type === "NOTIFICATION";
  const requiresStore = form.targetType === "STORE" || form.targetType === "SERVICE";
  const requiresService = form.targetType === "SERVICE";
  const requiresUsers = form.targetType === "SELECTED_USERS";

  const storesApiUrl = useMemo<endpointType>(() => ["stores"], []);
  const servicesApiUrl = useMemo<endpointType>(() => ["services"], []);
  const customersApiUrl = useMemo<endpointType>(() => ["customers"], []);
  const serviceSearchFilters = useMemo(() => form.storeId ? [{ key: "storeId", value: form.storeId }] : [], [form.storeId]);

  const existingImageLabel = useMemo(() => data?.image ? String(data.image).split("/").pop() : "", [data?.image]);

  const updateForm = <K extends keyof CampaignFormState>(field: K, value: CampaignFormState[K]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (type: CampaignFormType) => {
    setForm(prev => ({
      ...prev,
      type,
      targetType: type === "NOTIFICATION" && prev.targetType === "SERVICE" ? "ALL" : prev.targetType
    }));
  };

  const handleTargetChange = (targetType: CampaignTargetType) => {
    setForm(prev => ({
      ...prev,
      targetType,
      storeId: targetType === "STORE" || targetType === "SERVICE" ? prev.storeId : "",
      serviceId: targetType === "SERVICE" ? prev.serviceId : "",
      targetUserIds: targetType === "SELECTED_USERS" ? prev.targetUserIds : []
    }));
  };

  const buildPayload = () => {
    const body = new FormData();
    body.append("type", form.type);
    body.append("title", JSON.stringify({ ar: form.titleAr, en: form.titleEn }));

    if (form.descriptionAr || form.descriptionEn || form.type === "NOTIFICATION") {
      body.append("description", JSON.stringify({ ar: form.descriptionAr, en: form.descriptionEn }));
    }

    if (form.incentiveType === "freeDelivery") {
      const freeDeliveryText = { ar: "توصيل مجاني", en: "Free delivery" };
      body.append("featureText", JSON.stringify(freeDeliveryText));
      body.append("valueText", JSON.stringify(freeDeliveryText));
    } else if (form.incentiveType === "discount") {
      const arVal = form.discountValueAr.trim().startsWith("خصم") 
        ? form.discountValueAr.trim() 
        : `خصم ${form.discountValueAr.trim()}`;
        
      const enVal = form.discountValueEn.trim().toLowerCase().endsWith("discount")
        ? form.discountValueEn.trim()
        : `${form.discountValueEn.trim()} discount`;

      const discountText = { ar: arVal, en: enVal };
      body.append("featureText", JSON.stringify(discountText));
      body.append("valueText", JSON.stringify(discountText));
    }

    if (form.image) body.append("image", form.image);
    body.append("targetType", form.targetType);

    if (requiresUsers) {
      form.targetUserIds.map(Number).filter(Boolean).forEach(id => {
        body.append("targetUserIds", String(id));
      });
    }

    if (requiresStore) body.append("storeId", form.storeId);
    if (requiresService) body.append("serviceId", form.serviceId);
    if (form.startAt) body.append("startAt", toIsoDate(form.startAt));
    if (form.endAt) body.append("endAt", toIsoDate(form.endAt));
    if (form.displayIntervalHours !== "") body.append("displayIntervalHours", form.displayIntervalHours);

    return body;
  };

  const validate = () => {
    if (!form.titleAr.trim() || !form.titleEn.trim()) return t("campaignTitleRequired");
    if (requiresDescription && (!form.descriptionAr.trim() || !form.descriptionEn.trim())) return t("campaignDescriptionRequired");
    if (form.incentiveType === "discount" && (!form.discountValueAr.trim() || !form.discountValueEn.trim())) return t("campaignDiscountValueRequired");
    if (isOffer && !form.image && !data?.image) return t("campaignImageRequired");
    if (requiresStore && !form.storeId) return t("campaignStoreRequired");
    if (requiresService && !form.serviceId) return t("campaignServiceRequired");
    if (requiresUsers && form.targetUserIds.length === 0) return t("campaignUsersRequired");
    if (form.startAt && form.endAt && new Date(form.endAt).getTime() <= new Date(form.startAt).getTime()) return t("campaignEndAfterStartRequired");
    return "";
  };

  const handleSubmit = async () => {
    const validationMessage = validate();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    setIsSubmitting(true);
    const response = await fetchHelper({
      endPoint: isEdit && data?.id ? ["campaigns", data.id] : ["campaigns"],
      method: isEdit ? "PATCH" : "POST",
      body: buildPayload(),
      redirectOnUnauthorized: false
    });
    setIsSubmitting(false);

    if (response?.success) {
      const reachedCount = (response?.data as { reachedCount?: number } | null)?.reachedCount;
      toast.success(
        reachedCount !== undefined
          ? `${t("Success")} · ${t("reachedCustomers")}: ${reachedCount}`
          : t("Success")
      );
      router.push("/campaigns");
      router.refresh();
    } else {
      toast.error(response?.message || t("Something went wrong"));
    }
  };

  return (
    <Card className="overflow-hidden border-gray-200/80 bg-white dark:border-gray-800 dark:bg-slate-950">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{t("createCampaign")}</CardTitle>
            <CardDescription className="mt-2">{t("createCampaignDescription")}</CardDescription>
          </div>
          <Badge variant="info" className="rounded-full">
            {isEdit ? t("Edit") : t("connectedToApi")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => handleTypeChange("NOTIFICATION")}
            className={`rounded-2xl border p-5 text-start transition ${form.type === "NOTIFICATION" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
          >
            <Bell className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-semibold">{t("campaignTypeValue.notification")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("notificationCampaignDescription")}</p>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("OFFER")}
            className={`rounded-2xl border p-5 text-start transition ${form.type === "OFFER" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
          >
            <Gift className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-semibold">{t("campaignTypeValue.offer")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("offerCampaignDescription")}</p>
          </button>
        </div>

        {form.type === "NOTIFICATION" && !isEdit && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-200">
            <Send className="mt-0.5 h-4 w-4" />
            <p>{t("notificationSendsImmediatelyNote")}</p>
          </div>
        )}

        <div className="grid gap-5 rounded-2xl border bg-muted/20 p-5">
          <h3 className="font-semibold">{t("campaignContent")}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>{t("titleAr")}</Label>
              <Input value={form.titleAr} onChange={event => updateForm("titleAr", event.target.value)} placeholder={t("campaignTitlePlaceholder")} />
            </div>
            <div className="grid gap-2">
              <Label>{t("titleEn")}</Label>
              <Input value={form.titleEn} onChange={event => updateForm("titleEn", event.target.value)} placeholder={t("campaignTitlePlaceholder")} />
            </div>
            <div className="grid gap-2">
              <Label>{t("descriptionAr")} {requiresDescription ? "*" : `(${t("optional")})`}</Label>
              <Textarea value={form.descriptionAr} onChange={event => updateForm("descriptionAr", event.target.value)} placeholder={t("campaignDescriptionPlaceholder")} />
            </div>
            <div className="grid gap-2">
              <Label>{t("descriptionEn")} {requiresDescription ? "*" : `(${t("optional")})`}</Label>
              <Textarea value={form.descriptionEn} onChange={event => updateForm("descriptionEn", event.target.value)} placeholder={t("campaignDescriptionPlaceholder")} />
            </div>
            <div className="grid gap-2">
              <Label>{t("rewardType")}</Label>
              <Select value={form.incentiveType} onValueChange={value => updateForm("incentiveType", value as IncentiveType)}>
                <SelectTrigger><SelectValue placeholder={t("rewardType")} /></SelectTrigger>
                <SelectContent>
                  {incentiveTypes.map(type => <SelectItem key={type} value={type}>{t(`campaignIncentiveType.${type}`)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {form.incentiveType === "discount" && (
              <>
                <div className="grid gap-2">
                  <Label>{t("valueAr")} *</Label>
                  <Input value={form.discountValueAr} onChange={event => updateForm("discountValueAr", event.target.value)} placeholder={t("campaignValuePlaceholder")} />
                </div>
                <div className="grid gap-2">
                  <Label>{t("valueEn")} *</Label>
                  <Input value={form.discountValueEn} onChange={event => updateForm("discountValueEn", event.target.value)} placeholder={t("campaignValuePlaceholder")} />
                </div>
              </>
            )}
            {isOffer && (
              <div className="grid gap-2">
                <Label>{t("Offer Image")} *</Label>
                <Input type="file" accept="image/*" onChange={event => updateForm("image", event.target.files?.[0] ?? null)} />
                {existingImageLabel && <p className="text-xs text-muted-foreground">{t("currentImage")}: {existingImageLabel}</p>}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-5 rounded-2xl border bg-muted/20 p-5">
          <div className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">{t("targeting")}</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3 items-end">
            <div className="grid gap-2">
              <Label>{t("targetType")}</Label>
              <Select 
                value={form.targetType} 
                onValueChange={value => handleTargetChange(value as CampaignTargetType)}
              >
                <SelectTrigger><SelectValue placeholder={t("targetType")} /></SelectTrigger>
                <SelectContent>
                  {targetTypes.map(type => <SelectItem key={type} value={type}>{t(`campaignTargetType.${type}`)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{t("store")} {requiresStore ? "*" : `(${t("optional")})`}</Label>
              <SelectPaginated
                name="storeId"
                apiUrl={storesApiUrl}
                value={form.storeId}
                disabled={!requiresStore}
                onChange={value => updateForm("storeId", value ? String(value) : "")}
                placeholder={t("store")}
              />
            </div>
            <div className="grid gap-2">
              <Label>{t("products")} {requiresService ? "*" : `(${t("optional")})`}</Label>
              <SelectPaginated
                name="serviceId"
                apiUrl={servicesApiUrl}
                value={form.serviceId}
                disabled={!requiresService || !form.storeId}
                searchFilters={serviceSearchFilters}
                labelFormat="serviceStore"
                onChange={value => updateForm("serviceId", value ? String(value) : "")}
                placeholder={t("products")}
              />
            </div>
            {requiresUsers && (
              <div className="grid gap-2 md:col-span-3">
                <Label>{t("selectedCustomers")} *</Label>
                <SelectPaginated
                  isMulti
                  name="targetUserIds"
                  apiUrl={customersApiUrl}
                  value={form.targetUserIds}
                  onChange={value => updateForm("targetUserIds", Array.isArray(value) ? value.map(item => String(item.value ?? item)) : [])}
                  placeholder={t("selectedCustomers")}
                />
              </div>
            )}
          </div>
        </div>

        {isOffer && (
          <div className="grid gap-5 rounded-2xl border bg-muted/20 p-5">
            <h3 className="font-semibold">{t("campaignTiming")}</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label>{t("appearanceInterval")}</Label>
                <Select value={form.displayIntervalHours} onValueChange={value => updateForm("displayIntervalHours", value)}>
                  <SelectTrigger><SelectValue placeholder={t("appearanceInterval")} /></SelectTrigger>
                  <SelectContent>
                    {intervalOptions.map(interval => <SelectItem key={interval} value={interval}>{interval === "0" ? t("showEveryFetch") : `${interval} ${t("hours")}`}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>{t("startDate")} ({t("optional")})</Label>
                <Input type="datetime-local" value={form.startAt} onChange={event => updateForm("startAt", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>{t("endDate")} ({t("optional")})</Label>
                <Input type="datetime-local" value={form.endAt} onChange={event => updateForm("endAt", event.target.value)} />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="button" className="min-w-[180px]" disabled={isSubmitting} onClick={handleSubmit}>
            <Save className="h-4 w-4" />
            {isSubmitting ? t("Loading") : t("Save Changes")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
