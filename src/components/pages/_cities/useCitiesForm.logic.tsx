"use client";

import useFormErrorLang from "@/components/common/Form/hooks/useFormErrorLang";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { CitiesInputs } from "./cities.inputs";
import { CitiesSchema, type CitiesType } from "./cities.schema";

export default function useCitiesLogic({ data }: { data?: CitiesType }) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = CitiesInputs();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<CitiesType>({
    mode: "onSubmit",
    resolver: zodResolver(CitiesSchema(t)),
    defaultValues: extractFormDefaultInputs(inputs, data) as CitiesType
  });

  const onSubmit = async (formData: CitiesType) => {
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formData }),
      endpoint: ["cities"],
      t
    });
  };

  const formSubmit = handleSubmit(onSubmit);
  const { lang } = useFormErrorLang({
    errors,
    name: ["name"]
  });
  return {
    lang,
    control,
    inputs,
    formSubmit,
    t
  };
}
