import { z } from "zod";

export function selectNotReq() {
  return z.union([
    z.string().nullable().optional(),
    z.number().nullable().optional(),
    z.undefined()
  ]);
}
export function BooleanReq(t: TFunction) {
  return z.union([
    z.string().startsWith("false"),
    z.string().startsWith("true"),
    z
      .boolean({
        required_error: t(`Validations.required`),
        invalid_type_error: t(`Validations.invalidType`)
      })
      .refine(val => val !== undefined, {
        message: t(`Validations.required`)
      })
  ]);
}
export function SelectReq(t: TFunction) {
  return z.union([
    z
      .string({
        required_error: t(`Validations.required`),
        invalid_type_error: t(`Validations.invalidType`)
      })
      .nonempty(t("Validations.required")),

    z.number().min(0, t("Validations.required"))
  ]);
}

export function MultiSelectReqWithMax(t: TFunction, max: number = 400) {
  return z.array(SelectReq(t)).max(max, `${t("Validations.max")} ${max}`);
}
