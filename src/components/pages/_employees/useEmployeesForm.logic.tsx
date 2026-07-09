"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { EmployeesInputs } from "./employees.inputs";
import { EmployeesSchema, type EmployeesType } from "./employees.schema";

export default function useEmployeesLogic({ data }: { data?: EmployeesType }) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = EmployeesInputs({ isEdit: !!data });
  const {
    control,
    handleSubmit,
    reset
  } = useForm<EmployeesType>({
    mode: "onSubmit",
    resolver: zodResolver(EmployeesSchema(t, !!data)),
    defaultValues: extractFormDefaultInputs(inputs, data) as EmployeesType
  });

  const onSubmit = async (formData: EmployeesType) => {
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formData }),
      endpoint: ["employees"],
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
