
  import { z } from "zod";
  
  
  import { StringReq } from "@/validations/String.schema";
  import { selectNotReq } from "@/validations/Select.schema";
  
  
  
    export const ZonesSchema = (t:TFunction) => {
    return z.object({
    nameAr:StringReq(t), nameEn:StringReq(t),
cityId:selectNotReq(),
coordinates:z.array(z.object({ lat: z.number(), lng: z.number() }))
})
  };

  export type ZonesType = z.infer<
	ReturnType<typeof ZonesSchema>
  >;
  
  
