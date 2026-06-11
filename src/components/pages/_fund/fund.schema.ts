
  import { z } from "zod";
  import {SelectReq } from "@/validations/Select.schema";
  
  
  
  import { PriceSchema } from "@/validations/Number.schema";
  
  
  export const FundSchema = (t:TFunction) => {
    return z.object({
    customerId:SelectReq(t),
price:PriceSchema(t,0)
})
  };

  export type FundType = z.infer<
	ReturnType<typeof FundSchema>
  >;
  
  