"use client";

import useFormErrorLang from "@/components/common/Form/hooks/useFormErrorLang";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BannersInputs } from "./banners.inputs";
import { BannersSchema, type BannersType } from "./banners.schema";

export default function useBannersLogic({ data }: { data?: BannersType }) {
  const t = useTranslations();
  const formAction = useFormAction();
  const initialInputs = BannersInputs({
    selectedStore: data?.storeId,
    selectedTargetType: typeof data?.targetType === "string" ? data.targetType : "GENERAL"
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch
  } = useForm<BannersType>({
    mode: "onSubmit",
    resolver: zodResolver(BannersSchema(t)),
    defaultValues: extractFormDefaultInputs(initialInputs, data) as BannersType
  });
  const selectedStore = watch("storeId") ?? data?.storeId;
  const selectedTargetType = (watch("targetType") as string | undefined) || "GENERAL";
  const specialDeliveryValue = watch("specialDelivery");
  const isSpecialDelivery = Array.isArray(specialDeliveryValue)
    ? specialDeliveryValue.includes("true")
    : Boolean(specialDeliveryValue);

  useEffect(() => {
    if (isSpecialDelivery) {
      setValue("targetType", "SPECIAL_DRIVER");
      setValue("storeId", "");
      setValue("categoryId", "");
      setValue("serviceId", "");
      setValue("zoneIds", []);
    }
  }, [isSpecialDelivery, setValue]);

  useEffect(() => {
    if (isSpecialDelivery) return;

    if (selectedTargetType === "GENERAL") {
      setValue("storeId", "");
      setValue("categoryId", "");
      setValue("serviceId", "");
      setValue("zoneIds", []);
      return;
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
  }, [selectedTargetType, isSpecialDelivery, setValue]);

  const inputs = BannersInputs({
    selectedStore: isSpecialDelivery ? null : selectedStore,
    selectedTargetType,
    isSpecialDelivery,
    onStoreChange: () => {
      setValue("categoryId", "");
      setValue("serviceId", "");
      setValue("zoneIds", []);
    }
  });

  const onSubmit = async (formData: BannersType) => {
    const targetType = isSpecialDelivery
      ? "SPECIAL_DRIVER"
      : typeof formData.targetType === "string" && formData.targetType
        ? formData.targetType
        : "GENERAL";

    const normalizedFormData = {
      ...formData,
      targetType,
      specialDelivery: undefined,
      storeId: ["STORE", "CATEGORY", "SERVICE", "ZONE"].includes(targetType) ? formData.storeId : undefined,
      categoryId: ["CATEGORY", "SERVICE"].includes(targetType) ? formData.categoryId : undefined,
      serviceId: targetType === "SERVICE" ? formData.serviceId : undefined,
      zoneIds:
        targetType === "ZONE" && Array.isArray(formData.zoneIds)
          ? formData.zoneIds.join(",")
          : targetType === "ZONE"
            ? formData.zoneIds
            : undefined
    };

    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: normalizedFormData }),
      endpoint: ["banners"],
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
