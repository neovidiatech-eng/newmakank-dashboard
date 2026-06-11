"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { UsersInputs } from "./users.inputs";
import { UsersSchema, type UsersType } from "./users.schema";

export default function useUsersLogic({ data }: { data?: UsersType }) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = UsersInputs({ isEdit: !!data });
  const {
    control,

    handleSubmit,
    reset
  } = useForm<UsersType>({
    mode: "onSubmit",
    resolver: zodResolver(UsersSchema(t, !!data)),
    defaultValues: extractFormDefaultInputs(inputs, data) as UsersType
  });

  const onSubmit = async (formData: UsersType) => {
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formData }),
      endpoint: ["users"],
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
