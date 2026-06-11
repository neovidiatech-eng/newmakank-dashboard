
  import { z } from "zod";
  
  
  import { noSchema, StringReq } from "@/validations/String.schema";
  
  
  import { selectNotReq } from "@/validations/Select.schema";
  
  export const CategorySchema = (t:TFunction) => {
    return z.object({
    nameAr:StringReq(t), nameEn:StringReq(t),
moduleId:selectNotReq(),
image:noSchema(),
order:noSchema(),
storeId:selectNotReq(),
})
  };

  export type CategoryType = z.infer<
	ReturnType<typeof CategorySchema>
  >;
  
  