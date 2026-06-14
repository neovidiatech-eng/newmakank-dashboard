
  import { z } from "zod";
  
  
  import { StringReq } from "@/validations/String.schema";
  
  import { PriceSchema } from "@/validations/Number.schema";
import { noSchema } from "@/validations/String.schema";
  export const CouponsSchema = (t:TFunction) => {
    return z.object({
    titleAr:StringReq(t), titleEn:StringReq(t),
code:StringReq(t),
type:noSchema(),
discountType:noSchema(),
discountValue:PriceSchema(t,0),
maxUsage:PriceSchema(t,0),
startDate:noSchema(),
endDate:noSchema(),
minDiscountValue:PriceSchema(t,0),
minOrderAmount:PriceSchema(t,0),
maxDiscountValue:PriceSchema(t,0),
userIds:noSchema(),
storeIds:noSchema(),
zoneIds:noSchema(),
moduleIds:noSchema(),
specialDelivery:noSchema()
})
  };

  export type CouponsType = z.infer<
	ReturnType<typeof CouponsSchema>
  >;
  
  
