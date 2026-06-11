"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { AllPermissionsInputs } from "./allPermissions.inputs";
import { AllPermissionsSchema, type AllPermissionsType } from "./allPermissions.schema";
export default function useAllPermissionsLogic({ data }: { data?: AllPermissionsType }) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = AllPermissionsInputs();
  const {
    control,

    handleSubmit,
    reset
  } = useForm<AllPermissionsType>({
    mode: "onSubmit",
    resolver: zodResolver(AllPermissionsSchema(t)),
    defaultValues: extractFormDefaultInputs(inputs, data) as AllPermissionsType
  });

  const onSubmit = async (formData: AllPermissionsType) => {
    await formAction({
      data,
      formData: {
        name: { ar: formData.nameAr, en: formData.nameEn }
      },
      endpoint: ["permissions"],
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
