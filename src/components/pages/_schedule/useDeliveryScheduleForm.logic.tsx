"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DeliveryScheduleInputs } from "./deliverySchedule.inputs";
import { DeliveryScheduleSchema, type DeliveryScheduleType } from "./deliverySchedule.schema";

type DeliveryScheduleData = {
  id?: number | string;
  day?: string;
  openingTime?: string;
  closingTime?: string;
  requiredRadius?: number | string;
  requiredLat?: number | string;
  requiredLng?: number | string;
};



export default function useDeliveryScheduleLogic({
  deliveryId,
  data,
  onSuccess
}: {
  deliveryId: string;
  data?: DeliveryScheduleData;
  onSuccess?: () => void;
}) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = DeliveryScheduleInputs();

  const hasMap = data?.requiredLat !== undefined && data?.requiredLng !== undefined;
  const { control, handleSubmit, watch, setValue } = useForm<DeliveryScheduleType>({
    mode: "onSubmit",
    resolver: zodResolver(DeliveryScheduleSchema(t)),
    defaultValues: {
      ...extractFormDefaultInputs(inputs, data),
      days: data?.day ? [data.day] : [],
      deliveryId: Number(deliveryId),
      is24Hours: data?.openingTime === "00:00" && data?.closingTime === "23:59" ? ["true"] : [],
      map: hasMap
        ? {
            lat: Number(data?.requiredLat),
            lng: Number(data?.requiredLng)
          }
        : undefined
    } as DeliveryScheduleType
  });

  const is24Hours = watch("is24Hours" as any);
  const is24HoursChecked = Array.isArray(is24Hours) && is24Hours.includes("true");

  useEffect(() => {
    if (is24HoursChecked) {
      setValue("openingTime", "00:00");
      setValue("closingTime", "23:59");
    }
  }, [is24HoursChecked, setValue]);

  const onSubmit = async (formData: DeliveryScheduleType) => {
    let allSuccess = true;

    if ((formData as any).is24Hours?.includes("true")) {
      formData.openingTime = "00:00";
      formData.closingTime = "23:59";
    }

    for (const day of formData.days) {
      const payload = {
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        day: day,
        deliveryId: Number(deliveryId),
        requiredLat: Number(formData.map.lat),
        requiredLng: Number(formData.map.lng),
        requiredRadius: Number(formData.requiredRadius)
      };

      const response = await formAction({
        data: undefined,
        formData: extractFormNameInputs({ inputs, data: payload }),
        endpoint: ["deliverySchedule"],

        t
      });

      if (!response?.success) {
        allSuccess = false;
      }
    }

    if (allSuccess && onSuccess) {
      onSuccess();
    }
  };

  return {
    control,
    inputs,
    formSubmit: handleSubmit(onSubmit),
    t
  };
}
