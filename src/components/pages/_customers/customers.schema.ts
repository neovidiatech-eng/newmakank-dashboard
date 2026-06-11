
  import { z } from "zod";
  
  import { EmailReq, StringReq } from "@/validations/String.schema";
  
  
  
  import { noSchema } from "@/validations/String.schema";
  export const CustomersSchema = (t:TFunction) => {
    return z.object({
    name:StringReq(t),
email:EmailReq(t),
phone:noSchema(),
password:StringReq(t,6)
})
  };

  export type CustomersType = z.infer<
	ReturnType<typeof CustomersSchema>
  >;
  
  