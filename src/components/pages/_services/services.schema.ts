
import { z } from "zod";


import { StringReq } from "@/validations/String.schema";

import { PriceSchema } from "@/validations/Number.schema";
import { selectNotReq } from "@/validations/Select.schema";
import { noSchema } from "@/validations/String.schema";
export const ServicesSchema = (t: TFunction) => {
  return z.object({
    nameAr: StringReq(t), nameEn: StringReq(t),
    descriptionAr: StringReq(t),
    descriptionEn: StringReq(t),
    image: noSchema(),
    Store:noSchema(),
    durationMinutes: PriceSchema(t, 0),
    price: noSchema(),
    priceBeforeDiscount: noSchema(),
    priceAfterDiscount: PriceSchema(t, 0),
    status: noSchema(),
    available: noSchema(),
    storeId: selectNotReq(),
    categoryId: selectNotReq(),
    Sizes: z.array(z.object({
      nameAr: StringReq(t),
      nameEn: StringReq(t),
      price: noSchema(),
      priceBeforeDiscount: noSchema(),
      priceAfterDiscount: PriceSchema(t, 0),
      isDefault: noSchema(),
    })).optional(),
    Addons: z.array(z.object({
      nameAr: StringReq(t),
      nameEn: StringReq(t),
      price: noSchema(),
      priceBeforeDiscount: noSchema(),
      priceAfterDiscount: PriceSchema(t, 0),
    })).optional(),
  });
};

export type ServicesType = z.infer<
  ReturnType<typeof ServicesSchema>
>;





interface servicesName {
  ar: string;
  en: string;
}

interface servicesDescription {
  ar: string;
  en: string;
}

interface servicesModule {
  id: number;
  name: string;
}

interface servicesCategory {
  id: number;
  name: string;
}

interface servicesStore {
  id: number;
  name: string;
  cover: string;
  logo: string;
  rating: number;
  review: number;
  address: string;
}

export interface servicesEntity {
  id: number;
  name: servicesName;
  description: servicesDescription;
  image: string;
  durationMinutes: number;
  price: number;
  priceBeforeDiscount?: number;
  priceAfterDiscount?: number;
  status: string;
  totalOrders: number;
  totalAmountSold: number;
  rating: number;
  review: number;
  bestRated: boolean;
  mostSeller: boolean;
  createdAt: string;
  priceWithDefaultOptions: number;
  Module: servicesModule;
  Category: servicesCategory;
  Store: servicesStore;
  Sizes: unknown[];
  Addons: unknown[];
  isFavourite: boolean;
}
