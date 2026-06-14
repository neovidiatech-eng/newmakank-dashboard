import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const CustomerCategoriesInputs = () => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: "info", required: true, width: 6 },
    { name: "image", type: "img", cardId: "info", required: true, width: 6 },
    { name: "color", type: "color", cardId: "info", width: 6 },
    { name: "order", type: "number", cardId: "info", required: true, width: 6 },
    { name: "active", type: "checkbox", cardId: "info", width: 6, defaultValue: "true" }
  ];
  return inputs;
};
