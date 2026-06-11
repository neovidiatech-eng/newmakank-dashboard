
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const ModulesInputs = () => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", required: true,multiLang: true, cardId: 'lang', },
    { name: "description", type: "textarea", multiLang: true, cardId: 'lang', required: true },
    { name: "image", type: "img", required: true },
    { name: "color", type: "color", required: true, },
    { name: "order", type: "number", required: true }
  ];
  return inputs;
};
