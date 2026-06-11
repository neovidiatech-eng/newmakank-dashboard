
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const BankAccountsInputs = () => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: 'lang', required: true },
    { name: "bankId", type: "selectPaginated", apiUrl: ["banks"] },
    { name: "phone", type: "tel", required: true },
    { name: "ibn", type: "text", required: true }
  ];
  return inputs;
};
