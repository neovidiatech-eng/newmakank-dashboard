
  import { z } from "zod";
  
  
  import { noSchema, StringReq } from "@/validations/String.schema";
  
  
  
  
  export const AllPermissionsSchema = (t:TFunction) => {
    return z.object({
    nameAr:StringReq(t), nameEn:StringReq(t),
    id:noSchema()
})
  };

  export type AllPermissionsType = z.infer<
	ReturnType<typeof AllPermissionsSchema>
  >;
  
  