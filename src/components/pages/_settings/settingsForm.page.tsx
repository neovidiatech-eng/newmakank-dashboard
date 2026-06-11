import CustomForm from "@/components/common/Form/CustomForm";
import type { SettingsItem } from "./settings.types";
import useSettingsLogic from "./useSettingsForm.logic";

export default function SettingsFormPage({
  settings,
  domain
}: {
  settings: SettingsItem[];
  domain: string;
}) {
  const { inputs, t, control, formSubmit } = useSettingsLogic({ settings, domain });

  return (
    <CustomForm
      handleSubmit={formSubmit}
      control={control}
      cardConfig={[
        {
          id: "settings",
          title: `${t("settings")} - ${domain}`,
          width: 12
        }
      ]}
      inputs={inputs}
    />
  );
}
