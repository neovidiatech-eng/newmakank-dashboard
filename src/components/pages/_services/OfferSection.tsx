import SelectPaginated from "@/components/common/Inputs/select/SelectPaginatedInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { endpointType } from "@/utils/endpoints";
import { Gift } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { useMemo } from "react";

export interface OfferSectionValue {
  isOffer: boolean;
  requiredPaidQuantity: string;
  freeQuantity: string;
  freeServiceIds: string[];
  startDate: string;
  endDate: string;
}

export const EMPTY_OFFER_VALUE: OfferSectionValue = {
  isOffer: false,
  requiredPaidQuantity: "2",
  freeQuantity: "1",
  freeServiceIds: [],
  startDate: "",
  endDate: ""
};

// Embedded "buy X get Y free" offer editor — shown inside the product create/edit form
// (and reused standalone on the Offers list's edit page). Deliberately exposes only the
// handful of fields a store owner actually needs to fill in; title/description/image are
// auto-generated from the linked product, and the backend's own defaults are used for the
// size/value-cap rules (paidSizeRule, freeValueRule, ...) instead of surfacing them here.
export default function OfferSection({
  value,
  onChange,
  storeId,
  disabled
}: {
  value: OfferSectionValue;
  onChange: (next: OfferSectionValue) => void;
  storeId?: number | string;
  disabled?: boolean;
}) {
  const t = useTranslations();
  const servicesApiUrl = useMemo<endpointType>(() => ["services"], []);
  const serviceSearchFilters = useMemo(
    () => (storeId ? [{ key: "storeId", value: storeId }] : []),
    [storeId]
  );

  const update = <K extends keyof OfferSectionValue>(key: K, val: OfferSectionValue[K]) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{t("isOffer")}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{t("isOfferDescription")}</p>
          </div>
        </div>
        <Switch
          checked={value.isOffer}
          disabled={disabled}
          onCheckedChange={checked => update("isOffer", checked)}
        />
      </div>

      {value.isOffer && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label>{t("requiredPaidQuantity")}</Label>
            <Input
              type="number"
              min={1}
              value={value.requiredPaidQuantity}
              onChange={event => update("requiredPaidQuantity", event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>{t("freeQuantity")}</Label>
            <Input
              type="number"
              min={1}
              value={value.freeQuantity}
              onChange={event => update("freeQuantity", event.target.value)}
            />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label>{t("freeServiceIds")}</Label>
            <SelectPaginated
              isMulti
              name="freeServiceIds"
              apiUrl={servicesApiUrl}
              searchFilters={serviceSearchFilters}
              value={value.freeServiceIds}
              onChange={val => {
                const ids = Array.isArray(val)
                  ? val.map((item: any) => String(item?.value ?? item))
                  : [];
                update("freeServiceIds", ids);
              }}
              placeholder={t("freeServiceIds")}
            />
          </div>
          <div className="grid gap-2">
            <Label>{t("startDate")} ({t("optional")})</Label>
            <Input
              type="date"
              value={value.startDate}
              onChange={event => update("startDate", event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>{t("endDate")} ({t("optional")})</Label>
            <Input
              type="date"
              value={value.endDate}
              onChange={event => update("endDate", event.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
