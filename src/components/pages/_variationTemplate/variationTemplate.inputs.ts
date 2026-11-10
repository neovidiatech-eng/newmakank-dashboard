
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const VariationTemplateInputs = () => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: 'lang', required: true },
    {
      name: "values",
      type: "checkbox",
      cardId: 'lang',
      required: true,
      options: [
        { label: "addons", value: "addons" },
        { label: "sizes", value: "sizes" },
        // Usable as an option inside a product's choice group.
        { label: "choices", value: "choices" }
      ]
    }
  ];
  return inputs;
};
