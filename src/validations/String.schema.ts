import { z } from "zod";
export function StringReq(t: TFunction, min: number = 3) {
  return z
    .string({
      required_error: t(`Validations.required`),
      invalid_type_error: t(`Validations.invalidType`)
    })
    .min(min, { message: t(`Validations.min${min}`) })
    .refine(val => val.length >= min, {
      message: t(`Validations.min${min}`)
    })
    .refine(val => val !== "", { message: t(`Validations.required`) });
}

export function PasswordSchema(t: TFunction) {
  return z
    .string()
    .min(8, { message: t(`Validations.min8`) })
    .refine(val => val.length >= 8, { message: t(`Validations.min8`) })
    .refine(val => val !== "", { message: t(`Validations.required`) });
}
export function StringNotReq() {
  return z.union([
    z.string().nullable().optional(),
    z.number().nullable().optional(),
    z.array(z.string().optional())
  ]);
}

export function EmailReq(t: TFunction) {
  return z
    .string({
      required_error: t(`Validations.required`),
      invalid_type_error: t(`Validations.invalidType`)
    })
    .email({
      message: t(`Validations.invalidEmail`)
    })
    .refine(val => val.length >= 3, { message: t(`Validations.min3`) })
    .refine(val => val !== "", { message: t(`Validations.required`) });
}

export function noSchema() {
  return z.any();
}
