import { fetchHelper } from "@/api/fetch";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { PROJECT_NAME } from "@/utils/config";
import { getTranslations } from "@/lib/i18n";
import CampaignCreateClient from "./CampaignCreateClient";

export default async function CreateCampaignPage({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const id = Number((await searchParams)?.id);
  const campaign = id
    ? await fetchHelper({
        endPoint: ["campaigns", id],
        redirectOnUnauthorized: false
      })
    : null;

  return (
    <>
      <CustomHeader />
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("createCampaign")}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t("createCampaignPageIntro")}
          </p>
        </div>
        <CampaignCreateClient data={campaign?.data ?? null} />
      </div>
    </>
  );
}
