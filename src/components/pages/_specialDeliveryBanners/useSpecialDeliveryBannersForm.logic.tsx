"use client";

import useFormErrorLang from "@/components/common/Form/hooks/useFormErrorLang";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SpecialDeliveryBannersInputs } from "./specialDeliveryBanners.inputs";
import { SpecialDeliveryBannersSchema, type SpecialDeliveryBannersType } from "./specialDeliveryBanners.schema";

export default function useSpecialDeliveryBannersLogic({ data }: { data?: SpecialDeliveryBannersType }) {
  const t = useTranslations();
  const formAction = useFormAction();
  const initialInputs = SpecialDeliveryBannersInputs({
    selectedStore: data?.storeId,
    selectedTargetType: typeof data?.targetType === "string" ? data.targetType : "GENERAL",
    t
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch
  } = useForm<SpecialDeliveryBannersType>({
    mode: "onSubmit",
    resolver: zodResolver(SpecialDeliveryBannersSchema(t)),
    defaultValues: extractFormDefaultInputs(initialInputs, data) as SpecialDeliveryBannersType
  });
  const selectedStore = watch("storeId") ?? data?.storeId;
  const selectedCategory = watch("categoryId") ?? data?.categoryId;
  const selectedTargetType = (watch("targetType") as string | undefined) || "GENERAL";

  useEffect(() => {
    if (["GENERAL", "EXTERNAL_URL"].includes(selectedTargetType)) {
      setValue("storeId", "");
      setValue("categoryId", "");
      setValue("serviceId", "");
      setValue("zoneIds", []);
      setValue("customerCategoryId", "");
      if (selectedTargetType !== "EXTERNAL_URL") {
        setValue("clickUrl", "");
      }
      return;
    }

    if (selectedTargetType !== "CUSTOMER_CATEGORY") {
      setValue("customerCategoryId", "");
    }

    if (!["CATEGORY", "SERVICE"].includes(selectedTargetType)) {
      setValue("categoryId", "");
    }

    if (selectedTargetType !== "SERVICE") {
      setValue("serviceId", "");
    }

    if (selectedTargetType !== "ZONE") {
      setValue("zoneIds", []);
    }
  }, [selectedTargetType, setValue]);

  const inputs = SpecialDeliveryBannersInputs({
    selectedStore,
    selectedCategory,
    selectedTargetType,
    t,
    onStoreChange: () => {
      setValue("categoryId", "");
      setValue("serviceId", "");
      setValue("zoneIds", []);
    },
    onCategoryChange: () => {
      setValue("serviceId", "");
    }
  });

  const onSubmit = async (formData: SpecialDeliveryBannersType) => {
    const targetType = typeof formData.targetType === "string" && formData.targetType
      ? formData.targetType
      : "GENERAL";

    const normalizedFormData: any = {
      ...formData,
      targetType,
    };

    if (targetType !== "EXTERNAL_URL") {
      delete normalizedFormData.clickUrl;
    }
    if (targetType !== "CUSTOMER_CATEGORY") {
      delete normalizedFormData.customerCategoryId;
    }
    if (!["STORE", "CATEGORY", "SERVICE", "ZONE"].includes(targetType)) {
      delete normalizedFormData.storeId;
    }
    if (!["CATEGORY", "SERVICE"].includes(targetType)) {
      delete normalizedFormData.categoryId;
    }
    if (targetType !== "SERVICE") {
      delete normalizedFormData.serviceId;
    }
    if (targetType !== "ZONE") {
      delete normalizedFormData.zoneIds;
    } else if (Array.isArray(formData.zoneIds)) {
      normalizedFormData.zoneIds = formData.zoneIds.join(",");
    }

    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: normalizedFormData }),
      endpoint: ["specialDeliveryBanners"],
      customReset: () => reset(extractFormDefaultInputs(inputs, undefined) as any),
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
