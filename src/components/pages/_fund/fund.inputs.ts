
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const FundInputs = () => {
  const inputs: FormInput[] = [
    { name: "customerId", type: "selectPaginated", apiUrl: ['customers'], required: true, options: [] },
    { name: "price", type: "number", required: true }
  ];
  return inputs;
};
