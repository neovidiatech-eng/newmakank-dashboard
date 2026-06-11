"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { SocialMediaInputs } from "./socialMedia.inputs";
import { SocialMediaSchema, type SocialMediaType } from "./socialMedia.schema";
export default function useSocialMediaLogic({ data }: { data?: SocialMediaType }) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = SocialMediaInputs();
  const {
    control,

    handleSubmit,
    reset
  } = useForm<SocialMediaType>({
    mode: "onSubmit",
    resolver: zodResolver(SocialMediaSchema(t)),
    defaultValues: extractFormDefaultInputs(inputs, data) as SocialMediaType
  });

  const onSubmit = async (formData: SocialMediaType) => {
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formData }),
      endpoint: ["socialMedia"],
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
