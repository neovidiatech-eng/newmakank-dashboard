import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Banknote, Users, Store, Bike, Receipt, BadgePercent, Coins, HandCoins, 
  Truck, Info, CalendarClock, Wallet, PiggyBank, Landmark, Clock3, 
  TrendingUp, TrendingDown, Calendar, UserCheck, UserX, Clock, Award
} from "lucide-react";
import { useTranslations, useLocale } from "@/lib/i18n";
import { TablePagination } from "@/components/common/table/tableHelperComponents/TablePagination";
import ResetPeriodButton from "@/components/pages/_dashboard/ResetPeriodButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function formatMoney(value: number | string | null | undefined, locale: string) {
  const numberValue = Number(value ?? 0);
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    maximumFractionDigits: 2
  }).format(Number.isFinite(numberValue) ? numberValue : 0);
}

export default function DashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const [activeTab, setActiveTab] = useState("overview");

  // 1. Overview API Calls
  const { data: statsResponse } = useApiQuery({
    queryKey: ["statistics"],
    endPoint: ["statistics"]
  });

  const { data: ordersResponse } = useApiQuery({
    queryKey: ["orders", { limit, page }],
    endPoint: ["orders"],
    params: { limit, page }
  });

  const { data: financialOverviewResponse } = useApiQuery({
    queryKey: ["financialOverviewAllTime"],
    endPoint: ["financialOverview"],
    params: {}
  });

  const { data: deliveryResponse } = useApiQuery({
    queryKey: ["delivery", { limit: 1 }],
    endPoint: ["delivery"],
    params: { limit: 1 }
  });

  const { data: openStoresResponse } = useApiQuery({
    queryKey: ["stores", { limit: 1 }],
    endPoint: ["stores"],
    params: { limit: 1 }
  });

  // 2. New Store Analytics API Calls
  const { data: salesAnalyticsResponse } = useApiQuery({
    queryKey: ["salesAnalytics"],
    endPoint: ["statistics", "store", "sales-analytics"],
    enabled: activeTab === "salesAnalytics"
  });

  const { data: employeePerformanceResponse } = useApiQuery({
    queryKey: ["employeePerformance"],
    endPoint: ["statistics", "store", "employee-performance"],
    enabled: activeTab === "employeePerformance"
  });

  // Data mapping for Overview
  const stats = (statsResponse?.data ?? {}) as any;
  const orders = (ordersResponse?.data?.data ?? ordersResponse?.data ?? []) as any[];
  const totalCustomers = stats.totalCustomers ?? 0;
  const totalStores = stats.totalStores ?? 0;
  const totalDelivery = deliveryResponse?.total ?? deliveryResponse?.data?.length ?? deliveryResponse?.data?.data?.length ?? stats.totalDelivery ?? 0;
  const openStores = openStoresResponse?.total ?? openStoresResponse?.data?.length ?? openStoresResponse?.data?.data?.length ?? 0;

  const allTimeRevenue = financialOverviewResponse?.data?.revenue || {};
  const allTimeCommission = financialOverviewResponse?.data?.commission || {};
  const financialData = {
    totalAmount: allTimeRevenue.totalRevenue ?? 0,
    productPrice: allTimeRevenue.productPrice ?? 0,
    storeCommission: allTimeCommission.storeCommission ?? 0,
    globalCommission: allTimeRevenue.globalCommission ?? 0,
    taxes: allTimeRevenue.tax ?? 0,
    deliveryPrice: allTimeRevenue.shipping ?? 0,
  };

  // Helper to extract localized JSON strings/objects
  const getLocalizedName = (nameObj: any) => {
    if (!nameObj) return "—";
    if (typeof nameObj === "string") return nameObj;
    return nameObj[locale] || nameObj.ar || nameObj.en || "—";
  };

  // Data mapping for Sales Analytics
  const salesData = salesAnalyticsResponse?.data || {};
  const peakHour = salesData?.peakOrderHour?.hour !== undefined 
    ? `${String(salesData.peakOrderHour.hour).padStart(2, "0")}:00` 
    : "—";
  const peakOrders = salesData?.peakOrderHour?.orderCount ?? 0;
  const bestDay = salesData?.bestSalesDay?.date ?? "—";
  const bestDayRev = salesData?.bestSalesDay?.revenue ?? 0;
  const mostProfitableName = getLocalizedName(salesData?.mostProfitableProduct?.name);
  const mostProfitableRev = salesData?.mostProfitableProduct?.revenue ?? 0;
  const leastSoldName = getLocalizedName(salesData?.leastSoldProduct?.name);
  const leastSoldQty = salesData?.leastSoldProduct?.quantitySold ?? 0;

  // Data mapping for Employee Performance
  const empData = employeePerformanceResponse?.data || {};
  const mostAcceptedName = empData?.mostOrdersAccepted?.name ?? "—";
  const mostAcceptedCount = empData?.mostOrdersAccepted?.ordersAccepted ?? 0;
  const fastestName = empData?.fastestEmployee?.name ?? "—";
  const fastestPrep = empData?.fastestEmployee?.avgPrepMinutes ?? 0;
  const mostRejectedName = empData?.mostOrdersRejected?.name ?? "—";
  const mostRejectedCount = empData?.mostOrdersRejected?.ordersRejected ?? 0;
  const byEmployee = empData?.byEmployee || [];

  return (
    <div className="flex flex-col gap-8 w-full mx-auto px-4 py-6 defer-paint">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Header and Tab Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200/80 dark:border-gray-800 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {activeTab === "overview" && (t("Overview") || "لوحة الأداء")}
              {activeTab === "salesAnalytics" && (t("Sales Analytics") || "تحليل المبيعات")}
              {activeTab === "employeePerformance" && (t("Employee Performance") || "تقييم الموظفين")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === "overview" && (t("Overview description") || "متابعة أداء المتجر والطلبات الواردة والأرباح.")}
              {activeTab === "salesAnalytics" && (t("Sales analytics description") || "تحليل شامل لقمم مبيعات المتجر، الساعات والمنتجات الأكثر ربحية.")}
              {activeTab === "employeePerformance" && (t("Employee performance description") || "مراجعة كفاءة الموظفين في قبول وتجهيز الطلبات خلال آخر 30 يوماً.")}
            </p>
          </div>
          <TabsList className="bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-lg p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 font-semibold px-4 py-2 text-sm rounded-md transition-all">
              {t("Overview") || "الرئيسية"}
            </TabsTrigger>
            <TabsTrigger value="salesAnalytics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 font-semibold px-4 py-2 text-sm rounded-md transition-all">
              {t("Sales Analytics") || "تحليل المبيعات"}
            </TabsTrigger>
            <TabsTrigger value="employeePerformance" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 font-semibold px-4 py-2 text-sm rounded-md transition-all">
              {t("Employee Performance") || "تقييم الموظفين"}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- OVERVIEW TAB --- */}
        <TabsContent value="overview" className="space-y-8 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to={`/${locale}/customers`} className="block transition-transform hover:scale-[1.02]">
              <Card className="border-border/60 shadow-sm bg-sky-50 dark:bg-sky-950/20 hover:border-sky-300">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-sky-600 dark:text-sky-400">{t("Total Customers")}</p>
                    <h3 className="text-3xl font-bold text-sky-900 dark:text-sky-100 mt-2">{totalCustomers}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center">
                    <Users className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to={`/${locale}/delivery`} className="block transition-transform hover:scale-[1.02]">
              <Card className="border-border/60 shadow-sm bg-violet-50 dark:bg-violet-950/20 hover:border-violet-300">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-violet-600 dark:text-violet-400">{t("Total Drivers")}</p>
                    <h3 className="text-3xl font-bold text-violet-900 dark:text-violet-100 mt-2">{totalDelivery}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                    <Bike className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to={`/${locale}/stores`} className="block transition-transform hover:scale-[1.02]">
              <Card className="border-border/60 shadow-sm bg-amber-50 dark:bg-amber-950/20 hover:border-amber-300">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">{t("Total Stores")}</p>
                    <h3 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-2">{openStores}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                    <Store className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Banknote className="h-6 w-6 text-primary" />
                  {t("Financials")}
                </h2>
                <p className="text-sm text-muted-foreground pr-8">
                  {t("financialsSectionDescription")}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ResetPeriodButton endPoint={["resetPeriod"]} label={t("Reset Period")} />
                <ResetPeriodButton endPoint={["storeResetPeriod"]} label={t("Reset Store Period")} variant="secondary" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-border/60 shadow-sm bg-emerald-50/50 dark:bg-emerald-950/10 hover:border-emerald-300 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{t("Total Amount")}</p>
                    <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-2">
                      {formatMoney(financialData.totalAmount, locale)} <span className="text-sm">{t("EGP")}</span>
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm bg-blue-50/50 dark:bg-blue-950/10 hover:border-blue-300 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{t("Products Price")}</p>
                    <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-2">
                      {formatMoney(financialData.productPrice, locale)} <span className="text-sm">{t("EGP")}</span>
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Receipt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm bg-orange-50/50 dark:bg-orange-950/10 hover:border-orange-300 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">{t("Store Commission")}</p>
                    <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-300 mt-2">
                      {formatMoney(financialData.storeCommission, locale)} <span className="text-sm">{t("EGP")}</span>
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                    <HandCoins className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm bg-teal-50/50 dark:bg-teal-950/10 hover:border-teal-300 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-teal-600 dark:text-teal-400">{t("Global Commission")}</p>
                    <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-300 mt-2">
                      {formatMoney(financialData.globalCommission, locale)} <span className="text-sm">{t("EGP")}</span>
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                    <BadgePercent className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm bg-rose-50/50 dark:bg-rose-950/10 hover:border-rose-300 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{t("Taxes")}</p>
                    <h3 className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-2">
                      {formatMoney(financialData.taxes, locale)} <span className="text-sm">{t("EGP")}</span>
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
                    <Landmark className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm bg-indigo-50/50 dark:bg-indigo-950/10 hover:border-indigo-300 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{t("Delivery Charge")}</p>
                    <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mt-2">
                      {formatMoney(financialData.deliveryPrice, locale)} <span className="text-sm">{t("EGP")}</span>
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="overflow-hidden border-border/50 shadow-sm bg-white dark:bg-slate-950">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                {t("Recent Orders")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">{t("orderId")}</TableHead>
                    <TableHead className="text-center">{t("driverName")}</TableHead>
                    <TableHead className="text-center">{t("Total Amount")}</TableHead>
                    <TableHead className="text-center">{t("productPrice")}</TableHead>
                    <TableHead className="text-center">{t("storeCommission")}</TableHead>
                    <TableHead className="text-center">{t("globalCommission")}</TableHead>
                    <TableHead className="text-center">{t("Taxes")}</TableHead>
                    <TableHead className="text-center">{t("deliveryPrice")}</TableHead>
                    <TableHead className="text-center">{t("Details")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                        {t("No Data")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map(order => {
                      const deliveryName = order.deliveryName ?? order.Delivery?.user?.personName ?? order.Delivery?.user?.name ?? "—";
                      const total = order.totalAmount ?? 0;
                      const productPrice = order.productPrice ?? 0;
                      const storeCommission = order.storeCommission ?? 0;
                      const globalCommission = order.globalCommission ?? 0;
                      const tax = order.tax ?? 0;
                      const deliveryPrice = order.shipping ?? 0;

                      return (
                        <TableRow key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                          <TableCell className="text-center font-medium">
                            <Link to={`/${locale}/orders/${order.id}`} className="text-primary hover:underline font-bold">
                              #{order.id}
                            </Link>
                          </TableCell>
                          <TableCell className="text-center">
                            {deliveryName !== "—" ? (
                              <Badge variant="outline" className="bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400">{deliveryName}</Badge>
                            ) : "—"}
                          </TableCell>
                          <TableCell className="text-center font-bold text-emerald-600 dark:text-emerald-400">
                            {formatMoney(total, locale)}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {formatMoney(productPrice, locale)}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {formatMoney(storeCommission, locale)}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {formatMoney(globalCommission, locale)}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {formatMoney(tax, locale)}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {formatMoney(deliveryPrice, locale)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Link to={`/${locale}/orders/${order.id}`} className="text-muted-foreground hover:text-primary transition-colors flex justify-center">
                              <Info className="h-5 w-5" />
                            </Link>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>

              {ordersResponse?.total !== undefined && orders.length > 0 && (
                <div className="p-4 border-t border-border/50">
                  <TablePagination pagination={{ total: ordersResponse.total }} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- SALES ANALYTICS TAB --- */}
        <TabsContent value="salesAnalytics" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Best Sales Day */}
            <Card className="border-border/60 shadow-sm bg-gradient-to-br from-amber-50/50 to-amber-100/20 dark:from-amber-950/10 dark:to-amber-900/5 hover:border-amber-300 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                    {t("Best Sales Day") || "أفضل يوم مبيعات"}
                  </p>
                  <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-2">
                    {bestDayRev ? formatMoney(bestDayRev, locale) : "0"} <span className="text-sm">{t("EGP")}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {bestDay}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                  <CalendarClock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </CardContent>
            </Card>

            {/* Peak Order Hour */}
            <Card className="border-border/60 shadow-sm bg-gradient-to-br from-indigo-50/50 to-indigo-100/20 dark:from-indigo-950/10 dark:to-indigo-900/5 hover:border-indigo-300 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {t("Peak Order Hour") || "ساعة ذروة الطلبات"}
                  </p>
                  <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mt-2">
                    {peakHour}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {peakOrders} {t("orders") || "طلبات"}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <Clock3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </CardContent>
            </Card>

            {/* Most Profitable Product */}
            <Card className="border-border/60 shadow-sm bg-gradient-to-br from-emerald-50/50 to-emerald-100/20 dark:from-emerald-950/10 dark:to-emerald-900/5 hover:border-emerald-300 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {t("Most Profitable Product") || "المنتج الأكثر ربحاً"}
                  </p>
                  <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mt-2 line-clamp-1">
                    {mostProfitableName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-3 w-3" /> {formatMoney(mostProfitableRev, locale)} {t("EGP")}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                  <Coins className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardContent>
            </Card>

            {/* Least Sold Product */}
            <Card className="border-border/60 shadow-sm bg-gradient-to-br from-rose-50/50 to-rose-100/20 dark:from-rose-950/10 dark:to-rose-900/5 hover:border-rose-300 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                    {t("Least Sold Product") || "المنتج الأقل مبيعاً"}
                  </p>
                  <h3 className="text-lg font-bold text-rose-900 dark:text-rose-100 mt-2 line-clamp-1">
                    {leastSoldName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
                    <TrendingDown className="h-3 w-3" /> {leastSoldQty} {t("Sold") || "مبيعات"}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center flex-shrink-0">
                  <Info className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Explanation Info */}
          <div className="flex gap-2 items-start p-4 bg-sky-50 dark:bg-sky-950/30 rounded-xl border border-sky-200/50 dark:border-sky-900/30 text-sky-800 dark:text-sky-300">
            <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold">تنويه حول تحليل المبيعات:</p>
              <ul className="list-disc pr-4 space-y-1 text-sky-700/90 dark:text-sky-300/80">
                <li>يتم حساب "أكثر منتج ربحاً" بناءً على إجمالي المبيعات (سعر المنتج × الكمية المباعة) للطلبات المكتملة فقط.</li>
                <li>يتم عرض الساعة والتواريخ بالتوقيت المحلي لجمهورية مصر العربية.</li>
                <li>حسابات المبيعات شاملة لكافة الفترات التاريخية للمتجر.</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        {/* --- EMPLOYEE PERFORMANCE TAB --- */}
        <TabsContent value="employeePerformance" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Most Accepted Orders */}
            <Card className="border-border/60 shadow-sm bg-gradient-to-br from-emerald-50/50 to-emerald-100/20 dark:from-emerald-950/10 dark:to-emerald-900/5 hover:border-emerald-300 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    {t("Most Orders Accepted") || "الأكثر قبولاً للطلبات"}
                  </p>
                  <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-2">
                    {mostAcceptedName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                    <UserCheck className="h-3 w-3" /> {mostAcceptedCount} {t("orders") || "طلبات"}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardContent>
            </Card>

            {/* Fastest Preparation */}
            <Card className="border-border/60 shadow-sm bg-gradient-to-br from-indigo-50/50 to-indigo-100/20 dark:from-indigo-950/10 dark:to-indigo-900/5 hover:border-indigo-300 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {t("Fastest Preparation") || "الأسرع في التجهيز"}
                  </p>
                  <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mt-2">
                    {fastestName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                    <Clock className="h-3 w-3" /> {fastestPrep ? `${fastestPrep.toFixed(1)} ${t("min") || "دقيقة"}` : "—"}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </CardContent>
            </Card>

            {/* Most Rejected Orders */}
            <Card className="border-border/60 shadow-sm bg-gradient-to-br from-rose-50/50 to-rose-100/20 dark:from-rose-950/10 dark:to-rose-900/5 hover:border-rose-300 transition-all">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                    {t("Most Orders Rejected") || "الأكثر رفضاً للطلبات"}
                  </p>
                  <h3 className="text-2xl font-bold text-rose-900 dark:text-rose-100 mt-2">
                    {mostRejectedName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-bold text-rose-600 dark:text-rose-400">
                    <UserX className="h-3 w-3" /> {mostRejectedCount} {t("orders") || "طلبات"}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
                  <UserX className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Table */}
          <Card className="overflow-hidden border-border/50 shadow-sm bg-white dark:bg-slate-950">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {t("Employee Performance list") || "جدول تقييم الموظفين"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">{t("Employee Name") || "اسم الموظف"}</TableHead>
                    <TableHead className="text-center">{t("Orders Accepted") || "طلبات تم قبولها"}</TableHead>
                    <TableHead className="text-center">{t("Orders Rejected") || "طلبات تم رفضها"}</TableHead>
                    <TableHead className="text-center">{t("Avg Prep Time (minutes)") || "متوسط وقت التحضير (دقائق)"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byEmployee.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                        {t("No employee records found yet") || "لا توجد سجلات أداء للموظفين حالياً (يتم الاحتساب لآخر 30 يوماً من لحظة استلام أول طلب)."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    byEmployee.map((emp: any, index: number) => (
                      <TableRow key={emp.userId ?? index} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                        <TableCell className="text-center font-semibold text-gray-800 dark:text-gray-200">
                          {emp.name}
                        </TableCell>
                        <TableCell className="text-center font-bold text-emerald-600 dark:text-emerald-400">
                          {emp.ordersAccepted ?? 0}
                        </TableCell>
                        <TableCell className="text-center font-bold text-rose-600 dark:text-rose-400">
                          {emp.ordersRejected ?? 0}
                        </TableCell>
                        <TableCell className="text-center font-bold text-indigo-600 dark:text-indigo-400">
                          {emp.avgPrepMinutes ? `${emp.avgPrepMinutes.toFixed(1)} دقيقة` : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
