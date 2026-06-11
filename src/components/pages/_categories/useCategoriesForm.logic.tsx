"use client";

import useFormErrorLang from "@/components/common/Form/hooks/useFormErrorLang";
import { endpointType } from "@/utils/endpoints";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { CategoriesInputs } from "./categories.inputs";
import { CategoriesSchema, type CategoriesType } from "./categories.schema";
export default function useCategoriesLogic({
  data,
  endpoint
}: {
  data?: CategoriesType;
  endpoint?: endpointType;
}) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = CategoriesInputs();
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm<CategoriesType>({
    mode: "onSubmit",
    resolver: zodResolver(CategoriesSchema(t)),
    defaultValues: extractFormDefaultInputs(inputs, data) as CategoriesType
  });

  const onSubmit = async (formData: CategoriesType) => {
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formData }),
      endpoint: endpoint ?? ["categories"],
      reset: reset,

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
