import { fetchHelper } from "@/api/fetch";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from "@/lib/i18n";
import CampaignsListClient from "./CampaignsListClient";

export default async function CampaignsPage({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const params = await searchParams;

  const { search, ...apiParams } = params;

  const [campaignsResponse, notificationsResponse] = await Promise.all([
    fetchHelper({
      endPoint: ["campaigns"],
      params: { ...apiParams, type: "OFFER" },
      redirectOnUnauthorized: false
    }),
    fetchHelper({
      endPoint: ["adminNotifications"],
      params: apiParams,
      redirectOnUnauthorized: false
    })
  ]);

  let offersData = Array.isArray(campaignsResponse?.data) ? campaignsResponse.data : [];
  // Fallback filter just in case the API doesn't fully support filtering by type
  offersData = offersData.filter((item: any) => item.type === "OFFER");

  let notificationsData = Array.isArray(notificationsResponse?.data) ? notificationsResponse.data : [];

  if (search) {
    const s = String(search).toLowerCase();
    const filterFn = (item: any) => {
       const title = typeof item.title === 'string' ? item.title : JSON.stringify(item.title || '');
       const name = typeof item.name === 'string' ? item.name : JSON.stringify(item.name || '');
       return title.toLowerCase().includes(s) || name.toLowerCase().includes(s);
    };
    offersData = offersData.filter(filterFn);
    notificationsData = notificationsData.filter(filterFn);
  }

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
          offersTotal={search ? offersData.length : (campaignsResponse?.total ?? offersData.length)}
          notificationsData={notificationsData}
          notificationsTotal={search ? notificationsData.length : (notificationsResponse?.total ?? notificationsData.length)}
        />
      </div>
    </>
  );
}
