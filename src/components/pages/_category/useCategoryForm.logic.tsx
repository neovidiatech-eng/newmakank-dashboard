"use client";

import { endpointType } from "@/utils/endpoints";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { CategoryInputs } from "./category.inputs";
import { CategorySchema, type CategoryType } from "./category.schema";
export default function useCategoryLogic({
  data,
  endpoint
}: {
  data?: CategoryType;
  endpoint?: endpointType;
}) {
  const t = useTranslations();
  const formAction = useFormAction();
  const hasStoreId = Boolean(data?.storeId);
  const inputs = CategoryInputs({ hasStoreId });
  const {
    control,
    handleSubmit,
    reset
  } = useForm<CategoryType>({
    mode: "onSubmit",
    resolver: zodResolver(CategorySchema(t)),
    defaultValues: extractFormDefaultInputs(inputs, data) as CategoryType
  });

  const onSubmit = async (formData: CategoryType) => {
    if (data?.storeId) formData.storeId = data.storeId;
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formData }),
      endpoint: endpoint ?? ["categories"],
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
