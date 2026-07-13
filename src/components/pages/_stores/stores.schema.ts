
  import { z } from "zod";
  
  import { EmailReq, noSchema, StringNotReq, StringReq } from "@/validations/String.schema";
  
  import { selectNotReq, SelectReq } from "@/validations/Select.schema";
  export const StoresSchema = (t:TFunction,isEdit:boolean) => {
    return z.object({
    nameAr:StringReq(t), nameEn:StringReq(t),
templateId:SelectReq(t),
logo:noSchema(),
cover:noSchema(),
// Required by the backend on create (POST /stores rejects without it), optional on
// edit — a plain numeric fallback is applied in useStoresForm.logic.tsx so a store can
// still be created even if this is left blank.
storeOrder: z.union([z.number(), z.string()]).optional(),
lat:StringNotReq(),
lng:StringNotReq(),
map: z.object({
    lat: z.number(),
    lng: z.number(),
}).optional(),
address:StringReq(t),
UserName:StringReq(t),
userEmail:EmailReq(t),
userPhone: StringReq(t).refine((val) => /^(\+20|0020|20)?0?1[0125]\d{8}$/.test(val), {
      message: t("enterValidEgyptianPhone")
    }),
userPass:isEdit ? StringNotReq() : StringReq(t)
})
  };

  
  export type StoresType = z.infer<
	ReturnType<typeof StoresSchema>
  >;
  
  