"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { EmployeesInputs } from "./employees.inputs";
import { EmployeesSchema, type EmployeesType } from "./employees.schema";

import { useState, useEffect } from "react";

export default function useEmployeesLogic({ data }: { data?: EmployeesType }) {
  const t = useTranslations();
  const formAction = useFormAction();

  const initialStoreId =
    (data as any)?.storeId ??
    (data as any)?.Branch?.storeId ??
    (data as any)?.Branch?.Store?.id ??
    null;

  const [selectedStore, setSelectedStore] = useState<string | number | null>(initialStoreId);

  const inputs = EmployeesInputs({
    isEdit: !!data,
    selectedStore,
    setSelectedStore: (val) => {
      setSelectedStore(val);
      setValue("branchId", null as any);
    }
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue
  } = useForm<EmployeesType>({
    mode: "onSubmit",
    resolver: zodResolver(EmployeesSchema(t, !!data)),
    defaultValues: {
      ...extractFormDefaultInputs(inputs, data),
      storeId: initialStoreId
    } as any
  });

  useEffect(() => {
    if (data) {
      const storeId =
        (data as any)?.storeId ??
        (data as any)?.Branch?.storeId ??
        (data as any)?.Branch?.Store?.id ??
        null;
      if (storeId) {
        setSelectedStore(storeId);
      }
    }
  }, [data]);

  const onSubmit = async (formData: EmployeesType) => {
    let formattedPhone = formData.phone;
    if (formattedPhone) {
      formattedPhone = formattedPhone.replace(/^(\+20|0020|20)/, "");
      if (formattedPhone.startsWith("0")) {
        formattedPhone = formattedPhone.substring(1);
      }
      formattedPhone = "+20" + formattedPhone;
    }

    const { storeId, ...cleanData } = formData as any;

    const payload = {
      ...cleanData,
      phone: formattedPhone,
      roleId: Number(formData.roleId),
      branchId: formData.branchId ? Number(formData.branchId) : undefined
    };

    await formAction({
      data,
      formData: payload as any,
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
