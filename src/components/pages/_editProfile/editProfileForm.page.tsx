"use client";

import CustomForm from "@/components/common/Form/CustomForm";

import { useRouter } from "@/lib/navigation";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { EditProfileInputs } from "./editProfile.inputs";
import { EditProfileSchema, EditProfileType } from "./editProfile.schema";

export default function EditProfileFormPage({
  data
}: {
  data?: EditProfileType;
}) {
  const router = useRouter();
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = EditProfileInputs();
  const {
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields }
  } = useForm<EditProfileType>({
    mode: "onSubmit",
    resolver: zodResolver(EditProfileSchema()),
    defaultValues: extractFormDefaultInputs(inputs, data)
  });

  const onSubmit = async (formData: EditProfileType) => {
    const formattedData = extractFormNameInputs({
      inputs,
      data: formData,
      dirtyFields
    });

    const res = await formAction({
      data: data,
      noId: true,
      formData: formattedData,
      endpoint: ["my-profile"],
      reset: reset,

      t
    });

    if (res.success === true) {
      router.push(`/dashboard`);
    }
  };

  return (
    <CustomForm
      handleSubmit={handleSubmit(onSubmit)}
      control={control}
      cardConfig={[
        {
          id: "info",
          title: t("Basic information"),
          multiLang: false,
          icon: <User />,
          width: 6
        }
      ]}
      btnName={t("Save")}
      inputs={inputs}
    />
  );
}
