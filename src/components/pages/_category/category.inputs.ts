
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { booleanOptions } from "@/utils/options/booleanOptions";

export const CategoryInputs = (
  { hasStoreId = false, isEdit = false, t }: { hasStoreId?: boolean; isEdit?: boolean; t: any }
) => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: 'lang', required: true },
    { name: 'image', type: 'img', cardId: "lang" },
    {
      name: "templateId",
      type: "selectPaginated",
      apiUrl: ["storeTemplates"],
      cardId: "lang",
      required: !hasStoreId && !isEdit,
      // Show for template categories (hasStoreId = false), hide for custom store categories
      isHidden: hasStoreId,
    },
    { name: "order", type: "number", required: true, cardId: "lang" },
    ...(isEdit ? [
      { name: "active", type: "radioGroup" as const, cardId: "lang", required: true, width: 6, options: booleanOptions(t) }
    ] : [])
  ];
  return inputs;
};
