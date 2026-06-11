import { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const EditProfileInputs = () => {
  const inputs: FormInput[] = [
    { cardId: "info", name: "name", type: "text", width: 6 },
    { cardId: "info", name: "email", type: "email", width: 6 },
    { cardId: "info", name: "phone", type: "tel", width: 6 },
    { cardId: "info", name: "image", type: "img", width: 6 }
  ];
  return inputs;
};
