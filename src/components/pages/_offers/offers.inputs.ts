import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { booleanOptions } from "@/utils/options/booleanOptions";
import { useTranslations } from "@/lib/i18n";
import { useState } from "react";

export const OffersInputs = ({
  storeId: initialStoreId,
  paidSizeRule,
  freeSizeRule,
  freeValueRule,
  pricingMode
}: {
  storeId?: number | string | null;
  paidSizeRule?: string;
  freeSizeRule?: string;
  freeValueRule?: string;
  pricingMode?: string;
}) => {
  const t = useTranslations();
  const [selectedStore, setSelectedStore] = useState<string | number | null>(initialStoreId ?? null);
  const serviceSearchFilters = selectedStore ? [{ key: "storeId", value: Number(selectedStore) }] : [];

  const inputs: FormInput[] = [
    // ── اللغة والوصف ──────────────────────────────────────────
    { name: "title", type: "text", multiLang: true, cardId: "lang", required: true },
    { name: "description", type: "textarea", multiLang: true, cardId: "lang", required: true },

    // ── البيانات الأساسية ──────────────────────────────────────
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
    {
      name: "requiredPaidQuantity",
      label: "requiredPaidQuantity",
      type: "number",
      cardId: "basic",
      width: 6,
      required: true,
      min: 1
    },
    {
      name: "freeQuantity",
      label: "freeQuantity",
      type: "number",
      cardId: "basic",
      width: 6,
      required: true,
      min: 1
    },

    // ── المنتجات المرتبطة ──────────────────────────────────────
    {
      name: "paidServiceIds",
      label: "paidServiceIds",
      type: "selectPaginated",
      isMulti: true,
      apiUrl: ["services"],
      searchFilters: serviceSearchFilters,
      cardId: "associations",
      width: 6,
      required: true,
      toolTip: t("paidServiceIdsTooltip")
    },
    {
      name: "freeServiceIds",
      label: "freeServiceIds",
      type: "selectPaginated",
      isMulti: true,
      apiUrl: ["services"],
      searchFilters: serviceSearchFilters,
      cardId: "associations",
      width: 6,
      required: true,
      toolTip: t("freeServiceIdsTooltip")
    },
    { name: "startDate", label: "startDate", type: "date", cardId: "associations", width: 3 },
    { name: "endDate", label: "endDate", type: "date", cardId: "associations", width: 3 },

    // ── طريقة التسعير (أول ما يراه الأدمن في القواعد) ─────────
    {
      name: "pricingMode",
      label: "pricingMode",
      type: "select",
      options: [
        { label: t("pricingModeDynamic"), value: "DYNAMIC" },
        { label: t("pricingModeFixed"), value: "FIXED" }
      ],
      cardId: "rules",
      width: 12,
      toolTip: t("pricingModeTooltip")
    },
    {
      name: "priceBeforeDiscount",
      label: "priceBeforeDiscount",
      type: "number",
      cardId: "rules",
      width: 6,
      isHidden: pricingMode !== "FIXED",
      min: 0
    },
    {
      name: "priceAfterDiscount",
      label: "priceAfterDiscount",
      type: "number",
      cardId: "rules",
      width: 6,
      isHidden: pricingMode !== "FIXED",
      min: 0,
      required: pricingMode === "FIXED"
    },

    // ── تقييد المقاس للقطع المدفوعة ───────────────────────────
    {
      name: "paidSizeRule",
      label: "paidSizeRule",
      type: "select",
      options: [
        { label: t("sizeRuleAny"), value: "ANY" },
        { label: t("sizeRuleName"), value: "NAME" }
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

    // ── تقييد المقاس للهدية ───────────────────────────────────
    {
      name: "freeSizeRule",
      label: "freeSizeRule",
      type: "select",
      options: [
        { label: t("sizeRuleAny"), value: "ANY" },
        { label: t("sizeRuleName"), value: "NAME" }
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

    // ── حد قيمة الهدية ───────────────────────────────────────
    {
      name: "freeValueRule",
      label: "freeValueRule",
      type: "select",
      options: [
        { label: t("freeValueCapToCheapestPaid"), value: "CAP_TO_CHEAPEST_PAID" },
        { label: t("freeValueNoCap"), value: "NO_CAP" },
        { label: t("freeValueMaxFreeValue"), value: "MAX_FREE_VALUE" }
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
    }
  ];
  return inputs;
};
