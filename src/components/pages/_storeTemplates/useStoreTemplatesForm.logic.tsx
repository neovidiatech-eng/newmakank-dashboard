"use client";

import useFormErrorLang from "@/components/common/Form/hooks/useFormErrorLang";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
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
    defaultValues: extractFormDefaultInputs(inputs, mappedData) as StoreTemplatesType
  });

  const onSubmit = async (formData: StoreTemplatesType) => {
    // Basic fields are extracted using standard utility
    const basePayload = extractFormNameInputs({ inputs, data: formData });

    // We must manually reconstruct the nested structure with translation objects
    const mappedCategories = formData.categories?.map((c) => ({
      ...c,
      name: { ar: c.nameAr, en: c.nameEn },
      services: c.services?.map((s) => ({
        ...s,
        name: { ar: s.nameAr, en: s.nameEn },
        description: { ar: s.descriptionAr, en: s.descriptionEn },
        sizes: s.sizes?.map((sz) => ({
          ...sz,
          name: { ar: sz.nameAr, en: sz.nameEn }
        })),
        addons: s.addons?.map((ad) => ({
          ...ad,
          name: { ar: ad.nameAr, en: ad.nameEn }
        }))
      }))
    }));

    const finalPayload = {
      ...basePayload,
      categories: mappedCategories
    };

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
