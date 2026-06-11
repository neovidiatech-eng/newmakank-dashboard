
import { z } from "zod";


import { StringReq } from "@/validations/String.schema";



export const VariationTemplateSchema = (t: TFunction) => {
  return z.object({
    nameAr: StringReq(t), nameEn: StringReq(t),
    values: z.array(z.enum(["addons", "sizes"]))
  })
};

export type VariationTemplateType = z.infer<
  ReturnType<typeof VariationTemplateSchema>
>;

