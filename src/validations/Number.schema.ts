import { z } from "zod";

export function PriceSchema(
  t: (key: string) => string,
  min: number = 0,
  max: number = 999999999999
) {
  return z
    .union([
      z.number({
        required_error: t(`Validations.required`),
        invalid_type_error: t(`Validations.invalidType`)
      }),
      z
        .string()
        .refine(value => !isNaN(parseFloat(value)), {
          message: t("Validations.shouldField_have_a_positive_number"),
          params: { received: "string" }
        })
        .transform(parseFloat)
    ])
    .refine(value => value >= min, {
      message: `${t("Validations.should_number_grater_or_equal")}${min}`,
      params: { received: "negative" }
    })
    .refine(value => value <= max, {
      message: `${t("Validations.should_number_less_or_equal")} ${max}`,
      params: { received: "positive" }
    });
}
