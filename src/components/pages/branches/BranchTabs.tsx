import { branches } from "@/pages/dashboard/branches/types";
import OrdersColumns from "@/pages/dashboard/orders/OrdersColumns";
import CustomTabs, { TabItem } from "@/components/common/CustomTabs/custom-tab";
import MapPointerInput from "@/components/common/Inputs/map/MapPointerInput";
import TableBasic from "@/components/common/table/TableBasic";
import ScheduleGrid from "@/components/pages/_schedule/ScheduleGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/lib/navigation";
import { useLocale, useTranslations } from "@/lib/i18n";

type BranchTabsProps = {
  branch: branches;
  scheduleData: any[];
  ordersData: any[];
  ordersTotal: number;
  branchId: number;
};

function getLocalizedName(name: { ar: string; en: string }, locale: string) {
  if (locale === "ar") return name.ar || name.en;
  return name.en || name.ar;
}

export default function BranchTabs({
  branch,
  scheduleData,
  ordersData,
  ordersTotal,
  branchId
}: BranchTabsProps) {
  const t = useTranslations();
  const locale = useLocale();
  const ordersColumns = OrdersColumns();

  const storeName = branch?.Store?.name
    ? getLocalizedName(branch?.Store.name, locale)
    : t("Unknown");
  const scheduleCount = scheduleData.length;

  const overviewTab: TabItem = {
    value: "overview",
    label: t("Overview"),
    content: (
      <Card>
        <CardHeader>
          <CardTitle>{t("Branch Overview")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("Store")}</p>
              <p className="text-lg font-semibold">{storeName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("Phone")}</p>
              <p dir="ltr" className="text-lg font-semibold">
                {branch?.phone}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("Address")}</p>
              <p className="text-lg font-semibold">{branch?.address || t("Not Available")}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{branch?.rating}</p>
              <p className="text-sm text-muted-foreground">{t("Rating")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{branch?.review}</p>
              <p className="text-sm text-muted-foreground">{t("Reviews")}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{scheduleCount}</p>
              <p className="text-sm text-muted-foreground">{t("Schedule Entries")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  };

  const locationTab: TabItem = {
    value: "location",
    label: t("location"),
    content: (
      <Card>
        <CardHeader>
          <CardTitle>{t("Location Details")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("Latitude")}</span>
            <span dir="ltr">{branch?.lat}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("Longitude")}</span>
            <span dir="ltr">{branch?.lng}</span>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${branch?.lat},${branch?.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            {t("View on Map")}
          </a>
          <MapPointerInput
            value={{ lat: branch?.lat, lng: branch?.lng }}
            hideActions={true}
            className="mt-4"
          />
        </CardContent>
      </Card>
    )
  };

  const scheduleTab: TabItem = {
    value: "schedule",
    label: t("Schedule"),
    content: (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("Schedule")}</CardTitle>
          <Link href={`/schedule/create?branchId=${branchId}`}>
            <Button variant="outline" size="sm">
              {t("Create")}
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <ScheduleGrid data={scheduleData} branchId={String(branchId)} />
        </CardContent>
      </Card>
    )
  };

  const ordersTab: TabItem = {
    value: "orders",
    label: t("Orders"),
    content: (
      <TableBasic
        data={ordersData}
        columns={ordersColumns}
        cardHeader={t("Orders")}
        hideCreateNew
        tableActions={{
          onInfo: true
        }}
        pagination={{
          total: ordersTotal
        }}
      />
    )
  };

  const tabs: TabItem[] = [overviewTab, locationTab, scheduleTab, ordersTab];

  return <CustomTabs tabs={tabs} clearSearchParams />;
}
