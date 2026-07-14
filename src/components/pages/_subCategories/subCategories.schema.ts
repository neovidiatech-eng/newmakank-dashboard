
import { z } from "zod";

import { noSchema, StringReq } from "@/validations/String.schema";

export const SubCategoriesSchema = (t: TFunction) => {
  return z.object({
    nameAr: StringReq(t),
    nameEn: StringReq(t),
    storeId: noSchema(),
    order: noSchema(),
    image: z
      .any()
      .optional()
      .nullable()
  });
};

export type SubCategoriesType = z.infer<
  ReturnType<typeof SubCategoriesSchema>
>;