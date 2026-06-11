
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { booleanOptions } from "@/utils/options/booleanOptions";
import { useTranslations } from "@/lib/i18n";

export const BranchesInputs = (
  { hasStoreId = false }: { hasStoreId?: boolean } = {}
) => {
  const t = useTranslations()
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: 'lang', required: true },
    { name: "storeId",isHidden:hasStoreId, type: "selectPaginated", apiUrl: ['stores'] },
    { name: "phone", type: "tel", required: true },
    { name: "address", type: "textarea" },
    { name: "isActive", type: "radioGroup", required: true, options: booleanOptions(t) },
    { name: "map", type: "map", required: true,width:6 },
  ];
  return inputs;
};
