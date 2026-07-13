import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { booleanOptions } from "@/utils/options/booleanOptions";
import { useTranslations } from "@/lib/i18n";
import { useState } from "react";

export const OffersInputs = ({ storeId: initialStoreId }: { storeId?: number | string | null }) => {
  const t = useTranslations();
  const [selectedStore, setSelectedStore] = useState<string | number | null>(initialStoreId ?? null);
  const serviceSearchFilters = selectedStore ? [{ key: "storeId", value: Number(selectedStore) }] : [];

  const inputs: FormInput[] = [
    { name: "title", type: "text", multiLang: true, cardId: "lang", required: true },
    { name: "description", type: "textarea", multiLang: true, cardId: "lang", required: true },
    { name: "image", type: "img", cardId: "basic", width: 12, required: true },
    {
      name: "storeId",
      type: "selectPaginated",
      onChange: value => setSelectedStore(value as string),
      apiUrl: ["stores"],
      cardId: "basic",
      width: 6,
      required: true
    },
    { name: "isActive", label: "Status", type: "radioGroup", options: booleanOptions(t), cardId: "basic", width: 6 },
    { name: "requiredPaidQuantity", label: "requiredPaidQuantity", type: "number", cardId: "basic", width: 6, required: true, min: 1 },
    { name: "freeQuantity", label: "freeQuantity", type: "number", cardId: "basic", width: 6, required: true, min: 1 },
    {
      name: "paidServiceIds",
      label: "paidServiceIds",
      type: "selectPaginated",
      isMulti: true,
      apiUrl: ["services"],
      searchFilters: serviceSearchFilters,
      cardId: "associations",
      width: 6,
      required: true
    },
    {
      name: "freeServiceIds",
      label: "freeServiceIds",
      type: "selectPaginated",
      isMulti: true,
      apiUrl: ["services"],
      searchFilters: serviceSearchFilters,
      cardId: "associations",
      width: 6,
      required: true
    },
    { name: "startDate", type: "date", cardId: "associations", width: 3 },
    { name: "endDate", type: "date", cardId: "associations", width: 3 }
  ];
  return inputs;
};
