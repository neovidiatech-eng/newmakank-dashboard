import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const StoreTemplatesInputs = () => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: "info", required: true, width: 6 },
    { name: "description", type: "text", multiLang: true, cardId: "info", required: true, width: 6 },
    { 
      name: "moduleType", 
      type: "select", 
      cardId: "info", 
      width: 3,
      options: [
        { label: "GROCERY", value: "GROCERY" },
        { label: "PHARMACY", value: "PHARMACY" },
        { label: "RESTAURANT", value: "RESTAURANT" },
        { label: "MARKET", value: "MARKET" }
      ]
    },
    { name: "order", type: "number", cardId: "info", required: true, width: 3 },
    { name: "active", type: "checkbox", cardId: "info", width: 6, defaultValue: "true" }
  ];
  return inputs;
};
