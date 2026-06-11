"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { KeyValueInputs } from "./keyValue.inputs";
import { KeyValueFormType, KeyValueSchema, type KeyValueType } from "./keyValue.schema";

export default function useKeyValueLogic({
  data,
  type
}: {
  data?: KeyValueType;
  type: KeyValueFormType;
}) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = KeyValueInputs({ type });
  const { control, handleSubmit, reset } = useForm<KeyValueType>({
    mode: "onSubmit",
    resolver: zodResolver(KeyValueSchema(t, type)),
    defaultValues: extractFormDefaultInputs(inputs, data) as KeyValueType
  });

  const onSubmit = async (formData: KeyValueType) => {
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formData }),
      endpoint: ["keyvalue"],
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
