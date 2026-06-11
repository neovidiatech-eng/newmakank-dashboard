
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { KeyValueFormType } from "./keyValue.schema";

export const KeyValueInputs = ({
  type
}:{
  type :KeyValueFormType
}) => {
  const inputs: FormInput[] = [
    { name: "valueAr",isHidden : type !=='text', type: "textEditor", required: true },
    { name: "valueEn",isHidden : type !=='text', type: "textEditor", required: true },
    { name: "file",isHidden : type !=='file', type: "file" },
    { name: "key", type: "text", isHidden:true },
  ];
  return inputs;
};
