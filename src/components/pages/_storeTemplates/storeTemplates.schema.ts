import { z } from "zod";
import { noSchema, StringReq, StringNotReq } from "@/validations/String.schema";

const SizeSchema = (t: TFunction) => z.object({
  nameAr: StringReq(t),
  nameEn: StringReq(t),
  price: z.coerce.number().min(0, { message: t("Required") }),
  isDefault: z.boolean().optional().default(false)
});

const AddonSchema = (t: TFunction) => z.object({
  nameAr: StringReq(t),
  nameEn: StringReq(t),
  price: z.coerce.number().min(0, { message: t("Required") })
});

const ServiceSchema = (t: TFunction) => z.object({
  nameAr: StringReq(t),
  nameEn: StringReq(t),
  descriptionAr: StringNotReq(),
  descriptionEn: StringNotReq(),
  image: noSchema(),
  durationMinutes: z.coerce.number().optional(),
  price: z.coerce.number().optional(),
  available: z.boolean().optional(),
  sizes: z.array(SizeSchema(t)).min(1, { message: t("At least one size is required") }),
  addons: z.array(AddonSchema(t)).optional()
});

const CategorySchema = (t: TFunction) => z.object({
  nameAr: StringReq(t),
  nameEn: StringReq(t),
  order: z.coerce.number().optional(),
  services: z.array(ServiceSchema(t)).optional()
});

export const StoreTemplatesSchema = (t: TFunction) => {
  return z.object({
    nameAr: StringReq(t),
    nameEn: StringReq(t),
    descriptionAr: StringReq(t),
    descriptionEn: StringReq(t),
    moduleType: noSchema(),
    order: noSchema(),
    active: noSchema(),
    categories: z.array(CategorySchema(t)).optional()
  });
};

export type StoreTemplatesType = z.infer<ReturnType<typeof StoreTemplatesSchema>>;
