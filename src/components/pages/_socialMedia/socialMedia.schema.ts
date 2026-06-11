
  import { z } from "zod";
  
  
  import { StringReq } from "@/validations/String.schema";
  
  
  
  import { noSchema } from "@/validations/String.schema"
  export const SocialMediaSchema = (t:TFunction) => {
    return z.object({
    platform:StringReq(t),
link:StringReq(t),
image:noSchema(),
isActive:noSchema()
})
  };

  export type SocialMediaType = z.infer<
	ReturnType<typeof SocialMediaSchema>
  >;
  
  