
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const DeliveryInputs = ({isEdit}:{
  isEdit:boolean
}) => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email" },
    { name: "phone", type: "tel", required: true },
    { name: "password", type: "password", required: true,isHidden: isEdit },
  ];
  return inputs;
};
