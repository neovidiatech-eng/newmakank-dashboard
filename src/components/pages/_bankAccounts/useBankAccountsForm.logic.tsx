"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { BankAccountsInputs } from "./bankAccounts.inputs";
import { BankAccountsSchema, type BankAccountsType } from "./bankAccounts.schema";

export default function useBankAccountsLogic({ data }: { data?: BankAccountsType }) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = BankAccountsInputs();
  const {
    control,

    handleSubmit,
    reset
  } = useForm<BankAccountsType>({
    mode: "onSubmit",
    resolver: zodResolver(BankAccountsSchema(t)),
    defaultValues: extractFormDefaultInputs(inputs, data) as BankAccountsType
  });

  const onSubmit = async (formData: BankAccountsType) => {
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formData }),
      endpoint: ["bankAccounts"],
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
