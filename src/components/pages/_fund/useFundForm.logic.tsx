"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { FundInputs } from "./fund.inputs";
import { FundSchema, type FundType } from "./fund.schema";

export default function useFundLogic({ data }: { data?: FundType }) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = FundInputs();
  const {
    control,

    handleSubmit,
    reset
  } = useForm<FundType>({
    mode: "onSubmit",
    resolver: zodResolver(FundSchema(t)),
    defaultValues: extractFormDefaultInputs(inputs, data) as FundType
  });

  const onSubmit = async (formData: FundType) => {
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formData }),
      endpoint: ["fund"],
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
