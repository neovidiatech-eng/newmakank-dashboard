
  import { z } from "zod";
  
  
  import { StringReq } from "@/validations/String.schema";
  
  import { PriceSchema } from "@/validations/Number.schema";
  
  import { noSchema } from "@/validations/String.schema";
import { ImageFileSchema } from "@/validations/file.schema";
  export const ModulesSchema = (t:TFunction) => {
    return z.object({
    nameAr:StringReq(t),
    nameEn:StringReq(t),
descriptionAr:StringReq(t),
descriptionEn:StringReq(t),
image:ImageFileSchema({ t }),
color:noSchema(),
order:PriceSchema(t,0)
})
  };

  export type ModulesType = z.infer<
	ReturnType<typeof ModulesSchema>
  >;
  
  
