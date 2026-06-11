import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { daysOptions } from "@/utils/options/typesOptions";
import { useTranslations } from "@/lib/i18n";

export const DeliveryScheduleInputs = () => {
  const t = useTranslations();

  const inputs: FormInput[] = [
    { name: "deliveryId", type: "number", isHidden: true },
    {
      name: "days",
      type: "checkbox",
      required: true,
      options: daysOptions(t),
      cardId: "schedule"
    },
    {
      name: "openingTime",
      type: "hh-mm",
      required: true,
      cardId: "schedule",
      width: 3
    },
    {
      name: "closingTime",
      type: "hh-mm",
      required: true,
      cardId: "schedule",
      width: 3
    },
    {
      name: "is24Hours",
      type: "checkbox",
      label: "",
      options: [{ label: "Works 24 Hours", value: "true" }],
      cardId: "schedule",
      width: 6,
    },
    {
      name: "requiredRadius",
      type: "number",
      label: "Required Radius",
      required: true,
      cardId: "schedule"
    },
    {
      name: "map",
      type: "map",
      label: "Required Location",
      required: true,
      width: 6,
      cardId: "location"
    }
  ];

  return inputs;
};
