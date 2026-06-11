import { z } from "zod";

// Helper function to format supported file types for error messages
function formatSupportedTypes(types: string[]): string {
  return types
    .map(type => type.replace("image/", "").toUpperCase())
    .join(", ");
}

export function ImageFileSchema({
  supportedTypes = ["image/jpeg", "image/png", "image/gif", "image/JPEG", "image/svg+xml"],
  t = (key: string) => key
}:{
  supportedTypes?: string[];
  t?: TFunction;
}) {
  const formattedTypes = formatSupportedTypes(supportedTypes);
  
  return z.union([
    // File validation
    z
      .custom<File>(data => data instanceof File, { message: t("Validations.mustBeFile") })
      .refine(file => supportedTypes.includes(file.type), {
        message: `${t("Validations.invalidFileType")} (${formattedTypes})`
      })
      .refine(file => file.size <= 5 * 1024 * 1024, { message: t("Validations.fileTooLarge") }),
    z
      .string()
      .min(1, { message: t("Validations.required") })
      .refine(
        str =>
          str.startsWith("uploads/") ||
          str.startsWith("/uploads/") ||
          str.startsWith("https") ||
          str.startsWith("http") ||
          str.startsWith("data:image/") ||
          str.startsWith("image-"),
        { message: t("Validations.invalidImageUrl") }
      )
  ]);
}
export function MultiImageFileSchema(t: TFunction, minFiles = 1, maxFiles = 10) {
  // Reuse ImageFileSchema for each image in the array, with min and max constraints
  return z
    .array(ImageFileSchema({ t }))
    .min(minFiles, { message: t(`At least ${minFiles} image(s) required`) })
    .max(maxFiles, { message: t(`Maximum of ${maxFiles} images allowed`) });
}
export function VideoFileSchema(t: TFunction = (key: string) => key) {
  return z
    .any()
    .refine(file => file instanceof File, {
      message: t("Validations.mustBeFile")
    })
    .refine(file => file?.type === "video/mp4", {
      message: `${t("Validations.invalidFileType")} (MP4)`
    })
    .refine(file => file?.size <= 50 * 1024 * 1024, {
      message: t("Validations.fileTooLarge")
    });
}

export function PdfFileSchema(t: TFunction = (key: string) => key) {
  return z.union([
    // File validation for when a File object is provided
    z
      .custom<File>(data => data instanceof File, { message: t("Validations.mustBeFile") })
      .refine(file => file.type === "application/pdf", {
        message: `${t("Validations.invalidFileType")} (PDF)`
      })
      .refine(file => file.size <= 50 * 1024 * 1024, {
        message: t("Validations.fileTooLarge")
      }),

    // String validation for when a file path/URL is provided
    z
      .string()
      .min(1, { message: t("Validations.required") })
      .refine(
        str => str.endsWith(".pdf") || str.startsWith("uploads/") || str.startsWith("/uploads/"),
        { message: t("Validations.invalidPdfUrl") }
      ),

    // Special case to handle optional files with custom error
    z.undefined().transform(() => {
      throw new Error(t("Validations.required"));
    })
  ]);
}
