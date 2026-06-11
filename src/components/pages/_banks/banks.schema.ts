
  import { z } from "zod";
  
  
  import { StringReq } from "@/validations/String.schema";
  
  
  
  
  export const BanksSchema = (t:TFunction) => {
    return z.object({
    nameAr:StringReq(t), nameEn:StringReq(t)
})
  };

  export type BanksType = z.infer<
	ReturnType<typeof BanksSchema>
  >;
  
  