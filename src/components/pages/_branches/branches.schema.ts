
  import { z } from "zod";
  
  
  import { StringReq } from "@/validations/String.schema";
  
  
  import { selectNotReq } from "@/validations/Select.schema";
import { noSchema } from "@/validations/String.schema";
  export const BranchesSchema = (t:TFunction) => {
    return z.object({
    storeId:selectNotReq(),
nameAr:StringReq(t), nameEn:StringReq(t),
phone:noSchema(),
address:noSchema(),
map:z.object({
  lat: z.number(),
  lng: z.number(),
}),
isActive:noSchema()
})
  };

  export type BranchesType = z.infer<
	ReturnType<typeof BranchesSchema>
  >;
  
  