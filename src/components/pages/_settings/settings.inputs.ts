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

// New delivery/custom-delivery numeric settings introduced alongside the geofence &
// independent custom-delivery pricing backend changes — same min-value convention as
// the existing shippingKMCharge special case below.
const MIN_ZERO_SETTINGS = [
  "pickupGeofenceRadiusMeters",
  "deliveryGeofenceRadiusMeters",
  "customDeliveryKMCharge",
  "customDeliveryBaseFee",
  "customDeliveryExtraStopPrice",
  "customDeliveryCommissionRate",
  "deliveryAcceptanceTimer",
  "deliveryAfkBreakMinutes",
  "driverAssignmentDelaySeconds",
  "onlineDeliveryBaseFee",
  "onlineDeliveryCommission",
  "packagingFee"
];

// Groups settings that are easy to confuse with each other into separate, clearly
// titled boxes (see settingsForm.page.tsx for the box titles/descriptions). Any
// setting key not listed here keeps the old generic "settings" bucket, so unknown
// future backend settings never silently disappear.
const SETTING_GROUPS: Record<string, string> = {
  // Normal in-app restaurant order delivery pricing.
  shippingKMCharge: "restaurant_delivery",
  deliveryCommission: "restaurant_delivery",
  pickupEnabled: "restaurant_delivery",
  // Independent "custom delivery" (courier-only, no restaurant involved) pricing —
  // covers both the PURCHASE/RESTAURANT kinds.
  customDeliveryEnabled: "custom_delivery",
  customDeliveryKMCharge: "custom_delivery",
  customDeliveryBaseFee: "custom_delivery",
  customDeliveryExtraStopPrice: "custom_delivery",
  customDeliveryCommissionForAll: "custom_delivery",
  customDeliveryCommissionRate: "custom_delivery",
  customDeliveryCommissionType: "custom_delivery",
  // Online delivery (multi-recipient batch) — separate on/off switch and pricing from
  // the custom-delivery (Purchase/Restaurant) settings above.
  onlineDeliveryEnabled: "online_delivery",
  onlineDeliveryBaseFee: "online_delivery",
  onlineDeliveryCommission: "online_delivery",
  packagingFee: "online_delivery",
  onlineDeliveryPackagingEnabled: "online_delivery",
  // Pickup/delivery geofence radii.
  pickupGeofenceRadiusMeters: "geofence",
  deliveryGeofenceRadiusMeters: "geofence",
  // Driver assignment behavior.
  deliveryAssignmentMode: "driver_assignment",
  driverAssignmentDelaySeconds: "driver_assignment",
  deliveryAcceptanceTimer: "driver_assignment",
  deliveryAfkBreakEnabled: "driver_assignment",
  deliveryAfkBreakMinutes: "driver_assignment"
};

const SettingsInputs = ({
  settings,
  t
}: {
  settings: SettingsItem[];
  t: (key: string) => string;
}): FormInput[] => {
  return settings
    .map(item => {
      const descKey = `${item.setting}Description`;
      const descVal = t(descKey);
      const toolTip = descVal !== descKey ? descVal : undefined;

      return {
        name: item.setting,
        label: t(item.setting),
        type: resolveInputType(item),
        options: item.dataType =='BOOLEAN' ? booleanOptions(t)  : item?.enumValues?.map(value => ({ label: t(value), value })) ?? undefined,
        cardId: SETTING_GROUPS[item.setting] ?? "settings",
        width: resolveInputWidth(item),
        toolTip,
        ...(item.setting === "shippingKMCharge" ? { min: 0.000001 } : {}),
        ...(MIN_ZERO_SETTINGS.includes(item.setting) ? { min: 0 } : {})
      };
    });
};

export { SettingsInputs };
