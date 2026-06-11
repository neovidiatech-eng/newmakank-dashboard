
import { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const LanguagesInputs = () => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", required: true },
    { name: "key", type: "text", required: true },
    { name: "file", type: "file", required: true }
  ];
  return inputs;
};
