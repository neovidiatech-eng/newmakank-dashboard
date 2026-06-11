
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const AllPermissionsInputs = () => {
  const inputs: FormInput[] = [
    { name: "nameAr", type: "text", required: true },
    { name: "nameEn", type: "text", required: true }
  ];
  return inputs;
};
