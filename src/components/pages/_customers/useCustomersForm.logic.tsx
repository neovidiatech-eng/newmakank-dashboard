"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { CustomersInputs } from "./customers.inputs";
import { CustomersSchema, type CustomersType } from "./customers.schema";

export default function useCustomersLogic({ data }: { data?: CustomersType }) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = CustomersInputs();
  const {
    control,

    handleSubmit,
    reset
  } = useForm<CustomersType>({
    mode: "onSubmit",
    resolver: zodResolver(CustomersSchema(t)),
    defaultValues: extractFormDefaultInputs(inputs, data) as CustomersType
  });

  const onSubmit = async (formData: CustomersType) => {
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formData }),
      endpoint: ["customers"],
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
