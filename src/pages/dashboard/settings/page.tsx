import type { JSX } from "react";
import { fetchHelper } from "@/api/fetch";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import type { SettingsItem } from "@/components/pages/_settings/settings.types";
import SettingsDomainNav from "@/components/pages/_settings/SettingsDomainNav";
import SettingsFormPage from "@/components/pages/_settings/settingsForm.page";
import { PROJECT_NAME } from "@/utils/config";
import { getTranslations } from "@/lib/i18n";

const DEFAULT_DOMAIN = "BUSINESS";

async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const domain = ((await searchParams)?.domain as string) ?? DEFAULT_DOMAIN;
  const response = await fetchHelper({
    endPoint: ["settings"],
    method: "GET",
    params: { domain }
  });

  const allSettings = (response?.data ?? []) as SettingsItem[];

  if (domain === "ORDER" && !allSettings.some(item => item.setting === "onlineDeliveryPackagingEnabled")) {
    allSettings.push({
      setting: "onlineDeliveryPackagingEnabled",
      name: "onlineDeliveryPackagingEnabled",
      value: "true",
      domain: "ORDER",
      enumValues: null,
      dataType: "BOOLEAN"
    });
  }

  const HIDDEN_SETTINGS = ["filterByZone", "storeNearestByKM"];
  const settings = allSettings.filter((item) => !HIDDEN_SETTINGS.includes(item.setting));

  return (
    <div className="flex flex-col gap-4">
      <CustomHeader />
      <div className="px-6">
        <SettingsDomainNav />
      </div>
      <div className="px-6 pb-8">
        <SettingsFormPage settings={settings} domain={domain} />
      </div>
    </div>
  );
}

export default page;
