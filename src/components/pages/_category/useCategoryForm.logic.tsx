"use client";

import { endpointType } from "@/utils/endpoints";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
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

  const onSubmit = async (formData: CategoryType) => {
    if (data?.storeId) formData.storeId = data.storeId;
    
    // Resolve dynamic endpoint for templates categories
    let finalEndpoint = endpoint;
    const isTemplateFlow = !finalEndpoint;
    if (!finalEndpoint) {
      if (!isEdit && formData.templateId) {
        finalEndpoint = ["storeTemplates", Number(formData.templateId), "/categories" as any];
      } else {
        finalEndpoint = ["storeTemplatesCategories"];
      }
    }

    let payload: any;

    if (isTemplateFlow) {
      const imageIsFile = formData.image instanceof File;

      if (imageIsFile || formData.image === "") {
        // Send as FormData so the file is uploaded correctly or removed
        const fd = new FormData();
        fd.append("name", JSON.stringify({ ar: formData.nameAr, en: formData.nameEn }));
        fd.append("order", String(Number(formData.order)));
        if (imageIsFile) {
          fd.append("image", formData.image as unknown as File);
        } else if (formData.image === "") {
          fd.append("image", "null"); // Send the string "null" in case the backend explicitly checks for this
        }
        payload = fd;
      } else {
        payload = {
          name: {
            ar: formData.nameAr,
            en: formData.nameEn
          },
          image: formData.image === "" ? null : (typeof formData.image === "string" ? formData.image : null),
          order: Number(formData.order),
         };
      }
    } else {
      payload = extractFormNameInputs({ inputs, data: formData });
    }

    await formAction({
      data,
      formData: payload,
      endpoint: finalEndpoint,
      reset: reset,
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
