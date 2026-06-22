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
  } = useForm<BannersType>({
    mode: "onSubmit",
    resolver: zodResolver(BannersSchema(t)),
    defaultValues: extractFormDefaultInputs(initialInputs, data) as BannersType
  });
  const selectedStore = watch("storeId") ?? data?.storeId;
  const selectedCategory = watch("categoryId") ?? data?.categoryId;
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
      setValue("customerCategoryId", "");
    }
  }, [isSpecialDelivery, setValue]);

  useEffect(() => {
    if (isSpecialDelivery) return;

    if (selectedTargetType === "GENERAL") {
      setValue("storeId", "");
      setValue("categoryId", "");
      setValue("serviceId", "");
      setValue("zoneIds", []);
      setValue("customerCategoryId", "");
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
  }, [selectedTargetType, isSpecialDelivery, setValue]);

  const inputs = BannersInputs({
    selectedStore: isSpecialDelivery ? null : selectedStore,
    selectedCategory: isSpecialDelivery ? null : selectedCategory,
    selectedTargetType,
    isSpecialDelivery,
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

  const onSubmit = async (formData: BannersType) => {
    const targetType = isSpecialDelivery
      ? "SPECIAL_DRIVER"
      : typeof formData.targetType === "string" && formData.targetType
        ? formData.targetType
        : "GENERAL";

    const normalizedFormData: any = {
      ...formData,
      targetType,
    };
    delete normalizedFormData.specialDelivery;

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
      endpoint: ["banners"],
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
