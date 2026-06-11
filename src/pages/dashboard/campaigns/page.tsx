import { fetchHelper } from "@/api/fetch";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { PROJECT_NAME } from "@/utils/config";
import { getTranslations } from "@/lib/i18n";
import CampaignsListClient from "./CampaignsListClient";

export default async function CampaignsPage({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const campaigns = await fetchHelper({
    endPoint: ["campaigns"],
    params: await searchParams,
    redirectOnUnauthorized: false
  });

  return (
    <>
      <CustomHeader />
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("campaignsCenter")}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t("campaignsPageIntro")}
          </p>
        </div>
        <CampaignsListClient
          data={Array.isArray(campaigns?.data) ? campaigns.data : []}
          total={campaigns?.total ?? 0}
        />
      </div>
    </>
  );
}
