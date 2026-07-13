
  import { z } from "zod";
  
  
  import { StringReq } from "@/validations/String.schema";
  import { selectNotReq } from "@/validations/Select.schema";
  
  
  
    export const ZonesSchema = (t:TFunction) => {
    return z.object({
    nameAr:StringReq(t), nameEn:StringReq(t),
cityId:selectNotReq(),
coordinates:z.array(z.object({ lat: z.number(), lng: z.number() })),
// App-wide fixed delivery price for this zone — optional; leaving it empty falls back
// to the base-fee-plus-per-km formula everywhere it's used (regular delivery, 2-stop
// custom delivery, and per-recipient online delivery).
deliveryPrice: z
  .union([z.number(), z.string()])
  .optional()
  .transform(value => {
    if (value === undefined || value === null || value === "") return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
})
  };

  export type ZonesType = z.infer<
	ReturnType<typeof ZonesSchema>
  >;
  
  
