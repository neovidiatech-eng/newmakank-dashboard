"use client";

import { endpointType } from "@/utils/endpoints";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CategoryInputs } from "./category.inputs";
import { CategorySchema, type CategoryType } from "./category.schema";

export default function useCategoryLogic({
  data,
  endpoint
}: {
  data?: CategoryType;
  endpoint?: endpointType;
}) {
  const t = useTranslations();
  const formAction = useFormAction();
  const hasStoreId = Boolean(data?.storeId);
  const isEdit = Boolean(data);
  const inputs = CategoryInputs({ hasStoreId, isEdit });
  const {
    control,
    handleSubmit,
    reset
  } = useForm<CategoryType>({
    mode: "onSubmit",
    resolver: zodResolver(CategorySchema(t)),
    defaultValues: extractFormDefaultInputs(inputs, data) as CategoryType
  });

  useEffect(() => {
    if (data) {
      reset(extractFormDefaultInputs(inputs, data) as CategoryType);
    }
  }, [data, reset]);

  const onSubmit = async (formData: CategoryType) => {
    if (data?.storeId) formData.storeId = data.storeId;

    // Resolve dynamic endpoint
    // isCustomStoreCategory: true  → lives in Category table → use storeCategories
    // isCustomStoreCategory: false → lives in TemplateCategory table → use storeTemplatesCategories
    // Fall back to storeId presence (same signal CategoryInputs/CategoryColumns use) in case
    // isCustomStoreCategory is ever missing from the fetched item, so a store category can
    // never be accidentally PATCHed to the template-categories endpoint (or vice versa).
    const isCustom = (data as any)?.isCustomStoreCategory === true || hasStoreId;
    const isTemplateFlow = !endpoint;

    let finalEndpoint = endpoint;
    if (!finalEndpoint) {
      if (!isEdit && formData.templateId) {
        // Create: POST /api/store-templates/:templateId/categories
        finalEndpoint = ["storeTemplates", Number(formData.templateId), "/categories" as any];
      } else if (isEdit && isCustom) {
        // Edit custom store category (Category table): PATCH /api/store-categories/:id
        finalEndpoint = ["storeCategories"];
      } else {
        // Edit real template category (TemplateCategory table): PATCH /api/store-templates/categories/:id
        finalEndpoint = ["storeTemplatesCategories"];
      }
    }

    let payload: any;

    if (isTemplateFlow) {
      const imageIsFile = formData.image instanceof File;
      const fd = new FormData();
      fd.append("name", JSON.stringify({ ar: formData.nameAr, en: formData.nameEn }));
      fd.append("order", String(Number(formData.order)));
      
      if (imageIsFile) {
        fd.append("image", formData.image as unknown as File);
      } else if (formData.image === "") {
        fd.append("image", "null");
      }
      
      payload = fd;
    } else {
      payload = extractFormNameInputs({ inputs, data: formData });
    }

    await formAction({
      data,
      formData: payload,
      endpoint: finalEndpoint,
      customReset: () => reset(extractFormDefaultInputs(inputs, undefined) as any),
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
