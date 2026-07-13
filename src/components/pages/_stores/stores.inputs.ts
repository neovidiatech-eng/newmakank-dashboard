
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const StoresInputs = ({ isEdit }: {
  isEdit: boolean
}) => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: 'lang', required: true, width: 6 },
    { name: "templateId", type: "selectPaginated", apiUrl: ['storeTemplates'], cardId: 'info', required: true, width: 3 },
    { name: "logo", type: "img", cardId: 'info', width: 3 },
    { name: "cover", type: "img", cardId: 'info', width: 3 },
    { name: "storeOrder", type: "number", cardId: 'info', width: 3, min: 0 },
    {
      name: 'map',
      type: 'map',
      width: 6,
      cardId: 'location',
    },
    { name: "address", type: "text", cardId: 'location', required: true, width: 6 },
    { name: "UserName", type: "text", cardId: 'user', required: true, width: 6 },
    { name: "userEmail", type: "email", cardId: 'user', required: true, width: 6 },
    { name: "userPhone", type: "tel", cardId: 'user', required: true, width: 3 },
    { name: "userPass", type: "password", cardId: 'user', required: !isEdit, width: 3 }
  ];
  return inputs;
};
