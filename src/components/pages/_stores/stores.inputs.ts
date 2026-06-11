
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const StoresInputs = ({isEdit}:{
  isEdit: boolean
}) => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: 'lang', required: true, width: 6 },
    { name: "moduleId", type: "selectPaginated", apiUrl: ['modules'], cardId: 'info', required: true, width: 3 },
    { name: "categoryId", type: "selectPaginated",required: true,isMulti:true, cardId: 'info', apiUrl: ['categories'] }
    ,
    { name: "logo", type: "img", cardId: 'info',width: 3 },
    { name: "cover", type: "img", cardId: 'info',width: 3 },
    {
      name: 'map',
      type: 'map',
      width: 6,
      cardId: 'location',
    },
    { name: "address", type: "text", cardId: 'location', required: true, width: 6 },
    { name: "UserName", type: "text", cardId: 'user', required: true,isHidden:isEdit, width: 6 },
    { name: "userEmail", type: "email", cardId: 'user', required: true,isHidden:isEdit, width: 6 },
    { name: "userPhone", type: "tel", cardId: 'user', required: true,isHidden:isEdit, width: 3 },
    { name: "userPass", type: "password", cardId: 'user', required: true,isHidden:isEdit, width: 3 }
  ];
  return inputs;
};
