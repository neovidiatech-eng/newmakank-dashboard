
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { daysOptions } from "@/utils/options/typesOptions";
import { useTranslations } from "@/lib/i18n";

export const ScheduleInputs = (
  { branchId, deliveryId }: {
    branchId?: string;
    deliveryId?: string;
  }
) => {
  const t = useTranslations();
  const inputs: FormInput[] = [];

  // when deliveryId is provided we hide branch selection and include deliveryId as a hidden value
  if (deliveryId) {
    inputs.push({ name: "deliveryId", type: "number", isHidden: true });
  }

  inputs.push(
    {
      name: "branchId",
      type: "selectPaginated",
      apiUrl: ['branches'],
      required: true,
      isHidden: !!branchId || !!deliveryId,
      // onChange: onBranchChange
    },
    {
      name: "day",
      type: "radioGroup",
      required: true,
      options:  daysOptions(t)
    },
    { name: "openingTime", type: "hh-mm", required: true, width: 3 },
    { name: "closingTime", type: "hh-mm", required: true, width: 3 },
    {
      name: "is24Hours",
      type: "checkbox",
      label: "",
      options: [{ label: "Works 24 Hours", value: "true" }],
      width: 6,
    }
  );

  return inputs;
};
