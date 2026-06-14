"use client";

import useFormErrorLang from "@/components/common/Form/hooks/useFormErrorLang";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { CustomerCategoriesInputs } from "./customerCategories.inputs";
import { CustomerCategoriesSchema, type CustomerCategoriesType } from "./customerCategories.schema";

export default function useCustomerCategoriesLogic({
  data
}: {
  data?: CustomerCategoriesType;
}) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = CustomerCategoriesInputs();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CustomerCategoriesType>({
    mode: "onSubmit",
    resolver: zodResolver(CustomerCategoriesSchema(t)),
    defaultValues: extractFormDefaultInputs(inputs, data) as CustomerCategoriesType
  });

  const onSubmit = async (formData: CustomerCategoriesType) => {
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formData }),
      endpoint: ["customerCategories"],
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
