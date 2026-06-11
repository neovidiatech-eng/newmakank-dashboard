
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const CustomersInputs = () => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "tel", required: true },
    { name: "password", type: "password", required: true }
  ];
  return inputs;
};
