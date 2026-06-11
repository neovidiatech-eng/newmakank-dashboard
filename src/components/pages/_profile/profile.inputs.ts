import { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const ProfileInputs = () => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", width: 6 },
    { name: "email", type: "email", width: 6 },
    { name: "phone", type: "tel", width: 6 },
    {
      name:'image',
      type:'img',
      width:6,
    }
  ];
  return inputs;
};
