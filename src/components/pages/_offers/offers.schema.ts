import { z } from "zod";

import { SelectReq } from "@/validations/Select.schema";
import { PriceSchema } from "@/validations/Number.schema";
import { StringReq, noSchema } from "@/validations/String.schema";

export const OffersSchema = (t: TFunction) => {
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
    paidServiceIds: z.array(z.union([z.string(), z.number()])).min(1, t("Validations.required")),
    freeServiceIds: z.array(z.union([z.string(), z.number()])).min(1, t("Validations.required")),
    startDate: noSchema(),
    endDate: noSchema()
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
