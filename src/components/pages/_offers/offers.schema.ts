import { z } from "zod";

import { SelectReq } from "@/validations/Select.schema";
import { PriceSchema } from "@/validations/Number.schema";
import { StringReq, noSchema } from "@/validations/String.schema";

export const OffersSchema = (t: any) => {
  return z.object({
    titleAr: StringReq(t),
    titleEn: StringReq(t),
    descriptionAr: StringReq(t),
    descriptionEn: StringReq(t),
    image: noSchema(),
    storeId: SelectReq(t),
    isActive: noSchema(),
    requiredPaidQuantity: PriceSchema(t, 1),
    freeQuantity: PriceSchema(t, 1),

    paidServiceIds: z.array(z.union([z.string(), z.number()])).optional().nullable(),
    paidCategoryIds: z.array(z.union([z.string(), z.number()])).optional().nullable(),
    freeServiceIds: z.array(z.union([z.string(), z.number()])).optional().nullable(),
    freeCategoryIds: z.array(z.union([z.string(), z.number()])).optional().nullable(),

    paidSizeRule: z.enum(["ANY", "NAME"]).optional().default("ANY"),
    paidRequiredSizeName: z.string().optional().nullable(),

    freeSizeRule: z.enum(["ANY", "NAME"]).optional().default("ANY"),
    freeRequiredSizeName: z.string().optional().nullable(),

    freeValueRule: z.enum(["CAP_TO_CHEAPEST_PAID", "NO_CAP", "MAX_FREE_VALUE"]).optional().default("CAP_TO_CHEAPEST_PAID"),
    maxFreeItemValue: z.union([z.string(), z.number()]).optional().nullable(),

    startDate: noSchema(),
    endDate: noSchema()
  })
  .refine(data => {
    const hasPaidServices = data.paidServiceIds && data.paidServiceIds.length > 0;
    const hasPaidCategories = data.paidCategoryIds && data.paidCategoryIds.length > 0;
    return hasPaidServices || hasPaidCategories;
  }, {
    message: t("paidServicesOrCategoriesRequired", "يجب تحديد منتج واحد أو فئة واحدة على الأقل للقطع المدفوعة"),
    path: ["paidServiceIds"]
  })
  .refine(data => {
    const hasFreeServices = data.freeServiceIds && data.freeServiceIds.length > 0;
    const hasFreeCategories = data.freeCategoryIds && data.freeCategoryIds.length > 0;
    return hasFreeServices || hasFreeCategories;
  }, {
    message: t("freeServicesOrCategoriesRequired", "يجب تحديد منتج واحد أو فئة واحدة على الأقل للقطع الهدية"),
    path: ["freeServiceIds"]
  })
  .refine(data => {
    if (data.paidSizeRule === "NAME") {
      return !!data.paidRequiredSizeName && data.paidRequiredSizeName.trim().length > 0;
    }
    return true;
  }, {
    message: t("paidRequiredSizeNameRequired", "اسم المقاس المطلوب إجباري عند اختيار التقييد بالاسم"),
    path: ["paidRequiredSizeName"]
  })
  .refine(data => {
    if (data.freeSizeRule === "NAME") {
      return !!data.freeRequiredSizeName && data.freeRequiredSizeName.trim().length > 0;
    }
    return true;
  }, {
    message: t("freeRequiredSizeNameRequired", "اسم المقاس المطلوب إجباري عند اختيار التقييد بالاسم"),
    path: ["freeRequiredSizeName"]
  })
  .refine(data => {
    if (data.freeValueRule === "MAX_FREE_VALUE") {
      return data.maxFreeItemValue !== undefined && data.maxFreeItemValue !== null && String(data.maxFreeItemValue).trim().length > 0;
    }
    return true;
  }, {
    message: t("maxFreeItemValueRequired", "سقف سعر الهدية مطلوب عند اختيار حد أقصى ثابت"),
    path: ["maxFreeItemValue"]
  });
};

export type OffersType = z.infer<ReturnType<typeof OffersSchema>>;

interface offersName {
  ar: string;
  en: string;
}

export interface offersEntity {
  id: number;
  title: offersName;
  description: offersName;
  image: string;
  storeId: number;
  isActive: boolean;
  requiredPaidQuantity: number;
  freeQuantity: number;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
}
