"use client";

import useFormErrorLang from "@/components/common/Form/hooks/useFormErrorLang";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { StoreTemplatesInputs } from "./storeTemplates.inputs";
import { StoreTemplatesSchema, type StoreTemplatesType } from "./storeTemplates.schema";

export default function useStoreTemplatesLogic({
  data
}: {
  data?: any;
}) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = StoreTemplatesInputs();

  // Map backend nested names to form flattened names
  const mappedData = data ? {
    ...data,
    nameAr: data.name?.ar || "",
    nameEn: data.name?.en || "",
    descriptionAr: data.description?.ar || "",
    descriptionEn: data.description?.en || "",
    categories: data.categories?.map((c: any) => ({
      ...c,
      nameAr: c.name?.ar || "",
      nameEn: c.name?.en || "",
      services: c.services?.map((s: any) => ({
        ...s,
        nameAr: s.name?.ar || "",
        nameEn: s.name?.en || "",
        descriptionAr: s.description?.ar || "",
        descriptionEn: s.description?.en || "",
        sizes: s.sizes?.map((sz: any) => ({
          ...sz,
          nameAr: sz.name?.ar || "",
          nameEn: sz.name?.en || ""
        })) || [],
        addons: s.addons?.map((ad: any) => ({
          ...ad,
          nameAr: ad.name?.ar || "",
          nameEn: ad.name?.en || ""
        })) || []
      })) || []
    })) || []
  } : undefined;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    register
  } = useForm<StoreTemplatesType>({
    mode: "onSubmit",
    resolver: zodResolver(StoreTemplatesSchema(t)),
    defaultValues: {
      ...(extractFormDefaultInputs(inputs, mappedData) as object),
      categories: mappedData?.categories || []
    } as StoreTemplatesType
  });

  const onSubmit = async (formData: StoreTemplatesType) => {
    const imageIsFile = formData.image instanceof File;

    let finalPayload: FormData | Record<string, unknown>;

    if (imageIsFile) {
      // Send as FormData so the image file is uploaded correctly
      const fd = new FormData();
      fd.append("name", JSON.stringify({ ar: formData.nameAr, en: formData.nameEn }));
      fd.append("description", JSON.stringify({ ar: formData.descriptionAr, en: formData.descriptionEn }));
      fd.append("order", String(formData.order ?? ""));
      fd.append("moduleType", String(formData.moduleType ?? ""));
      fd.append("image", formData.image as File);
      finalPayload = fd;
    } else {
      // No new image selected — send as JSON (existing image stays on server)
      finalPayload = {
        name: { ar: formData.nameAr, en: formData.nameEn },
        description: { ar: formData.descriptionAr, en: formData.descriptionEn },
        order: formData.order,
        moduleType: formData.moduleType,
      };
    }

    await formAction({
      data,
      formData: finalPayload,
      endpoint: ["storeTemplates"],
      reset: reset,
      t
    });
  };

  const formSubmit = handleSubmit(onSubmit);
  const { lang } = useFormErrorLang({
    errors,
    name: ["name", "description"]
  });

  return {
    lang,
    control,
    inputs,
    formSubmit,
    t,
    watch,
    setValue,
    register,
    errors
  };
}
