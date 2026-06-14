"use client";

import useFormErrorLang from "@/components/common/Form/hooks/useFormErrorLang";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { StoresInputs } from "./stores.inputs";
import { StoresSchema, type StoresType } from "./stores.schema";

export default function useStoresLogic({ data }: { data?: StoresType }) {
  const t = useTranslations();
  const formAction = useFormAction();
  const isEdit = !!data;
  const inputs = StoresInputs({ isEdit });
  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm<StoresType>({
    mode: "onSubmit",
    resolver: zodResolver(StoresSchema(t, isEdit)),
    defaultValues: {
      ...extractFormDefaultInputs(inputs, data),
      map: data?.lat && data?.lng ? { lat: data.lat, lng: data.lng } : undefined
    } as StoresType
  });
  console.log(data, "sda2edas");
  const onSubmit = async (formData: StoresType) => {
    if (!(data as any)?.id) {
      const hasImage =
        formData.logo &&
        (formData.logo instanceof File ||
          formData.logo instanceof Blob ||
          (Array.isArray(formData.logo) && formData.logo.length > 0) ||
          (typeof formData.logo === "string" && formData.logo.trim() !== ""));

      if (!hasImage) {
        try {
          const response = await fetch("/logo.png");
          if (response.ok) {
            const blob = await response.blob();
            formData.logo = new File([blob], "logo.png", { type: "image/png" });
          }
        } catch (error) {
          console.error("Failed to fetch default logo.png:", error);
        }
      }
    }
    if (!(data as any)?.id) {
      const hasImage =
        formData.cover &&
        (formData.cover instanceof File ||
          formData.cover instanceof Blob ||
          (Array.isArray(formData.cover) && formData.cover.length > 0) ||
          (typeof formData.cover === "string" && formData.cover.trim() !== ""));

      if (!hasImage) {
        try {
          const response = await fetch("/logo.png");
          if (response.ok) {
            const blob = await response.blob();
            formData.cover = new File([blob], "logo.png", { type: "image/png" });
          }
        } catch (error) {
          console.error("Failed to fetch default logo.png:", error);
        }
      }
    }
    const { map, userEmail, userPass, userPhone, UserName, ...rest } = formData;

    let formattedPhone = userPhone;
    if (formattedPhone && !isEdit) {
      formattedPhone = formattedPhone.replace(/^(\+20|0020|20)/, "");
      if (formattedPhone.startsWith("0")) {
        formattedPhone = formattedPhone.substring(1);
      }
      formattedPhone = "+20" + formattedPhone;
    }

    const formattedData = {
      ...rest,
      lat: map?.lat,
      lng: map?.lng,
      ...(!isEdit
        ? {
          User: JSON.stringify({
            name: UserName,
            email: userEmail,
            password: userPass,
            phone: formattedPhone
          })
        }
        : {})
    };
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formattedData }),
      endpoint: ["stores"],
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
