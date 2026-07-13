
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const ZonesInputs = () => {
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: 'lang', required: true },
    { name: "cityId", type: "selectPaginated", apiUrl: ["cities"], searchFilters: [{ key: "limit", value: 1000 }], cardId: 'lang', width: 3 },
    { name: "coordinates", type: "map-zone", required: true, width: 6 },
    { name: "deliveryPrice", type: "number", cardId: 'lang', width: 3, min: 0 }
  ];
  return inputs;
};
