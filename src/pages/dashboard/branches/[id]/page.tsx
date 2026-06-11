import { fetchHelper } from "@/api/fetch";
import BranchTabs from "@/components/pages/branches/BranchTabs";
import { Badge } from "@/components/ui/badge";
import { getLocale, getTranslations } from "@/lib/i18n";
import type { branches } from "../types";

function getLocalizedName(name: { ar: string; en: string }, locale: string) {
  if (locale === "ar") return name.ar || name.en;
  return name.en || name.ar;
}

const page = async ({ params }: { params: Params }): Promise<JSX.Element> => {
  const t = await getTranslations();
  const locale = await getLocale();
  const branchId = Number((await params).id);
  const [response, scheduleResponse, ordersResponse] = await Promise.all([
    fetchHelper({
      endPoint: ["branches", branchId],
      method: "GET",
    }),
    fetchHelper({
      endPoint: ["schedule", branchId],
      method: "GET",
    }),
    fetchHelper({
      endPoint: ["orders"],
      method: "GET",
      params: { branchId },
    }),
  ]);

  if (!response?.data) {
    return <div className="p-8 text-center text-muted-foreground">{t("No Data Available")}</div>;
  }

  const branch = response.data as branches;
  const scheduleData = Array.isArray(scheduleResponse?.data) ? scheduleResponse?.data : [];
  const ordersData = Array.isArray(ordersResponse?.data) ? ordersResponse?.data : [];
  const branchName = getLocalizedName(branch?.name, locale);

  return (
    <div className="container mx-auto py-8 max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{branchName}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={branch?.isOpen ? "default" : "outline"}>
            {t('open')}: {branch?.isOpen ? t("yes") : t("no")}
          </Badge>
          {branch?.bestRated && <Badge variant="secondary">{t("Best Rated")}</Badge>}
          {branch?.temporarilyClosed && <Badge variant="outline">{t("Temporarily Closed")}</Badge>}
        </div>
      </div>

      <BranchTabs
        branch={branch}
        scheduleData={scheduleData}
        ordersData={ordersData}
        ordersTotal={ordersResponse?.total ?? ordersData.length}
        branchId={branchId}
      />
    </div>
  );
};

export default page;
