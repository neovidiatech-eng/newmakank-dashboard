
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const BanksInputs = () => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: 'lang', required: true }
  ];
  return inputs;
};
