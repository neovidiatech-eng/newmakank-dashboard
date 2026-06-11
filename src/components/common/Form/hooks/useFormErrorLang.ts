import { FormLangs } from "@/components/common/Form/CustomFormTypes.types";
import { useLocale, useTranslations } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import { toast } from "sonner";

export default function useFormErrorLang<T extends FieldValues>({
  errors,
  name
}: {
  errors: FieldErrors<T>;
  name: Readonly<string[]>;
}): { lang: FormLangs } {
  const locale = useLocale();
  const t = useTranslations();
  const [lang, setLang] = useState<FormLangs>(locale === "ar" ? "Ar" : "En");
  useEffect(() => {
    name.forEach(element => {
      if (Object.keys(errors).includes(`${element}En`)) {
        setLang("changeToEn");
        window.scrollTo(0, 0);

        toast.error(`${t(element)} (${t("En")})`, {
          description: errors[`${element}En`]?.message as string
        });
      }
      if (Object.keys(errors).includes(`${element}Ar`)) {
        setLang("changeToAr");
        window.scrollTo(0, 0);
        toast.error(`${t(element)} (${t("Ar")})`, {
          description: errors[`${element}Ar`]?.message as string
        });
      }
    });
  }, [errors]);
  return {
    lang
  };
}
