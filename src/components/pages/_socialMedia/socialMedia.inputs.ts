
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { booleanOptions } from "@/utils/options/booleanOptions";
import { useTranslations } from "@/lib/i18n";

export const SocialMediaInputs = () => {
  const t= useTranslations()
  const inputs: FormInput[] = [
    { name: "platform", type: "text", required: true },
    { name: "isActive", type: "radioGroup", required: true, options: booleanOptions(t) },
    { name: "link", type: "text", required: true ,width: 6},
    { name: "image",width:6, type: "img", required: true },
  ];
  return inputs;
};
