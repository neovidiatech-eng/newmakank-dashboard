"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { ProfileInputs } from "./profile.inputs";
import { ProfileSchema, type ProfileType } from "./profile.schema";

export default function useProfileLogic({ data }: { data?: ProfileType }) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = ProfileInputs();
  const {
    control,
    formState: { dirtyFields },
    handleSubmit,
    reset
  } = useForm<ProfileType>({
    mode: "onSubmit",
    resolver: zodResolver(ProfileSchema(t)),
    defaultValues: extractFormDefaultInputs(inputs, data) as ProfileType
  });

  const onSubmit = async (formData: ProfileType) => {
    await formAction({
      data: data,
      noId: true,
      formData: extractFormNameInputs({ inputs, data: formData, dirtyFields }),
      endpoint: ["profile"],
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
