import { z } from "zod";
import { noSchema, StringReq, StringNotReq } from "@/validations/String.schema";

export const CustomerCategoriesSchema = (t: TFunction) => {
  return z.object({
    nameAr: StringReq(t),
    nameEn: StringReq(t),
    image: noSchema(),
    color: StringNotReq(),
    order: noSchema(),
    active: noSchema()
  });
};

export type CustomerCategoriesType = z.infer<ReturnType<typeof CustomerCategoriesSchema>>;
