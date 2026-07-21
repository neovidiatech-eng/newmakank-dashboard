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
    { name: "isActive", label: t("isActiveLabel", "الحالة"), type: "radioGroup", options: booleanOptions(t), cardId: "basic", width: 6 },
    { name: "requiredPaidQuantity", label: t("requiredPaidQuantityLabel", "عدد القطع المدفوعة المطلوبة"), type: "number", cardId: "basic", width: 6, required: true, min: 1 },
    { name: "freeQuantity", label: t("freeQuantityLabel", "عدد القطع الهدية المجانية"), type: "number", cardId: "basic", width: 6, required: true, min: 1 },

    // Paid Section Associations
    {
      name: "paidServiceIds",
      label: t("paidServiceIdsLabel", "المنتجات المتاحة للشراء في العرض"),
      type: "selectPaginated",
      isMulti: true,
      apiUrl: ["services"],
      searchFilters: serviceSearchFilters,
      cardId: "associations",
      width: 6,
      required: true,
      toolTip: t("paidServiceIdsTooltip", "حدد المنتجات التي يجب على العملاء شراؤها لتفعيل العرض")
    },

    // Free Section Associations
    {
      name: "freeServiceIds",
      label: t("freeServiceIdsLabel", "المنتجات المتاحة كهدية مجانية"),
      type: "selectPaginated",
      isMulti: true,
      apiUrl: ["services"],
      searchFilters: serviceSearchFilters,
      cardId: "associations",
      width: 6,
      required: true,
      toolTip: t("freeServiceIdsTooltip", "حدد المنتجات التي يمكن للعملاء اختيارها كهدية")
    },

    // Pricing Mode (Dynamic vs Fixed Price) - Placed at the very top of Rules
    {
      name: "pricingMode",
      label: t("pricingModeLabel", "طريقة تسعير العرض (تلقائي أم بسعر ثابت)"),
      type: "select",
      options: [
        { label: t("pricingModeDynamic", "تلقائي (يحسب السعر تلقائياً من المنيو بالقطع المدفوعة)"), value: "DYNAMIC" },
        { label: t("pricingModeFixed", "سعر عرض ثابت مخصص (تحديد سعر مالي محدد للعرض)"), value: "FIXED" }
      ],
      cardId: "rules",
      width: 12,
      toolTip: t("pricingModeTooltip", "اختر ما إذا كان العرض يحسب السعر تلقائياً من المنيو أم بسعر ثابت مخصص")
    },
    {
      name: "priceBeforeDiscount",
      label: t("priceBeforeDiscountLabel", "السعر قبل الخصم (اختياري)"),
      type: "number",
      cardId: "rules",
      width: 6,
      isHidden: pricingMode !== "FIXED",
      min: 0
    },
    {
      name: "priceAfterDiscount",
      label: t("priceAfterDiscountLabel", "السعر بعد الخصم (سعر العرض الثابت النهائي)"),
      type: "number",
      cardId: "rules",
      width: 6,
      isHidden: pricingMode !== "FIXED",
      min: 0,
      required: pricingMode === "FIXED"
    },

    // Size Settings (Paid)
    {
      name: "paidSizeRule",
      label: t("paidSizeRuleLabel", "تقييد مقاس القطع المدفوعة"),
      type: "select",
      options: [
        { label: t("sizeRuleAny", "أي مقاس (مرونة كاملة)"), value: "ANY" },
        { label: t("sizeRuleName", "مقاس معيّن بالاسم (تحديد مقاس بالاسم)"), value: "NAME" }
      ],
      cardId: "rules",
      width: 6,
      toolTip: t("paidSizeRuleTooltip", "حدد ما إذا كان ينطبق العرض على أي مقاس أم مقاس محدد")
    },
    {
      name: "paidRequiredSizeName",
      label: t("paidRequiredSizeNameLabel", "اسم المقاس المطلوب للقطع المدفوعة"),
      type: "text",
      cardId: "rules",
      width: 6,
      isHidden: paidSizeRule !== "NAME"
    },

    // Size Settings (Free)
    {
      name: "freeSizeRule",
      label: t("freeSizeRuleLabel", "تقييد مقاس القطع الهدية"),
      type: "select",
      options: [
        { label: t("sizeRuleAny", "أي مقاس (مرونة كاملة)"), value: "ANY" },
        { label: t("sizeRuleName", "مقاس معيّن بالاسم (تحديد مقاس بالاسم)"), value: "NAME" }
      ],
      cardId: "rules",
      width: 6,
      toolTip: t("freeSizeRuleTooltip", "حدد ما إذا كان ينطبق العرض على أي مقاس أم مقاس محدد للهدية")
    },
    {
      name: "freeRequiredSizeName",
      label: t("freeRequiredSizeNameLabel", "اسم المقاس المطلوب للقطع الهدية"),
      type: "text",
      cardId: "rules",
      width: 6,
      isHidden: freeSizeRule !== "NAME"
    },

    // Free Value CAP Rule
    {
      name: "freeValueRule",
      label: t("freeValueRuleLabel", "حد قيمة القطعة الهدية"),
      type: "select",
      options: [
        { label: t("freeValueCapToCheapestPaid", "سعر الهدية لا يتعدى أرخص قطعة مدفوعة (الافتراضي)"), value: "CAP_TO_CHEAPEST_PAID" },
        { label: t("freeValueNoCap", "بدون حد أقصى لقيمة الهدية"), value: "NO_CAP" },
        { label: t("freeValueMaxFreeValue", "سقف سعر ثابت محدد للهدية"), value: "MAX_FREE_VALUE" }
      ],
      cardId: "rules",
      width: 6,
      toolTip: t("freeValueRuleTooltip", "حدد شرط سقف القيمة للقطعة المجانية الهدية")
    },
    {
      name: "maxFreeItemValue",
      label: t("maxFreeItemValueLabel", "سقف سعر القطعة الهدية (جنيه)"),
      type: "number",
      cardId: "rules",
      width: 6,
      isHidden: freeValueRule !== "MAX_FREE_VALUE",
      min: 0
    },

    { name: "startDate", label: t("startDateLabel", "تاريخ بداية العرض"), type: "date", cardId: "associations", width: 3 },
    { name: "endDate", label: t("endDateLabel", "تاريخ نهاية العرض"), type: "date", cardId: "associations", width: 3 }
  ];
  return inputs;
};
