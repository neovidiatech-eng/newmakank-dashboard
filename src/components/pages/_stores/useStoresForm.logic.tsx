"use client";

import { fetchHelper } from "@/api/fetch";
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
    handleSubmit,
    reset
  } = useForm<StoresType>({
    mode: "onSubmit",
    resolver: zodResolver(StoresSchema(t, isEdit)),
    defaultValues: {
      ...extractFormDefaultInputs(inputs, data),
      templateId: ((data as any)?.template?.id || data?.templateId || (data as any)?.storeTemplateId || (data as any)?.StoreTemplate?.id || (data as any)?.storeTemplate?.id) 
                  ? String((data as any)?.template?.id || data?.templateId || (data as any)?.storeTemplateId || (data as any)?.StoreTemplate?.id || (data as any)?.storeTemplate?.id) 
                  : "",
      map: data?.lat && data?.lng ? { lat: data.lat, lng: data.lng } : undefined
    } as StoresType
  });
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
    const { map, userEmail, userPass, userPhone, UserName, templateId, ...rest } = formData as any;

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
      // Required by the backend on create — default to 0 (first/unsorted) if left blank
      // rather than blocking store creation over a manual sort number nobody filled in.
      storeOrder:
        rest.storeOrder !== undefined && rest.storeOrder !== "" ? Number(rest.storeOrder) : 0,
      ...(!isEdit && templateId ? { templateId: Number(templateId) } : {}),
      User: JSON.stringify({
        name: UserName,
        email: userEmail,
        ...(userPass ? { password: userPass } : {}),
        phone: formattedPhone
      })
    };
    const res = await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formattedData }),
      endpoint: ["stores"],
      t,
      customReset: () => reset(extractFormDefaultInputs(inputs, undefined) as any)
    });

    // POST /stores alone does NOT copy the template's categories into the store — that
    // only happens via a separate call to /stores/:id/apply-template. Previously this was
    // only triggered when editing an existing store and changing its template, so a
    // brand-new store's chosen template was silently never applied (picked at creation,
    // required by the backend, but its categories never showed up).
    const oldTemplateId = ((data as any)?.template?.id || data?.templateId || (data as any)?.storeTemplateId || (data as any)?.StoreTemplate?.id || (data as any)?.storeTemplate?.id) ? String((data as any)?.template?.id || data?.templateId || (data as any)?.storeTemplateId || (data as any)?.StoreTemplate?.id || (data as any)?.storeTemplate?.id) : "";
    const storeId = (data as any)?.id ?? (res as any)?.data?.id;
    const shouldApplyTemplate = res?.success && templateId && storeId && (!isEdit || String(templateId) !== oldTemplateId);
    if (shouldApplyTemplate) {
      await fetchHelper({
        endPoint: ["stores", storeId, "applyTemplate"],
        method: "POST",
        body: { templateId: Number(templateId) }
      });
    }
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
