
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { CouponDiscountTypeOptions, CouponTypesOPtions } from "@/utils/options/typesOptions";
import { useTranslations } from "@/lib/i18n";

type CouponType =
  | "ALL_USERS"
  | "ALL_STORES"
  | "FIRST_ORDER"
  | "USER_WISE"
  | "STORE_WISE"
  | "ALL_MODULES"
  | "MODULE_WISE"
  | "ZONE_WISE"
  | "ALL_CUSTOMER_CATEGORIES"
  | "CUSTOMER_CATEGORY_WISE";

export const CouponsInputs = (couponType?: CouponType | null) => {
  const t = useTranslations()
  const showUserRestrictions = couponType === "USER_WISE";
  const showStoreRestrictions = couponType === "STORE_WISE";
  const showModuleRestrictions = couponType === "MODULE_WISE";
  const showZoneRestrictions = couponType === "ZONE_WISE";
  const showCustomerCategoryRestrictions = couponType === "CUSTOMER_CATEGORY_WISE";

  const inputs: FormInput[] = [
    { name: "title", type: "text", multiLang: true, cardId: 'lang', required: true },
    { name: "code", type: "text", cardId: 'basic', required: true },
    { name: "type", type: "radioGroup",width:6, cardId: 'discount', required: true, options: CouponTypesOPtions(t) },
    { name: "discountType", type: "radioGroup", cardId: 'discount', required: true, options: CouponDiscountTypeOptions(t) },
    { name: "discountValue", type: "number", cardId: 'discount', required: true },
    { name: "minDiscountValue", type: "number", cardId: 'discount', required: true },
    { name: "maxDiscountValue", type: "number", cardId: 'discount', required: true },
    { name: "maxUsage", type: "number", cardId: 'usage', required: true, toolTip: t("maxUsageTooltip") },
    { name: "minOrderAmount", type: "number", cardId: 'usage', required: true, toolTip: t("minOrderAmountTooltip") },
    { name: "startDate", type: "date", cardId: 'dates', required: true },
    { name: "endDate", type: "date", cardId: 'dates', required: true },
    { name: "userIds", isHidden: !showUserRestrictions, type: "selectPaginated", cardId: 'restrictions', apiUrl: ['customers'], isMulti: true },
    { name: "storeIds", isHidden: !showStoreRestrictions, type: "selectPaginated", cardId: 'restrictions', apiUrl: ['stores'], isMulti: true },
    {
      name: "zoneIds",
      type: "selectPaginated",
      cardId: 'restrictions',
      apiUrl: ['zones'],
      isMulti: true,
      toolTip: t("couponZonesTooltip")
    },
    { name: "moduleIds", isHidden: !showModuleRestrictions, type: "selectPaginated", cardId: 'restrictions', apiUrl: ['modules'], isMulti: true },
    { name: "zoneIds", isHidden: !showZoneRestrictions, type: "selectPaginated", cardId: 'restrictions', apiUrl: ['zones'], isMulti: true },
    { name: "customerCategoryIds", isHidden: !showCustomerCategoryRestrictions, type: "selectPaginated", cardId: 'restrictions', apiUrl: ['customerCategories'], isMulti: true },
    {
      name: "specialDelivery",
      type: "checkbox",
      cardId: 'restrictions',
      width: 3,
      label: "",
      inputClassName: "button-checkbox",
      options: [{ label: t("Special Delivery"), value: "true" }]
    }
  ];
  return inputs;
};
