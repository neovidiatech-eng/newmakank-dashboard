
  import { z } from "zod";
  
  
  import { StringReq } from "@/validations/String.schema";
  
  
  import { selectNotReq } from "@/validations/Select.schema";
  import { noSchema } from "@/validations/String.schema"
  export const CategoriesSchema = (t:TFunction) => {
    return z.object({
    nameAr:StringReq(t), nameEn:StringReq(t),
image:noSchema(),
storeId:selectNotReq()
})
  };

  export type CategoriesType = z.infer<
	ReturnType<typeof CategoriesSchema>
  >;
  
  