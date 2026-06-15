import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { booleanOptions } from "@/utils/options/booleanOptions";
import type { SettingsItem } from "./settings.types";

const resolveInputType = (item: SettingsItem): FormInput["type"] => {
  if (item.enumValues && item.enumValues.length > 0) {
    return "radioGroup";
  }
  switch (item.dataType) {
    case "TEXTAREA":
      return "textarea";
    case "BOOLEAN":
    case "ENUM":
      return "radioGroup";
    case "FILE":
      return "img";
    case 'NUMBER':
      return "number";
    case "STRING":
    default:
      return "text";
  }
};

const resolveInputWidth = (item: SettingsItem): number => {
  if (item.dataType === "TEXTAREA") return 12;
  if (item.dataType === "FILE") return 12;
  if (item.dataType === "BOOLEAN") return 6;
  return 6;
};

const SettingsInputs = ({
  settings,
  t
}: {
  settings: SettingsItem[];
  t: (key: string) => string;
}): FormInput[] => {
  return settings
    .filter(item => !["StoreTaxRate", "filterByZone", "storeNearestByKM", "StoreTaxForAll"].includes(item.setting))
    .map(item => ({
      name: item.setting,
      label: t(item.setting),
      type: resolveInputType(item),
      options: item.dataType =='BOOLEAN' ? booleanOptions(t)  : item?.enumValues?.map(value => ({ label: t(value), value })) ?? undefined,
      cardId: "settings",
      width: resolveInputWidth(item),
      ...(item.setting === "shippingKMCharge" ? { min: 0.000001 } : {})
    }));
};

export { SettingsInputs };
