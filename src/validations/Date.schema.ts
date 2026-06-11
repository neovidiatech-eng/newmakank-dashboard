import { z } from "zod";

export function dateSchema(t: (key: string) => string) {
  return z.union([
    z
      .string({
        required_error: t(`Validations.required`),
        invalid_type_error: t(`Validations.invalidType`)
      })
      .refine(val => !isNaN(Date.parse(val)), {
        message: t(`Validations.invalidDate`)
      }),
    z.date({
      required_error: t(`Validations.required`),
      invalid_type_error: t(`Validations.invalidType`)
    })
  ]);
}

export function timeSchema(t: (key: string) => string) {
  return z
    .string({
      required_error: t(`Validations.required`),
      invalid_type_error: t(`Validations.invalidType`)
    })
    .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$/i, {
      message: t(`Validations.invalidTimeFormat`)
    });
}

export function time24Schema(t: (key: string) => string) {
  return z
    .string({
      required_error: t(`Validations.required`),
      invalid_type_error: t(`Validations.invalidType`)
    })
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: t(`Validations.invalidTime24Format`)
    });
}

export function hoursSchema(t: (key: string) => string) {
  return z
    .number({
      required_error: t(`Validations.required`),
      invalid_type_error: t(`Validations.invalidType`)
    })
    .min(1, { message: t(`Validations.invalidHour`) })
    .max(12, { message: t(`Validations.invalidHour`) });
}

export function hours24Schema(t: (key: string) => string) {
  return z
    .number({
      required_error: t(`Validations.required`),
      invalid_type_error: t(`Validations.invalidType`)
    })
    .min(0, { message: t(`Validations.invalidHour24`) })
    .max(23, { message: t(`Validations.invalidHour24`) });
}

export function minutesSchema(t: (key: string) => string) {
  return z
    .number({
      required_error: t(`Validations.required`),
      invalid_type_error: t(`Validations.invalidType`)
    })
    .min(0, { message: t(`Validations.invalidMinute`) })
    .max(59, { message: t(`Validations.invalidMinute`) });
}

export function amPmSchema(t: (key: string) => string) {
  return z.enum(["AM", "PM", "am", "pm"], {
    required_error: t(`Validations.required`),
    invalid_type_error: t(`Validations.invalidAmPm`)
  });
}

export function timeObjectSchema(t: (key: string) => string) {
  return z.object({
    hours: hoursSchema(t),
    minutes: minutesSchema(t),
    period: amPmSchema(t)
  });
}

export function time24ObjectSchema(t: (key: string) => string) {
  return z.object({
    hours: hours24Schema(t),
    minutes: minutesSchema(t)
  });
}
