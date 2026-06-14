import { z } from "zod";

import type { SettingsFormValues } from "./settings.types";

export const SettingsSchema = (t: (key: string) => string): z.ZodType<SettingsFormValues> =>
  z.record(z.any()).superRefine((data, ctx) => {
    if (data.shippingKMCharge !== undefined && data.shippingKMCharge !== null) {
      const val = Number(data.shippingKMCharge);
      if (isNaN(val) || val <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("shippingKMCharge_must_be_greater_than_zero"),
          path: ["shippingKMCharge"]
        });
      }
    }
  });
