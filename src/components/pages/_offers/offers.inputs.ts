import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { booleanOptions } from "@/utils/options/booleanOptions";
import { useTranslations } from "@/lib/i18n";
import { useState } from "react";

export const OffersInputs = ({
  storeId: initialStoreId,
  paidSizeRule,
  freeSizeRule,
  freeValueRule
}: {
  storeId?: number | string | null;
  paidSizeRule?: string;
  freeSizeRule?: string;
  freeValueRule?: string;
}) => {
  const t = useTranslations();
  const [selectedStore, setSelectedStore] = useState<string | number | null>(initialStoreId ?? null);
  const serviceSearchFilters = selectedStore ? [{ key: "storeId", value: Number(selectedStore) }] : [];

  const inputs: FormInput[] = [
    { name: "title", type: "text", multiLang: true, cardId: "lang", required: true },
    { name: "description", type: "textarea", multiLang: true, cardId: "lang", required: true },
    { name: "image", type: "img", cardId: "basic", width: 12, required: true },
    {
      name: "storeId",
      type: "selectPaginated",
      onChange: value => setSelectedStore(value as string),
      apiUrl: ["stores"],
      cardId: "basic",
      width: 6,
      required: true
    },
    { name: "isActive", label: "Status", type: "radioGroup", options: booleanOptions(t), cardId: "basic", width: 6 },
    { name: "requiredPaidQuantity", label: "requiredPaidQuantity", type: "number", cardId: "basic", width: 6, required: true, min: 1 },
    { name: "freeQuantity", label: "freeQuantity", type: "number", cardId: "basic", width: 6, required: true, min: 1 },

    // Paid Section Associations
    {
      name: "paidServiceIds",
      label: "paidServiceIds",
      type: "selectPaginated",
      isMulti: true,
      apiUrl: ["services"],
      searchFilters: serviceSearchFilters,
      cardId: "associations",
      width: 6,
      toolTip: t("paidServiceIdsTooltip")
    },
    {
      name: "paidCategoryIds",
      label: "paidCategoryIds",
      type: "selectPaginated",
      isMulti: true,
      apiUrl: ["storeCategories"],
      searchFilters: serviceSearchFilters,
      cardId: "associations",
      width: 6,
      toolTip: t("paidCategoryIdsTooltip")
    },

    // Free Section Associations
    {
      name: "freeServiceIds",
      label: "freeServiceIds",
      type: "selectPaginated",
      isMulti: true,
      apiUrl: ["services"],
      searchFilters: serviceSearchFilters,
      cardId: "associations",
      width: 6,
      toolTip: t("freeServiceIdsTooltip")
    },
    {
      name: "freeCategoryIds",
      label: "freeCategoryIds",
      type: "selectPaginated",
      isMulti: true,
      apiUrl: ["storeCategories"],
      searchFilters: serviceSearchFilters,
      cardId: "associations",
      width: 6,
      toolTip: t("freeCategoryIdsTooltip")
    },

    // Size Settings (Paid)
    {
      name: "paidSizeRule",
      label: "paidSizeRule",
      type: "select",
      options: [
        { label: t("sizeRuleAny", "أي مقاس (مرونة كاملة)"), value: "ANY" },
        { label: t("sizeRuleName", "مقاس معيّن بالاسم (تحديد مقاس بالاسم)"), value: "NAME" }
      ],
      cardId: "rules",
      width: 6,
      toolTip: t("paidSizeRuleTooltip")
    },
    {
      name: "paidRequiredSizeName",
      label: "paidRequiredSizeName",
      type: "text",
      cardId: "rules",
      width: 6,
      isHidden: paidSizeRule !== "NAME"
    },

    // Size Settings (Free)
    {
      name: "freeSizeRule",
      label: "freeSizeRule",
      type: "select",
      options: [
        { label: t("sizeRuleAny", "أي مقاس (مرونة كاملة)"), value: "ANY" },
        { label: t("sizeRuleName", "مقاس معيّن بالاسم (تحديد مقاس بالاسم)"), value: "NAME" }
      ],
      cardId: "rules",
      width: 6,
      toolTip: t("freeSizeRuleTooltip")
    },
    {
      name: "freeRequiredSizeName",
      label: "freeRequiredSizeName",
      type: "text",
      cardId: "rules",
      width: 6,
      isHidden: freeSizeRule !== "NAME"
    },

    // Free Value CAP Rule
    {
      name: "freeValueRule",
      label: "freeValueRule",
      type: "select",
      options: [
        { label: t("freeValueCapToCheapestPaid", "سعر الهدية لا يتعدى أرخص قطعة مدفوعة (الافتراضي)"), value: "CAP_TO_CHEAPEST_PAID" },
        { label: t("freeValueNoCap", "بدون حد أقصى لقيمة الهدية"), value: "NO_CAP" },
        { label: t("freeValueMaxFreeValue", "سقف سعر ثابت محدد للهدية"), value: "MAX_FREE_VALUE" }
      ],
      cardId: "rules",
      width: 6,
      toolTip: t("freeValueRuleTooltip")
    },
    {
      name: "maxFreeItemValue",
      label: "maxFreeItemValue",
      type: "number",
      cardId: "rules",
      width: 6,
      isHidden: freeValueRule !== "MAX_FREE_VALUE",
      min: 0
    },

    { name: "startDate", type: "date", cardId: "associations", width: 3 },
    { name: "endDate", type: "date", cardId: "associations", width: 3 }
  ];
  return inputs;
};
