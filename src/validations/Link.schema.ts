import { z } from "zod";

export function LinkSchema(t: TFunction = (key: string) => key) {
  return z
    .string()
    .min(1, { message: t("Validations.required") }) // Ensure the link is not empty (required)
    .refine(
      link => link.startsWith("http://") || link.startsWith("https://"), // Validate URL starts with http:// or https://
      { message: t("Validations.invalidUrl") }
    )
    .refine(
      link => {
        try {
          // Validate URL structure using URL constructor
          new URL(link);
          return true;
        } catch {
          return false;
        }
      },
      { message: t("Validations.invalidUrlStructure") }
    )
    .refine(
      link => link.length <= 2048, // Ensure the link length is within a reasonable limit
      { message: t("Validations.urlTooLong") }
    );
}
