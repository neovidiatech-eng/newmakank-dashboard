import { PriceSchema } from "@/validations/Number.schema";
import { MultiSelectReqWithMax } from "@/validations/Select.schema";

import { z } from "zod";

const requiredField = (t: TFunction) =>
  z.string({
    required_error: t("Validations.required"),
    invalid_type_error: t("Validations.invalidType")
  }).min(1, t("Validations.required"));

export const DeliveryScheduleSchema = (t: TFunction) =>
  z.object({
    deliveryId: z.number(),
    days: MultiSelectReqWithMax(t),
    openingTime: requiredField(t),
    closingTime: requiredField(t),
    is24Hours: z.array(z.string()).optional(),
    requiredRadius: PriceSchema(t, 0),
    map: z.object({
      lat: z.number(),
      lng: z.number()
    }, {
      required_error: t("Validations.required")
    })
  });

export type DeliveryScheduleType = z.infer<ReturnType<typeof DeliveryScheduleSchema>>;
