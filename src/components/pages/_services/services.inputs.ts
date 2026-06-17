
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import { booleanOptions } from "@/utils/options/booleanOptions";
import { servicesStatusOptions } from "@/utils/options/statusTypeOptions";
import { useTranslations } from "@/lib/i18n";
import { useState } from "react";

export const ServicesInputs = ({storeId,hideStore}:{
  storeId?: number;
  hideStore?: boolean;
}) => {
  const t = useTranslations()
  const [selectedStore, setSelectedStore] = useState<string | number | null>(storeId??null);
  const inputs: FormInput[] = [
    { name: "name", type: "text", multiLang: true, cardId: 'lang', required: true },
    { name: "description", type: "textarea", multiLang: true, cardId: 'lang', required: true },
    { name: "image", type: "img", cardId: 'basic',  width: 6 },
    { name: "durationMinutes", type: "select", cardId: 'basic', required: true, width: 3, options:[{
      value:5,
      label:"5"
    },
    {
      value:10,
      label:"10"
    },
    {
      value:15,
      label:"15"
    },
    {
      value:20,
      label:"20"
    },
    {
      value:25,
      label:"25"
    },
    {
      value:30,
      label:"30"
    },
    {
      value:35,
      label:"35"
    },
    {
      value:40,
      label:"40"
    },
    {
      value:45,
      label:"45"
    },
    {
      value:50,
      label:"50"
    },
    {
      value:55,
      label:"55"
    },
    {
      value:60,
      label:"60"
    },
    {
      value:65,
      label:"65"
    },
    {
      value:70,
      label:"70"
    },
    {
      value:75,
      label:"75"
    },
    {
      value:80,
      label:"80"
    },
    {
      value:85,
      label:"85"
    },
    {
      value:90,
      label:"90"
    },
   
  ] },
    { name: "priceBeforeDiscount", type: "number", cardId: 'basic', width: 3 },
    { name: "priceAfterDiscount", type: "number", cardId: 'basic', required: true, width: 3 },
    { name: "status", type: "radioGroup", cardId: 'basic', required: true, width: 6, options:servicesStatusOptions(t) },
    { name: "available", type: "radioGroup", cardId: 'basic', required: true, width: 6, options: booleanOptions(t) },
    { name: "storeId", isHidden: hideStore , type: "selectPaginated",onChange:(value) => setSelectedStore(value as string), cardId: 'associations', apiUrl: ['stores'], width: 6 },
    { name: "categoryId", type: "selectPaginated", cardId: 'associations', apiUrl: ["storeCategories"], searchFilters: selectedStore ? [{ key: "storeId", value: Number(selectedStore) }] : [], width: 6 }
  ];
  return inputs;
};


export const ServicesSizesInputs = () => {
  const t =useTranslations()
  const inputs: FormInput[] = [
    { name: "nameAr", type: "text", required: true },
    { name: "nameEn", type: "text", required: true },
    { name: "priceBeforeDiscount", type: "number" },
    { name: "priceAfterDiscount", type: "number", required: true },
    {name:'isDefault',type:'radioGroup', options:booleanOptions(t)}
  ];
  return inputs;
}

export const ServicesAddonsInputs = () => {
  const inputs: FormInput[] = [
    { name: "nameAr", type: "text", required: true },
    { name: "nameEn", type: "text", required: true },
    { name: "priceBeforeDiscount", type: "number" },
    { name: "priceAfterDiscount", type: "number", required: true },
  ];
  return inputs;
}
