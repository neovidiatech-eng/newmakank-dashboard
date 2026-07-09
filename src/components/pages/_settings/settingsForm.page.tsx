import CustomForm from "@/components/common/Form/CustomForm";
import type { SettingsItem } from "./settings.types";
import useSettingsLogic from "./useSettingsForm.logic";

// A card title with a bold heading + a short explanation of what the group controls —
// used so settings that look similar (e.g. restaurant delivery vs. independent custom
// delivery pricing) are never shown in the same unlabeled box.
function GroupTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span>{title}</span>
      <span className="text-sm font-normal text-muted-foreground">{description}</span>
    </div>
  );
}

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
          title: `${t("settings")} - ${t(domain)}`,
          width: 12
        },
        {
          id: "restaurant_delivery",
          title: <GroupTitle title={t("restaurantDeliverySettings")} description={t("restaurantDeliverySettingsDescription")} />,
          width: 12
        },
        {
          id: "custom_delivery",
          title: <GroupTitle title={t("customDeliverySettings")} description={t("customDeliverySettingsDescription")} />,
          width: 12
        },
        {
          id: "geofence",
          title: <GroupTitle title={t("geofenceSettings")} description={t("geofenceSettingsDescription")} />,
          width: 12
        },
        {
          id: "driver_assignment",
          title: <GroupTitle title={t("driverAssignmentSettings")} description={t("driverAssignmentSettingsDescription")} />,
          width: 12
        }
      ]}
      inputs={inputs}
    />
  );
}
