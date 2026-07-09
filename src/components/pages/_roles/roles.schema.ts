
  import { z } from "zod";

  
  import { StringReq } from "@/validations/String.schema";
  
  
  
  
  export const RolesSchema = (t:TFunction, permissions?: AppConfig.SystemPermission[]) => {
    const permFields = Object.fromEntries(
      (permissions ?? []).map((group) => [
        `perm_${group.prefix}`,
        z.array(z.string()).optional().default([]),
      ])
    );
    return z.object({
    nameAr:StringReq(t), nameEn:StringReq(t),
...permFields,
})
  };

  export type RolesType = z.infer<
	ReturnType<typeof RolesSchema>
  >;
  
  