
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
      required: !hasStoreId && !isEdit,
      // Show for template categories (hasStoreId = false), hide for custom store categories
      isHidden: hasStoreId,
      // In edit mode: disable the field — the template assignment cannot be changed
      // (backend does not accept templateId on PATCH /store-templates/categories/:id)
      disabled: isEdit
    },
    { name: "order", type: "number", required: true, cardId: "lang" }
  ];
  return inputs;
};
