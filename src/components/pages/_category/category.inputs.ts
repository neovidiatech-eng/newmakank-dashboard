
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const CategoryInputs = (
  { hasStoreId = false }: { hasStoreId?: boolean } = {}
) => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: 'lang', required: true },
    {name:'image',type:'img',cardId:"lang"},
    { name: "moduleId", isHidden: hasStoreId,  cardId: 'lang',type: "selectPaginated", apiUrl: ['modules'] },
    { name: "order", type: "number", required: true }
    
  ];
  return inputs;
};
