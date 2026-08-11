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
  const [response, ordersResponse] = await Promise.all([
    fetchHelper({
      endPoint: ["branches", branchId],
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
  const scheduleData = Array.isArray(branch?.storeSchedule) ? branch.storeSchedule : [];
  const ordersData = Array.isArray(ordersResponse?.data) ? ordersResponse?.data : [];
  const branchName = getLocalizedName(branch?.name, locale);

  let isCurrentlyOpen = Boolean(branch?.isOpen);
  if (scheduleData && scheduleData.length > 0) {
    const now = new Date();
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const currentDay = days[now.getDay()];
    const currentHours = now.getHours().toString().padStart(2, '0');
    const currentMinutes = now.getMinutes().toString().padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMinutes}`;
    
    const extractTimeHHMM = (timeStr: string) => {
      if (!timeStr) return "00:00";
      if (timeStr.includes("T")) {
        const timePart = timeStr.split("T")[1];
        if (timePart) {
          const parts = timePart.split(":");
          if (parts[0] && parts[1]) {
            return `${parts[0]}:${parts[1]}`;
          }
        }
      }
      const parts = timeStr.split(":");
      if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
      }
      return timeStr;
    };

    isCurrentlyOpen = scheduleData.some((s: any) => {
      if (s.day !== currentDay) return false;
      const op = extractTimeHHMM(s.openingTime);
      const cl = extractTimeHHMM(s.closingTime);
      return currentTimeStr >= op && currentTimeStr <= cl;
    });
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{branchName}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={isCurrentlyOpen ? "default" : "outline"}>
            {t('open')}: {isCurrentlyOpen ? t("yes") : t("no")}
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
