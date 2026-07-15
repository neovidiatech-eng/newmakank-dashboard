"use client";

import { useMemo } from "react";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useSearchParams } from "react-router-dom";
import { useTranslations, useLocale } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Banknote,
  TrendingUp,
  Percent,
  Coins,
  ShieldCheck,
  Wallet,
  Coins as CoinsIcon,
  HandCoins,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Calendar
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function formatMoney(value: number | string | null | undefined, locale: string) {
  const numberValue = Number(value ?? 0);
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2
  }).format(Number.isFinite(numberValue) ? numberValue : 0);
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function toDateOnly(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function getCurrentMonthValue() {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}`;
}

// monthValue is "YYYY-MM" — returns the first/last calendar day of that month as YYYY-MM-DD
function getMonthRange(monthValue: string) {
  const [year, month] = monthValue.split("-").map(Number);
  const fromDate = new Date(year, month - 1, 1);
  const toDate = new Date(year, month, 0);
  return { fromDate: toDateOnly(fromDate), toDate: toDateOnly(toDate) };
}

function buildMonthOptions(locale: string, count = 12) {
  const formatter = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long"
  });
  const now = new Date();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const value = `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
    return { value, label: formatter.format(date) };
  });
}

export default function FinancialOverviewPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentMonthValue = getCurrentMonthValue();
  const monthValue = searchParams.get("month") || currentMonthValue;
  const { fromDate, toDate } = useMemo(() => getMonthRange(monthValue), [monthValue]);
  const monthOptions = useMemo(() => buildMonthOptions(locale), [locale]);

  const { data: response, isLoading } = useApiQuery({
    queryKey: ["financialOverview", { fromDate, toDate }],
    endPoint: ["financialOverview"],
    params: { fromDate, toDate }
  });

  const financialData = response?.data || {};

  const handleMonthChange = (value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("month", value);
    setSearchParams(nextParams);
  };

  const handleReset = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("month");
    setSearchParams(nextParams);
  };

  return (
    <div className="flex flex-col gap-8 w-full mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2.5">
            <TrendingUp className="h-8 w-8 text-primary" />
            {t("financialOverview")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            {t("financialOverviewDescription", "مرجع موحد وشامل لجميع المعاملات والإحصائيات المالية على المنصة")}
          </p>
        </div>

        {/* Month Filter */}
        <div className="flex flex-wrap items-end gap-3 bg-card p-4 rounded-xl border shadow-sm">
          <div className="space-y-1.5">
            <Label htmlFor="month-filter" className="text-xs font-semibold">
              {t("selectMonth", "الشهر")}
            </Label>
            <Select value={monthValue} onValueChange={handleMonthChange}>
              <SelectTrigger id="month-filter" className="h-9 w-48 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {monthValue !== currentMonthValue && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              title={t("resetToCurrentMonth", "الرجوع للشهر الحالي")}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Info Alert about Live vs Filtered data */}
      <Alert className="bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/50">
        <HelpCircle className="h-5 w-5 text-sky-600 dark:text-sky-400" />
        <AlertTitle className="text-sky-800 dark:text-sky-300 font-semibold mb-1">
          {t("dataFilterNoteTitle", "توضيح هام بشأن فلترة البيانات")}
        </AlertTitle>
        <AlertDescription className="text-sky-700 dark:text-sky-400 text-xs">
          {t(
            "dataFilterNoteDescription",
            "الأرقام المتعلقة بالنشاط (الإيرادات، العمولات، والخصومات، وطلبات السحب) تتأثر بنطاق التاريخ المحدد. بينما تُعرض أرصدة المحافظ والنقدية الحالية كأرقام لحظية مباشرة بالوقت الحالي ولا تتأثر بالتواريخ."
          )}
        </AlertDescription>
      </Alert>

      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 1: Revenue, Discounts & Commissions */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Banknote className="h-5.5 w-5.5 text-primary" />
              {t("revenueAndCommissions", "الإيرادات والعمولات")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Orders Card */}
              <Card className="border-border/60 bg-card shadow-sm hover:border-primary/30 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("totalOrders", "إجمالي الطلبات")}</p>
                    <h3 className="text-3xl font-bold mt-2">{financialData.revenue?.totalOrders ?? 0}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>

              {/* Total Revenue Card */}
              <Card className="border-emerald-200 dark:border-emerald-950 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm hover:border-emerald-400 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{t("totalRevenue", "إجمالي الإيرادات")}</p>
                    <h3 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mt-2">
                      {formatMoney(financialData.revenue?.totalRevenue, locale)}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </CardContent>
              </Card>

              {/* Total Discounts Card */}
              <Card className="border-rose-200 dark:border-rose-950 bg-rose-50/50 dark:bg-rose-950/20 shadow-sm hover:border-rose-400 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{t("Total Discounts Given", "إجمالي الخصومات الممنوحة")}</p>
                    <h3 className="text-3xl font-bold text-rose-900 dark:text-rose-100 mt-2">
                      {formatMoney(financialData.revenue?.totalDiscountGiven, locale)}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
                    <Percent className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commissions Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <Card className="border-border/60 bg-card shadow-sm hover:border-primary/30 transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/50">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Platform Commission", "عمولة المنصة")}</p>
                    <p className="text-2xl font-bold mt-1">
                      {formatMoney(financialData.commission?.platformCommission, locale)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card shadow-sm hover:border-primary/30 transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900/50">
                    <Coins className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Store Commission", "عمولة المتاجر")}</p>
                    <p className="text-2xl font-bold mt-1">
                      {formatMoney(financialData.commission?.storeCommission, locale)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 2: Wallet Balances & Live Cash */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Wallet className="h-5.5 w-5.5 text-primary" />
              {t("walletBalancesAndLiveCash", "أرصدة المحافظ والنقدية الحالية")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stores Wallets */}
              <Card className="border-border/60 bg-card shadow-sm hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">{t("currentLiveBalance", "الرصيد الحالي الآن")}</CardDescription>
                  <CardTitle className="text-base font-semibold">{t("totalStoreWalletBalance", "إجمالي محافظ المتاجر")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {formatMoney(financialData.walletBalances?.totalStoreWalletBalance, locale)}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                    <span>{t("totalStoreCommissionDeducted", "العمولات المستقطعة:")}</span>
                    <span className="font-semibold text-foreground">
                      {formatMoney(financialData.walletBalances?.totalStoreCommissionDeducted, locale)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Drivers Wallets */}
              <Card className="border-border/60 bg-card shadow-sm hover:border-primary/30 transition-colors">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">{t("currentLiveBalance", "الرصيد الحالي الآن")}</CardDescription>
                  <CardTitle className="text-base font-semibold">{t("totalDriverWalletBalance", "إجمالي محافظ المناديب")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {formatMoney(financialData.walletBalances?.totalDriverWalletBalance, locale)}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                    <span>{t("totalDriverUnsettledCommission", "عمولات غير مسواة:")}</span>
                    <span className="font-semibold text-rose-600">
                      {formatMoney(financialData.walletBalances?.totalDriverUnsettledCommission, locale)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Cash collected by drivers */}
              <Card className="border-amber-200 dark:border-amber-950 bg-amber-50/30 dark:bg-amber-950/10 shadow-sm hover:border-amber-400 transition-colors">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs text-amber-700 dark:text-amber-400">{t("currentLiveBalance", "الرصيد الحالي الآن")}</CardDescription>
                  <CardTitle className="text-base font-semibold text-amber-900 dark:text-amber-100">{t("cashCollectedByDrivers", "كاش طرف المناديب (الدفع عند الاستلام)")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                    {formatMoney(financialData.cashCollectedByDrivers, locale)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t("cashCollectedByDriversDescription", "إجمالي المبالغ النقدية المحصلة من العملاء والمتواجدة مع المناديب حالياً.")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Section 3: Withdrawal Requests Overview */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <HandCoins className="h-5.5 w-5.5 text-primary" />
              {t("withdrawalsRequestsOverview", "طلبات السحب المالي")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stores Withdrawals */}
              <Card className="border-border/60 bg-card shadow-sm">
                <CardHeader className="pb-4 border-b">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5 text-violet-600" />
                    {t("storesWithdrawals", "طلبات سحب المتاجر")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      {t("PENDING", "قيد الانتظار")}
                    </span>
                    <span className="text-lg font-bold text-amber-800 dark:text-amber-300">
                      {formatMoney(financialData.withdrawals?.stores?.pending?.amount, locale)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("requestsCount", "{count} طلبات").replace("{count}", String(financialData.withdrawals?.stores?.pending?.count ?? 0))}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      {t("APPROVED", "تمت الموافقة")}
                    </span>
                    <span className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                      {formatMoney(financialData.withdrawals?.stores?.approved?.amount, locale)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("requestsCount", "{count} طلبات").replace("{count}", String(financialData.withdrawals?.stores?.approved?.count ?? 0))}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Drivers Withdrawals */}
              <Card className="border-border/60 bg-card shadow-sm">
                <CardHeader className="pb-4 border-b">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <ArrowDownLeft className="h-5 w-5 text-sky-600" />
                    {t("driversWithdrawals", "طلبات سحب المناديب")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      {t("PENDING", "قيد الانتظار")}
                    </span>
                    <span className="text-lg font-bold text-amber-800 dark:text-amber-300">
                      {formatMoney(financialData.withdrawals?.drivers?.pending?.amount, locale)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("requestsCount", "{count} طلبات").replace("{count}", String(financialData.withdrawals?.drivers?.pending?.count ?? 0))}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      {t("APPROVED", "تمت الموافقة")}
                    </span>
                    <span className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                      {formatMoney(financialData.withdrawals?.drivers?.approved?.amount, locale)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t("requestsCount", "{count} طلبات").replace("{count}", String(financialData.withdrawals?.drivers?.approved?.count ?? 0))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
