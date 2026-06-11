
  import { z } from "zod";
  
  
  import { StringReq } from "@/validations/String.schema";
  
  
  import { selectNotReq } from "@/validations/Select.schema";
  import { noSchema } from "@/validations/String.schema"
  export const BankAccountsSchema = (t:TFunction) => {
    return z.object({
    nameAr:StringReq(t), nameEn:StringReq(t),
bankId:selectNotReq(),
phone:noSchema(),
ibn:StringReq(t)
})
  };

  export type BankAccountsType = z.infer<
	ReturnType<typeof BankAccountsSchema>
  >;
  
  