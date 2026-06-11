
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";

export const BannersInputs = ({
  selectedStore,
  selectedTargetType,
  isSpecialDelivery,
  onStoreChange
}: {
  selectedStore?: string | number | null;
  selectedTargetType?: string | null;
  isSpecialDelivery?: boolean;
  onStoreChange?: () => void;
} = {}) => {
  const targetType = isSpecialDelivery ? "SPECIAL_DRIVER" : selectedTargetType || "GENERAL";
  const needsStore = ["STORE", "CATEGORY", "SERVICE", "ZONE"].includes(targetType);
  const needsCategory = ["CATEGORY", "SERVICE"].includes(targetType);
  const needsService = targetType === "SERVICE";
  const needsZones = targetType === "ZONE";

  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang:true, cardId:'lang', required: true },
    {
      name: "targetType",
      type: "select",
      cardId: "targeting",
      width: 3,
      defaultValue: "GENERAL",
      disabled: isSpecialDelivery,
      options: [
        { label: "GENERAL", value: "GENERAL" },
        { label: "STORE", value: "STORE" },
        { label: "CATEGORY", value: "CATEGORY" },
        { label: "SERVICE", value: "SERVICE" },
        { label: "ZONE", value: "ZONE" }
      ]
    },
    {
      name: "storeId",
      type: "selectPaginated",
      apiUrl: ['stores'],
      cardId: 'targeting',
      width: 3,
      disabled: isSpecialDelivery || !needsStore,
      onChange: onStoreChange
    },
    {
      name: "categoryId",
      type: "selectPaginated",
      apiUrl: selectedStore ? ["storeCategories", "store", Number(selectedStore)] : ["storeCategories"],
      cardId: 'targeting',
      width: 3,
      disabled: isSpecialDelivery || !needsCategory || !selectedStore
    },
    {
      name: "serviceId",
      type: "selectPaginated",
      apiUrl: ['services'],
      cardId: 'targeting',
      width: 3,
      disabled: isSpecialDelivery || !needsService || !selectedStore,
      searchFilters: selectedStore ? [{ key: "storeId", value: selectedStore }] : []
    },
    {
      name: "zoneIds",
      type: "selectPaginated",
      apiUrl: selectedStore ? ["banners", "store", Number(selectedStore), "bannerStoreZones"] : ['zones'],
      cardId: 'targeting',
      width: 3,
      isMulti: true,
      disabled: isSpecialDelivery || !needsZones || !selectedStore
    },
    {
      name: "specialDelivery",
      type: "checkbox",
      cardId: 'targeting',
      width: 3,
      label: "",
      inputClassName: "button-checkbox",
      options: [{ label: "Special Delivery", value: "true" }]
    },
    { name: "image", type: "img", required: true, cardId: 'media', width: 3 },
    { name: "order", type: "number", cardId: 'media', width: 3 },
    { name: "startDate", type: "time", cardId: 'media', width: 3 },
    { name: "endDate", type: "time", cardId: 'media', width: 3 }
  ];
  return inputs;
};
