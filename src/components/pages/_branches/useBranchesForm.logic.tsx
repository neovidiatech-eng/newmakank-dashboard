"use client";

import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { BranchesInputs } from "./branches.inputs";
import { BranchesSchema, type BranchesType } from "./branches.schema";

export default function useBranchesLogic({
  data,
  storeId
}: {
  data?: BranchesType;
  storeId?: number;
}) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = BranchesInputs({ hasStoreId: !!storeId });
  const { control, handleSubmit, reset } = useForm<BranchesType>({
    mode: "onSubmit",
    resolver: zodResolver(BranchesSchema(t)),
    defaultValues: extractFormDefaultInputs(inputs, data) as BranchesType
  });

  const onSubmit = async (formData: BranchesType) => {
    const { map, ...formattedData } = {
      ...formData,
      lat: formData.map.lat,
      isActive: formData.isActive,
      lng: formData.map.lng
    };
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formattedData }),
      endpoint: ["branches"],
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
