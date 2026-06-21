import { fetchHelper } from "@/api/fetch";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from "@/lib/i18n";
import CampaignsListClient from "./CampaignsListClient";

export default async function CampaignsPage({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const params = await searchParams;

  const [campaignsResponse, notificationsResponse] = await Promise.all([
    fetchHelper({
      endPoint: ["campaigns"],
      params: { ...params, type: "OFFER" },
      redirectOnUnauthorized: false
    }),
    fetchHelper({
      endPoint: ["adminNotifications"],
      params,
      redirectOnUnauthorized: false
    })
  ]);

  let offersData = Array.isArray(campaignsResponse?.data) ? campaignsResponse.data : [];
  // Fallback filter just in case the API doesn't fully support filtering by type
  offersData = offersData.filter((item: any) => item.type === "OFFER");

  const notificationsData = Array.isArray(notificationsResponse?.data) ? notificationsResponse.data : [];

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
          offersData={offersData}
          offersTotal={campaignsResponse?.total ?? offersData.length}
          notificationsData={notificationsData}
          notificationsTotal={notificationsResponse?.total ?? notificationsData.length}
        />
      </div>
    </>
  );
}
