
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const CategoryInputs = (
  { hasStoreId = false, isEdit = false }: { hasStoreId?: boolean; isEdit?: boolean } = {}
) => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: 'lang', required: true },
    { name: 'image', type: 'img', cardId: "lang" },
    {
      name: "templateId",
      type: "selectPaginated",
      apiUrl: ["storeTemplates"],
      cardId: "lang",
      required: !hasStoreId,
      isHidden: hasStoreId
    },
    { name: "order", type: "number", required: true }
  ];
  return inputs;
};
