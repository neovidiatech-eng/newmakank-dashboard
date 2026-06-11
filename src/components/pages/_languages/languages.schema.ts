
  import { z } from "zod";
  
  
  import { StringReq } from "@/validations/String.schema";
  
  
  
  import { noSchema } from "@/validations/String.schema"
  export const LanguagesSchema = (t:TFunction) => {
    return z.object({
    name:StringReq(t),
key:StringReq(t),
file:noSchema()
})
  };

  export type LanguagesType = z.infer<
	ReturnType<typeof LanguagesSchema>
  >;
  
  