"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
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
    if (!data) {
      formData.storeId = storeId;
    }
    await formAction({
      data,
      formData: extractFormNameInputs({
        inputs,
        data: {
          ...formData
        }
      }),
      endpoint: ["storeCategories"],
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
