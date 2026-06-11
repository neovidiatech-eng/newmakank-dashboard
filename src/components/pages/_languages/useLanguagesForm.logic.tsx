"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { LanguagesInputs } from "./languages.inputs";
import { LanguagesSchema, type LanguagesType } from "./languages.schema";
export default function useLanguagesLogic({ data }: { data?: LanguagesType }) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = LanguagesInputs();
  const {
    control,

    handleSubmit,
    reset
  } = useForm<LanguagesType>({
    mode: "onSubmit",
    resolver: zodResolver(LanguagesSchema(t)),
    defaultValues: extractFormDefaultInputs(inputs, data) as LanguagesType
  });

  const onSubmit = async (formData: LanguagesType) => {
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formData }),
      endpoint: ["languages"],
      reset: reset,

      t
    });
  };

  const formSubmit = handleSubmit(onSubmit);

  return {
    control,
    inputs,
    formSubmit,
    t
  };
}
