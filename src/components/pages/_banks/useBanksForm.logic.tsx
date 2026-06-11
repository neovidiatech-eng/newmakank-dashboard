"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { BanksInputs } from "./banks.inputs";
import { BanksSchema, type BanksType } from "./banks.schema";

export default function useBanksLogic({ data }: { data?: BanksType }) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = BanksInputs();
  const {
    control,

    handleSubmit,
    reset
  } = useForm<BanksType>({
    mode: "onSubmit",
    resolver: zodResolver(BanksSchema(t)),
    defaultValues: extractFormDefaultInputs(inputs, data) as BanksType
  });

  const onSubmit = async (formData: BanksType) => {
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formData }),
      endpoint: ["banks"],
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
