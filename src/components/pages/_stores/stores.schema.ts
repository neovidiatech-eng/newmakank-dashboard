
  import { z } from "zod";
  
  import { EmailReq, noSchema, StringNotReq, StringReq } from "@/validations/String.schema";
  
  import { selectNotReq } from "@/validations/Select.schema";
  export const StoresSchema = (t:TFunction,isEdit:boolean) => {
    return z.object({
    nameAr:StringReq(t), nameEn:StringReq(t),
moduleId:selectNotReq(),
logo:noSchema(),
cover:noSchema(),
categoryId:noSchema(),
lat:StringNotReq(),
lng:StringNotReq(),
map: z.object({
    lat: z.number(),
    lng: z.number(),
}).optional(),
address:StringReq(t),
UserName:isEdit ? noSchema() : StringReq(t),
userEmail:isEdit ? noSchema() : EmailReq(t),
userPhone:isEdit ? noSchema() : StringReq(t),
userPass:isEdit ? noSchema() : StringReq(t)
})
  };

  
  export type StoresType = z.infer<
	ReturnType<typeof StoresSchema>
  >;
  
  