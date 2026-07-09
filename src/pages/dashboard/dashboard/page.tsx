import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Link, useSearchParams } from "react-router-dom";
import { Banknote, Users, Store, Bike, Receipt, BadgePercent, Coins, HandCoins, Truck, Info, CalendarClock, Wallet, PiggyBank, Landmark, Clock3 } from "lucide-react";
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
  
  const { data: statsResponse } = useApiQuery({
    queryKey: ["statistics"],
    endPoint: ["statistics"]
  });


  const { data: ordersResponse } = useApiQuery({
    queryKey: ["orders", { limit, page }],
    endPoint: ["orders"],
    params: { limit, page }
  });

  const { data: allOrdersResponse } = useApiQuery({
    queryKey: ["orders_all_for_stats"],
    endPoint: ["orders"],
    params: { limit: 100000, page: 1 }
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

  const stats = (statsResponse?.data ?? {}) as any;

  const orders = (ordersResponse?.data?.data ?? ordersResponse?.data ?? []) as any[];
  const allOrdersForStats = (allOrdersResponse?.data?.data ?? allOrdersResponse?.data ?? []) as any[];

  // Data aggregations (defensive fallback)
  const totalCustomers = stats.totalCustomers ?? 0;
  const totalStores = stats.totalStores ?? 0;
  
  // Directly fetching correct counts
  const totalDelivery = deliveryResponse?.total ?? deliveryResponse?.data?.length ?? deliveryResponse?.data?.data?.length ?? stats.totalDelivery ?? 0;
  const openStores = openStoresResponse?.total ?? openStoresResponse?.data?.length ?? openStoresResponse?.data?.data?.length ?? 0;

  // Only count orders that are actually confirmed — exclude cancelled/rejected/failed
  // payments, and PENDING_PAYMENT (wallet-transfer orders awaiting admin/store proof
  // review — not yet confirmed paid, so including them would overstate revenue).
  const validOrdersForStats = allOrdersForStats.filter(order => {
    const status = order?.status?.toUpperCase();
    return (
      status !== "CANCELLED" &&
      status !== "REJECTED" &&
      status !== "PAYMENT_FAILD" &&
      status !== "PENDING_PAYMENT"
    );
  });

  // Financials calculated from VALID orders only
  const financialData = {
    totalAmount: validOrdersForStats.reduce((sum, order) => sum + Number(order?.invoice?.summary?.total ?? order?.price ?? 0), 0),
    productPrice: validOrdersForStats.reduce((sum, order) => sum + Number(order?.price ?? 0), 0),
    storeCommission: validOrdersForStats.reduce((sum, order) => sum + Number(order?.storeCommission ?? 0), 0),
    globalCommission: validOrdersForStats.reduce((sum, order) => sum + Number(order?.globalCommission ?? 0), 0),
    taxes: validOrdersForStats.reduce((sum, order) => sum + Number(order?.tax ?? 0), 0),
    deliveryPrice: validOrdersForStats.reduce((sum, order) => sum + Number(order?.shipping ?? 0), 0),
  };

  return (
    <div className="flex flex-col gap-8 w-full mx-auto px-4 py-6 defer-paint">
      
      {/* 1. First Row: Overview Links */}
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

      {/* 2. Second Row: Financials */}
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
        
        {/* Main Total Amount Card */}
        <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 shadow-sm mb-4">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-lg font-medium text-emerald-800 dark:text-emerald-300">{t("totalOrdersAmount")}</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-2">{t("totalOrdersAmountDescription")}</p>
              <h3 className="text-4xl font-bold text-emerald-900 dark:text-emerald-100">
                {formatMoney(financialData.totalAmount, locale)}
              </h3>
            </div>
            <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
              <Banknote className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Breakdown Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("productsPriceWithoutCommission")}</p>
                <p className="font-bold">{formatMoney(financialData.productPrice, locale)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/50">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("Store Commission")}</p>
                <p className="font-bold">{formatMoney(financialData.storeCommission, locale)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50">
                <HandCoins className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("Platform Fee")}</p>
                <p className="font-bold">{formatMoney(financialData.globalCommission, locale)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/50">
                <BadgePercent className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("Tax")}</p>
                <p className="font-bold">{formatMoney(financialData.taxes, locale)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/50">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("Shipping")}</p>
                <p className="font-bold">{formatMoney(financialData.deliveryPrice, locale)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 2b. Current Period + Driver Finance */}
      {(stats.currentPeriod || stats.driverFinance) && (
        <div className="space-y-4">
          {stats.currentPeriod && (
            <div className="space-y-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-primary" />
                {t("Current Period")}
                {stats.currentPeriod.periodStartedAt && (
                  <span className="text-xs font-normal text-muted-foreground">
                    ({t("periodStartedAt")}: {new Date(stats.currentPeriod.periodStartedAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")})
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="border-border/60 bg-card shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50">
                      <Banknote className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("totalRevenue")}</p>
                      <p className="font-bold">{formatMoney(stats.currentPeriod.totalRevenue, locale)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/60 bg-card shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50">
                      <HandCoins className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("totalCommission")}</p>
                      <p className="font-bold">{formatMoney(stats.currentPeriod.totalCommission, locale)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/60 bg-card shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-900/50">
                      <Receipt className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("totalOrders")}</p>
                      <p className="font-bold">{stats.currentPeriod.totalOrders ?? 0}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {stats.driverFinance && (
            <div className="space-y-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Bike className="h-5 w-5 text-primary" />
                {t("Driver Finance")}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-border/60 bg-card shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/50">
                      <Clock3 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("pendingWithdrawalsCount")}</p>
                      <p className="font-bold">{stats.driverFinance.pendingWithdrawalsCount ?? 0}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/60 bg-card shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/50">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("pendingWithdrawalsAmount")}</p>
                      <p className="font-bold">{formatMoney(stats.driverFinance.pendingWithdrawalsAmount, locale)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/60 bg-card shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/50">
                      <PiggyBank className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("totalCollectedCashOutstanding")}</p>
                      <p className="font-bold">{formatMoney(stats.driverFinance.totalCollectedCashOutstanding, locale)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/60 bg-card shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/50">
                      <Landmark className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("totalDriverWalletBalance")}</p>
                      <p className="font-bold">{formatMoney(stats.driverFinance.totalDriverWalletBalance, locale)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Table: Recent Orders */}
      <Card className="border-border/60 bg-card shadow-sm">
        <CardHeader>
          <CardTitle>{t("Recent Orders")}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="text-center font-bold">{t("Order ID")}</TableHead>
                <TableHead className="text-center font-bold">{t("Delivery")}</TableHead>
                <TableHead className="text-center font-bold">{t("Total")}</TableHead>
                <TableHead className="text-center font-bold text-muted-foreground">{t("productsPriceWithoutCommission")}</TableHead>
                <TableHead className="text-center font-bold text-muted-foreground">{t("Store Commission")}</TableHead>
                <TableHead className="text-center font-bold text-muted-foreground">{t("Platform Fee")}</TableHead>
                <TableHead className="text-center font-bold text-muted-foreground">{t("Tax")}</TableHead>
                <TableHead className="text-center font-bold text-muted-foreground">{t("Shipping")}</TableHead>
                <TableHead className="text-center font-bold text-muted-foreground">{t("Details")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    {t("No Data Available")}
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const deliveryName = order?.Delivery?.User?.name || order?.Delivery?.name || order?.delivery?.name || "—";
                  const productPrice = order?.price || 0;
                  const storeCommission = order?.storeCommission || 0;
                  const globalCommission = order?.globalCommission || 0;
                  const tax = order?.tax || 0;
                  const deliveryPrice = order?.shipping || 0;
                  const total = order?.invoice?.summary?.total ?? order?.price ?? 0;

                  return (
                    <TableRow key={order.id} className="hover:bg-muted/30">
                      <TableCell className="text-center font-medium">
                        <Link to={`/${locale}/orders/${order.id}`} className="text-primary hover:underline">
                          #{order.id}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        {deliveryName !== "—" ? (
                          <Badge variant="outline" className="bg-violet-50 text-violet-700">{deliveryName}</Badge>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-center font-bold text-emerald-600">
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
            <div className="mt-4 pb-2">
              <TablePagination pagination={{ total: ordersResponse.total }} />
            </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
