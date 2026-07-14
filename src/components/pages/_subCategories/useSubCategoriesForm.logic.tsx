"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { SubCategoriesInputs } from "./subCategories.inputs";
import { SubCategoriesSchema, type SubCategoriesType } from "./subCategories.schema";

export default function useSubCategoriesLogic({
  data,
  storeId
}: {
  data?: SubCategoriesType;
  storeId: number;
}) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = SubCategoriesInputs();
  const { control, handleSubmit, reset } = useForm<SubCategoriesType>({
    mode: "onSubmit",
    resolver: zodResolver(SubCategoriesSchema(t)),
    defaultValues: extractFormDefaultInputs(inputs, data) as SubCategoriesType
  });

  const onSubmit = async (formData: SubCategoriesType) => {
    const imageValue = (formData as any).image;
    const hasNewFile = imageValue instanceof File || imageValue instanceof Blob;
    const hasExistingUrl = typeof imageValue === "string" && imageValue.trim() !== "";

    let payload: FormData | Record<string, unknown>;

    if (hasNewFile || hasExistingUrl) {
      // Use multipart/form-data to carry the file
      const body = new FormData();
      body.append("name", JSON.stringify({ ar: (formData as any).nameAr, en: (formData as any).nameEn }));
      body.append("order", String(formData.order ?? 0));
      if (!data) {
        body.append("storeId", String(storeId));
      }
      if (hasNewFile) {
        body.append("image", imageValue);
      }
      payload = body as any;
    } else {
      // No image — send plain JSON as before
      payload = {
        name: { ar: (formData as any).nameAr, en: (formData as any).nameEn },
        order: formData.order,
        ...(!data ? { storeId } : {})
      };
    }

    await formAction({
      data,
      formData: payload as any,
      endpoint: ["storeCategories"],
      reset,
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
