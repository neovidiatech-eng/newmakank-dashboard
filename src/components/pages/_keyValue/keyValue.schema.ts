
  import { z } from "zod";
  
  
  import { StringReq } from "@/validations/String.schema";
  
  
  
  import { noSchema } from "@/validations/String.schema";
import { ImageFileSchema } from "@/validations/file.schema";
  export const KeyValueSchema = (t:TFunction,type:KeyValueFormType) => {
    return z.object({
    valueAr:type =='text' ? StringReq(t) : noSchema(), valueEn:type =='text' ? StringReq(t) : noSchema(),
file:type == 'file' ? noSchema() : ImageFileSchema({ t }),
key:noSchema(),
})
  };

  export type KeyValueType = z.infer<
	ReturnType<typeof KeyValueSchema>
  >;
  
  

  export type KeyValueFormType = 'file'| 'text'
