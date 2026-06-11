
  import { z } from "zod";
  
  
  import { StringReq } from "@/validations/String.schema";
  
  
  
  
  export const CitiesSchema = (t:TFunction) => {
    return z.object({
    nameAr:StringReq(t), nameEn:StringReq(t)
})
  };

  export type CitiesType = z.infer<
	ReturnType<typeof CitiesSchema>
  >;
  
  