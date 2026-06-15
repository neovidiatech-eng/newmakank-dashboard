import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const StoreTemplatesInputs = () => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: "info", required: true, width: 6 },
    { name: "description", type: "text", multiLang: true, cardId: "info", required: true, width: 6 },
    { name: "order", type: "number", cardId: "info", required: true, width: 6 },
    { name: "active", type: "checkbox", cardId: "info", width: 6, defaultValue: "true" }
  ];
  return inputs;
};
