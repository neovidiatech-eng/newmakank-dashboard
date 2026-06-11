
  import { z } from "zod";
  
  
  import { StringReq } from "@/validations/String.schema";
  
  
  import { selectNotReq } from "@/validations/Select.schema";
import { noSchema } from "@/validations/String.schema";
  export const BannersSchema = (t:TFunction) => {
    return z.object({
    nameAr:StringReq(t),
    nameEn:StringReq(t),
storeId:selectNotReq(),
targetType:noSchema(),
categoryId:selectNotReq(),
serviceId:selectNotReq(),
zoneIds:noSchema(),
specialDelivery:noSchema(),
startDate:noSchema(),
endDate:noSchema(),
order:noSchema(),
image:noSchema()
})
  };

  export type BannersType = z.infer<
	ReturnType<typeof BannersSchema>
  >;
  
  
