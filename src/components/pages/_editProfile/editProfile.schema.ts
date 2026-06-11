import { ImageFileSchema } from "@/validations/file.schema";
import { QatarPhoneSchema } from "@/validations/SaudiPhoneInputSchema";
import { StringNotReq } from "@/validations/String.schema";
import { useTranslations } from "@/lib/i18n";
import { z } from "zod";

// import { StringNotReq, noSchema } from "@/validations/string.schemas";

export const EditProfileSchema = () => {
  const t = useTranslations();
  return z.object({
    name: StringNotReq(),
    email: StringNotReq(),
    image: ImageFileSchema({ t }),
    phone: QatarPhoneSchema(t)
  });
};

export type EditProfileType = z.infer<ReturnType<typeof EditProfileSchema>>;
