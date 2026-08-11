import { PriceAmount } from "@/components/PriceAmount";
import { fetchHelper } from "@/api/fetch";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import DeliveryProfileHeader from "@/components/pages/_delivery/DeliveryProfileHeader";
import DeliveryScheduleSection from "@/components/pages/_delivery/DeliveryScheduleSection";
import DeliveryDateFilterToolbar from "@/components/pages/_delivery/DeliveryDateFilterToolbar";
import DriverOrdersTable from "@/components/pages/_delivery/DriverOrdersTable";
import ResetWalletAction from "@/components/pages/_delivery/ResetWalletAction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Link } from "@/lib/navigation";
import { Banknote, Calendar, CheckCircle2, Clock3, PackageCheck, PackageX, Search } from "lucide-react";
import { getLocale, getTranslations } from "@/lib/i18n";

type LocalizedText = string | { ar?: string; en?: string } | null | undefined;

type DashboardOrder = {
  id: number;
  customerName?: string | null;
  customerPhone?: string | null;
  storeName?: LocalizedText;
  productsSummary?: Array<{ quantity?: number; name?: LocalizedText }>;
  invoiceTotal?: number | string | null;
  deliveryPrice?: number | string | null;
  notes?: string | null;
  status?: string | null;
  createdAt?: string | null;
  customDeliveryKind?: "PURCHASE" | "RESTAURANT" | "ONLINE" | null;
  zoneId?: number | null;
  zoneName?: LocalizedText;
  stations?: Array<{
    sequence: number;
    type: "PICKUP" | "DROPOFF";
    name?: string | null;
    lat?: number | null;
    lng?: number | null;
    zoneId?: number | null;
    zoneName?: LocalizedText;
    addressDetails?: string | null;
    contactPhone?: string | null;
  }>;
};

type DeliveryDashboard = {
  profile?: Record<string, any>;
  statistics?: {
    selectedDate?: string;
    acceptedOrders?: number;
    rejectedOrders?: number;
    deliveredOrders?: number;
  };
  financialSummary?: {
    totalOrdersAmount?: number;
    deliveryFees?: number;
    adminCommission?: number;
  };
  acceptanceSummary?: {
    acceptedOrders?: number;
    rejectedOrders?: number;
  };
  orders?: DashboardOrder[];
};

function getLocalizedText(value: LocalizedText, locale: string) {
  if (!value) return "—";
  if (typeof value === "string") return value;
  return value[locale as "ar" | "en"] || value.ar || value.en || "—";
}

function formatMoney(value: number | string | null | undefined, locale: string) {
  const numberValue = Number(value ?? 0);
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    maximumFractionDigits: 2
  }).format(Number.isFinite(numberValue) ? numberValue : 0);
}

function formatProducts(products: DashboardOrder["productsSummary"], locale: string) {
  if (!products?.length) return "—";
  return products
    .map(product => `${product.quantity ?? 1}× ${getLocalizedText(product.name, locale)}`)
    .join("، ");
}

function getStatusVariant(status?: string | null): "success" | "warning" | "destructive" | "secondary" {
  if (status === "DELIVERED") return "success";
  if (["REJECTED", "CANCELLED", "PAYMENT_FAILD", "PAYMENT_FAILED"].includes(String(status))) return "destructive";
  if (["ON_THE_WAY", "READY_PICKUP", "PREPARING"].includes(String(status))) return "warning";
  return "secondary";
}

