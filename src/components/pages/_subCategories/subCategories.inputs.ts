
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const SubCategoriesInputs = () => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", required: true , multiLang: true, cardId: 'lang'},
  ];
  return inputs;
};
