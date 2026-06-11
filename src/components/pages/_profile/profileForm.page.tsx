import CustomForm from "@/components/common/Form/CustomForm";
import type { ProfileType } from "./profile.schema";
import useProfileLogic from "./useProfileForm.logic";

export default function ProfileFormPage({ data }: { data?: ProfileType }) {
  const { inputs, t, control, formSubmit } = useProfileLogic({ data });

  return (
    <CustomForm
      handleSubmit={formSubmit}
      control={control}
      cardConfig={[
        {
          id: "lang",
          title: t("Profile Information"),
          multiLang: true,
          width: 6
        }
      ]}
      inputs={inputs}
    />
  );
}
