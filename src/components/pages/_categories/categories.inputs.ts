
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const CategoriesInputs = () => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: 'lang', required: true },
    { name: "image", type: "img", required: true },
    { name: "moduleId", type: "selectPaginated", apiUrl: ['modules'] },
    { name: "storeId", type: "selectPaginated", apiUrl: ['stores'] }
  ];
  return inputs;
};