const page = async ({ params, searchParams }: { params: Params; searchParams: SearchParams }) => {
  const t = await getTranslations();
  const locale = await getLocale();
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const deliveryId = Number(resolvedParams.id);
  const selectedDate = typeof resolvedSearchParams.date === "string" ? resolvedSearchParams.date : undefined;
  const fromDate = typeof resolvedSearchParams.fromDate === "string" ? resolvedSearchParams.fromDate : undefined;
  const toDate = typeof resolvedSearchParams.toDate === "string" ? resolvedSearchParams.toDate : undefined;

  const dashboardParams: Record<string, string> = {};
  if (selectedDate) dashboardParams.date = selectedDate;
  if (fromDate) dashboardParams.fromDate = fromDate;
  if (toDate) dashboardParams.toDate = toDate;

  const [response, scheduleResponse] = await Promise.all([
    fetchHelper<DeliveryDashboard>({
      endPoint: ["delivery", deliveryId, "deliveryDashboard"],
      method: "GET",
      params: Object.keys(dashboardParams).length > 0 ? dashboardParams : undefined,
      redirectOnUnauthorized: false
    }),
    fetchHelper({
      endPoint: ["delivery", deliveryId],
      method: "GET",
      redirectOnUnauthorized: false
    })
  ]);

  const dashboard = response?.data;
  if (!dashboard?.profile) {
    return <div className="p-8 text-center text-muted-foreground">{t("No Data Available")}</div>;
  }

  // Extract schedules from DeliveryDetails (handles both object & array structures safely)
  const deliveryDetails = (scheduleResponse as any)?.DeliveryDetails || 
                          (scheduleResponse as any)?.data?.DeliveryDetails || 
                          (scheduleResponse as any)?.data?.data?.DeliveryDetails ||
                          (scheduleResponse as any)?.data ||
                          scheduleResponse;

  const scheduleData = Array.isArray(deliveryDetails)
    ? (deliveryDetails[0]?.Schedule || [])
    : (deliveryDetails?.Schedule || (scheduleResponse as any)?.Schedule || []);

  const statistics = dashboard.statistics ?? {};
  const financialSummary = dashboard.financialSummary ?? {};
  const acceptanceSummary = dashboard.acceptanceSummary ?? {};
  const orders = dashboard.orders ?? [];
  const rejectedOrders = orders.filter(order => ["REJECTED", "CANCELLED", "PAYMENT_FAILD", "PAYMENT_FAILED"].includes(String(order.status)));
  const acceptedOrders = orders.filter(order => !["REJECTED", "CANCELLED", "PAYMENT_FAILD", "PAYMENT_FAILED"].includes(String(order.status)));
  const dateValue = selectedDate || statistics.selectedDate;

  return (
    <>
      <CustomHeader />
      <div className="container mx-auto max-w-6xl space-y-6 py-8">
        <DeliveryProfileHeader data={dashboard.profile as any} />

        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>{t("Working hours")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DeliveryScheduleSection data={scheduleData as any} deliveryId={String(deliveryId)} />
          </CardContent>
        </Card>

        <DeliveryDateFilterToolbar
          currentFromDate={fromDate}
          currentToDate={toDate}
          currentDate={selectedDate}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-border/60 bg-card/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("Accepted Orders")}</p>
                  <p className="mt-2 text-3xl font-bold">{statistics.acceptedOrders ?? acceptedOrders.length}</p>
                </div>
                <PackageCheck className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("Unaccepted Orders")}</p>
                  <p className="mt-2 text-3xl font-bold">{statistics.rejectedOrders ?? rejectedOrders.length}</p>
                </div>
                <PackageX className="h-8 w-8 text-rose-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("Delivered Orders")}</p>
                  <p className="mt-2 text-3xl font-bold">{statistics.deliveredOrders ?? 0}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t("Selected Date")}</p>
                  <p className="mt-2 text-base font-semibold">
                    {fromDate && toDate ? `${fromDate} → ${toDate}` : dateValue ? new Date(dateValue).toLocaleDateString(locale) : t("Today")}
                  </p>
                </div>
                <Clock3 className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/60 bg-card/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5 text-primary" />
              {t("Delivery Finance")}
            </CardTitle>
            <ResetWalletAction deliveryId={deliveryId} />
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-2xl border bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">{t("Orders Amount")}</p>
              <p className="mt-2 text-xl font-bold"><PriceAmount value={financialSummary.totalOrdersAmount} /></p>
            </div>
            <div className="rounded-2xl border bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">{t("Delivery Fees")}</p>
              <p className="mt-2 text-xl font-bold"><PriceAmount value={financialSummary.deliveryFees} /></p>
            </div>
            <div className="rounded-2xl border bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">{t("Admin Commission")}</p>
              <p className="mt-2 text-xl font-bold"><PriceAmount value={financialSummary.adminCommission} /></p>
            </div>
            <div className="rounded-2xl border bg-violet-50/40 dark:bg-violet-950/20 border-violet-200 p-4">
              <p className="text-xs text-violet-700 dark:text-violet-300 font-semibold">رصيد المحفظة</p>
              <p className="mt-2 text-xl font-bold text-violet-900 dark:text-violet-100"><PriceAmount value={financialSummary.walletBalance} /></p>
            </div>
            <div className="rounded-2xl border bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 p-4">
              <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold">كاش طرف المندوب (COD)</p>
              <p className="mt-2 text-xl font-bold text-amber-900 dark:text-amber-100"><PriceAmount value={financialSummary.collectedCash} /></p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>{t("Order Acceptance Summary")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-emerald-800 dark:text-emerald-100">{t("Accepted Orders")}</p>
                  <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">{t("Orders assigned or still active with this delivery")}</p>
                </div>
                <Badge variant="success">{acceptanceSummary.acceptedOrders ?? acceptedOrders.length}</Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-rose-800 dark:text-rose-100">{t("Unaccepted Orders")}</p>
                  <p className="mt-1 text-sm text-rose-700 dark:text-rose-300">{t("Rejected or cancelled orders for this delivery")}</p>
                </div>
                <Badge variant="destructive">{acceptanceSummary.rejectedOrders ?? rejectedOrders.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <DriverOrdersTable deliveryId={deliveryId} />
      </div>
    </>
  );
};

export default page;
