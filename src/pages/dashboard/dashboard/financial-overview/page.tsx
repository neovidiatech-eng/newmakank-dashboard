"use client";

import React, { useState, useMemo } from "react";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useTranslations, useLocale } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/lib/navigation";
import {
  Banknote,
  TrendingUp,
  Percent,
  Coins,
  ShieldCheck,
  Wallet,
  HandCoins,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Calendar as CalendarIcon,
  PackageCheck,
  PackageX,
  CreditCard,
  Truck,
  Package,
  ChevronLeft
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

export default function FinancialOverviewPage() {
  const t = useTranslations();
  const locale = useLocale();

  // Period Filter State
  const [periodFilter, setPeriodFilter] = useState<string>("THIS_MONTH");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  // Build queryParams according to backend specification
  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (periodFilter === "CUSTOM") {
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      params.periodFilter = "CUSTOM";
    } else if (periodFilter) {
      params.periodFilter = periodFilter;
    }
    return params;
  }, [periodFilter, fromDate, toDate]);

  const { data: response, isLoading } = useApiQuery({
    queryKey: ["financialOverview", JSON.stringify(queryParams)],
    endPoint: ["financialOverview"],
    params: queryParams
  });

  const financialData = response?.data || {};
  const summary = financialData.summary || {};
  const revenue = financialData.revenue || {};
  const commission = financialData.commission || {};
  const paymentMethods = financialData.paymentMethods || {};
  const walletBalances = financialData.walletBalances || {};
  const cashCollectedByDrivers = financialData.cashCollectedByDrivers ?? 0;
  const withdrawals = financialData.withdrawals || {};

  const handleResetFilter = () => {
    setPeriodFilter("THIS_MONTH");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto px-4 py-6">
      {/* Page Header & Period Filter Toolbar */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <TrendingUp className="h-7 w-7 text-primary" />
            الملخص المالي الشامل (Financial Overview)
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            مرجع تحليلي موحد لجميع المبيعات، عوائد التوصيل، عمولات المنصة، وأرصدة المناديب والمتاجر.
          </p>
        </div>

        {/* Date Filter Toolbar */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1.5 bg-card p-1.5 rounded-xl border shadow-sm">
            {[
              { id: "TODAY", label: "اليوم" },
              { id: "YESTERDAY", label: "أمس" },
              { id: "THIS_WEEK", label: "هذا الأسبوع" },
              { id: "THIS_MONTH", label: "هذا الشهر" },
              { id: "THIS_YEAR", label: "هذه السنة" },
              { id: "CUSTOM", label: "مخصص" }
            ].map((item) => (
              <Button
                key={item.id}
                size="sm"
                variant={periodFilter === item.id ? "default" : "ghost"}
                onClick={() => setPeriodFilter(item.id)}
                className="text-xs h-8 px-3"
              >
                {item.label}
              </Button>
            ))}
            {(periodFilter !== "THIS_MONTH" || fromDate || toDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilter}
                className="h-8 text-xs text-muted-foreground hover:text-foreground px-2"
                title="إعادة ضبط"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {/* Custom Date Pickers */}
          {periodFilter === "CUSTOM" && (
            <div className="flex items-center gap-2 bg-card p-2 rounded-lg border text-xs">
              <span className="text-muted-foreground">من:</span>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-8 text-xs w-36"
              />
              <span className="text-muted-foreground">إلى:</span>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-8 text-xs w-36"
              />
            </div>
          )}
        </div>
      </div>

      {/* Info Alert */}
      <Alert className="bg-sky-50/60 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900/50">
        <HelpCircle className="h-4 w-4 text-sky-600 dark:text-sky-400" />
        <AlertTitle className="text-sky-800 dark:text-sky-300 font-semibold text-xs mb-0.5">
          توضيح بشأن الفلترة والضغط التفاعلي:
        </AlertTitle>
        <AlertDescription className="text-sky-700 dark:text-sky-400 text-xs">
          الأرقام المتعلقة بالإيرادات وأعداد الطلبات والعمولات تتأثر بالفترة الزمنية المختارة. بينما تُعرض أرصدة المحافظ والنقدية الحالية كأرقام لحظية مباشرة. اضغط على أي كارت للتوجيه المباشر لقسمه الخاص.
        </AlertDescription>
      </Alert>

      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1: KPI Top Cards (Clickable Drill-downs) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Orders Card -> Links to /orders */}
            <Link href="/orders" className="group">
              <Card className="border shadow-sm hover:border-primary/50 transition-all duration-200 group-hover:shadow-md cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      إجمالي الطلبات (GMV)
                      <ChevronLeft className="h-3 w-3 text-muted-foreground group-hover:translate-x-[-2px] transition-transform rtl:rotate-180" />
                    </p>
                    <h3 className="text-2xl font-bold text-foreground mt-1">
                      {summary.totalOrders ?? 0}
                    </h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                      مبيعات: {formatMoney(summary.totalRevenue, locale)}
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 text-primary rounded-xl">
                    <CalendarIcon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Delivered Orders Card -> Links to /orders */}
            <Link href="/orders?status=DELIVERED" className="group">
              <Card className="border shadow-sm hover:border-emerald-400 transition-all duration-200 group-hover:shadow-md cursor-pointer bg-emerald-50/30 dark:bg-emerald-950/10">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      الطلبات المسلمة
                      <ChevronLeft className="h-3 w-3 text-emerald-600 group-hover:translate-x-[-2px] transition-transform rtl:rotate-180" />
                    </p>
                    <h3 className="text-2xl font-bold text-emerald-950 dark:text-emerald-100 mt-1">
                      {summary.deliveredOrders ?? 0}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">ناجحة ومكتملة</p>
                  </div>
                  <div className="p-3 bg-emerald-500/20 text-emerald-600 rounded-xl">
                    <PackageCheck className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Cancelled Orders Card -> Links to /orders */}
            <Link href="/orders?status=CANCELLED" className="group">
              <Card className="border shadow-sm hover:border-rose-400 transition-all duration-200 group-hover:shadow-md cursor-pointer bg-rose-50/30 dark:bg-rose-950/10">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-rose-800 dark:text-rose-300 flex items-center gap-1">
                      الطلبات المكنسلة/المرفوضة
                      <ChevronLeft className="h-3 w-3 text-rose-600 group-hover:translate-x-[-2px] transition-transform rtl:rotate-180" />
                    </p>
                    <h3 className="text-2xl font-bold text-rose-950 dark:text-rose-100 mt-1">
                      {summary.cancelledOrders ?? 0}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">إلغاء أو رفض</p>
                  </div>
                  <div className="p-3 bg-rose-500/20 text-rose-600 rounded-xl">
                    <PackageX className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Platform Net Commission Card */}
            <Card className="border shadow-sm bg-violet-50/30 dark:bg-violet-950/10">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-violet-800 dark:text-violet-300">
                    صافي عمولة المنصة
                  </p>
                  <h3 className="text-2xl font-bold text-violet-950 dark:text-violet-100 mt-1">
                    {formatMoney(summary.platformCommission, locale)}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">أرباح السيرفر الصافية</p>
                </div>
                <div className="p-3 bg-violet-500/20 text-violet-600 rounded-xl">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 2: Detailed Revenue & Commissions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Breakdown */}
            <Card className="lg:col-span-2 border shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-primary" />
                  تفاصيل المبيعات والإيرادات (Revenue Breakdown)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 rounded-xl border bg-muted/20">
                    <p className="text-xs text-muted-foreground">أثمان المنتجات</p>
                    <p className="text-base font-bold mt-1 text-foreground">
                      {formatMoney(revenue.productPrice, locale)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border bg-muted/20">
                    <p className="text-xs text-muted-foreground">رسوم التوصيل</p>
                    <p className="text-base font-bold mt-1 text-foreground">
                      {formatMoney(revenue.shipping || summary.shippingFees, locale)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border bg-muted/20">
                    <p className="text-xs text-muted-foreground">رسوم التغليف</p>
                    <p className="text-base font-bold mt-1 text-foreground">
                      {formatMoney(revenue.packagingFee, locale)}
                    </p>
                  </div>
                  
                  {/* Discounts Card -> Links to /coupons */}
                  <Link href="/coupons" className="group">
                    <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/40 dark:bg-rose-950/20 hover:border-rose-400 transition-colors cursor-pointer">
                      <p className="text-xs text-rose-800 dark:text-rose-300 font-medium flex items-center justify-between">
                        الخصومات والكوبونات
                        <ChevronLeft className="h-3 w-3 text-rose-600 group-hover:translate-x-[-2px] transition-transform rtl:rotate-180" />
                      </p>
                      <p className="text-base font-bold mt-1 text-rose-900 dark:text-rose-100">
                        {formatMoney(revenue.totalDiscountGiven, locale)}
                      </p>
                    </div>
                  </Link>
                </div>

                {/* Payment Methods Split */}
                <div className="border-t pt-4 space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground">تفقيط وسائل الدفع (Payment Methods):</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 rounded-xl border bg-emerald-50/20 border-emerald-200/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 text-emerald-600 rounded-lg">
                          <Banknote className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">الدفع كاش (Cash on Delivery)</p>
                          <p className="text-xs text-muted-foreground">{paymentMethods.cash?.count ?? 0} طلبات</p>
                        </div>
                      </div>
                      <span className="font-bold text-foreground">{formatMoney(paymentMethods.cash?.amount, locale)}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl border bg-indigo-50/20 border-indigo-200/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 text-indigo-600 rounded-lg">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">الدفع بالمحفظة (Wallet)</p>
                          <p className="text-xs text-muted-foreground">{paymentMethods.wallet?.count ?? 0} طلبات</p>
                        </div>
                      </div>
                      <span className="font-bold text-foreground">{formatMoney(paymentMethods.wallet?.amount, locale)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commissions Card */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  أرباح وعمولات المنصة (Commissions)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="p-4 rounded-xl border bg-violet-50/50 dark:bg-violet-950/20 border-violet-200">
                  <p className="text-xs text-violet-800 dark:text-violet-300 font-semibold">عمولة المنصة الصافية</p>
                  <h3 className="text-2xl font-bold text-violet-900 dark:text-violet-100 mt-1">
                    {formatMoney(commission.platformCommission || summary.platformCommission, locale)}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">مستقطعة تلقائياً من الطلبات الناجحة</p>
                </div>

                {commission.storeCommission > 0 && (
                  <div className="p-4 rounded-xl border bg-sky-50/50 dark:bg-sky-950/20 border-sky-200">
                    <p className="text-xs text-sky-800 dark:text-sky-300 font-semibold">عمولة المتاجر</p>
                    <h3 className="text-2xl font-bold text-sky-900 dark:text-sky-100 mt-1">
                      {formatMoney(commission.storeCommission, locale)}
                    </h3>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Section 3: Live Wallets & Cash Held by Drivers (Clickable) */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              أرصدة المحافظ والنقدية الحالية (Live Balances)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stores Wallets -> Links to /stores */}
              <Link href="/stores" className="group">
                <Card className="border shadow-sm hover:border-primary/50 transition-all duration-200 group-hover:shadow-md cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs text-muted-foreground flex items-center justify-between">
                      <span>رصيد لحظي مباشر</span>
                      <ChevronLeft className="h-3 w-3 text-muted-foreground group-hover:translate-x-[-2px] transition-transform rtl:rotate-180" />
                    </CardDescription>
                    <CardTitle className="text-sm font-semibold">إجمالي أرصدة محافظ المتاجر</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {formatMoney(walletBalances.totalStoreWalletBalance, locale)}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                      <span>العمولات المستقطعة:</span>
                      <span className="font-semibold text-foreground">
                        {formatMoney(walletBalances.totalStoreCommissionDeducted, locale)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Drivers Wallets -> Links to /delivery */}
              <Link href="/analytics?tab=drivers" className="group">
                <Card className="border shadow-sm hover:border-primary/50 transition-all duration-200 group-hover:shadow-md cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs text-muted-foreground flex items-center justify-between">
                      <span>رصيد لحظي مباشر</span>
                      <ChevronLeft className="h-3 w-3 text-muted-foreground group-hover:translate-x-[-2px] transition-transform rtl:rotate-180" />
                    </CardDescription>
                    <CardTitle className="text-sm font-semibold">إجمالي أرصدة محافظ المناديب</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">
                      {formatMoney(walletBalances.totalDriverWalletBalance, locale)}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                      <span>عمولات غير مسواة:</span>
                      <span className="font-semibold text-rose-600">
                        {formatMoney(walletBalances.totalDriverUnsettledCommission, locale)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Cash Collected by Drivers -> Links to /delivery */}
              <Link href="/analytics?tab=drivers" className="group">
                <Card className="border shadow-sm border-amber-200 bg-amber-50/30 dark:bg-amber-950/10 hover:border-amber-400 transition-all duration-200 group-hover:shadow-md cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-xs text-amber-700 dark:text-amber-400 flex items-center justify-between">
                      <span>رصيد لحظي مباشر</span>
                      <ChevronLeft className="h-3 w-3 text-amber-600 group-hover:translate-x-[-2px] transition-transform rtl:rotate-180" />
                    </CardDescription>
                    <CardTitle className="text-sm font-semibold text-amber-950 dark:text-amber-100">
                      كاش طرف المناديب (الدفع عند الاستلام)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                      {formatMoney(cashCollectedByDrivers, locale)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      مبالغ نقدية كاش متواجدة مع المناديب حالياً لم يتم تسويتها بعد.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Section 4: Withdrawal Requests Overview */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <HandCoins className="h-5 w-5 text-primary" />
              طلبات السحب المالي (Withdrawal Requests)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stores Withdrawals Card -> Links to /stores */}
              <Link href="/stores" className="group">
                <Card className="border shadow-sm hover:border-primary/50 transition-all duration-200 group-hover:shadow-md cursor-pointer">
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-base font-bold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="h-5 w-5 text-violet-600" />
                        طلبات سحب المتاجر (Stores Withdrawals)
                      </div>
                      <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:translate-x-[-2px] transition-transform rtl:rotate-180" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border">
                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        قيد الانتظار (Pending)
                      </span>
                      <span className="text-lg font-bold text-amber-800 dark:text-amber-300">
                        {formatMoney(withdrawals.stores?.pending?.amount, locale)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {withdrawals.stores?.pending?.count ?? 0} طلبات
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border">
                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        تمت الموافقة (Approved)
                      </span>
                      <span className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                        {formatMoney(withdrawals.stores?.approved?.amount, locale)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {withdrawals.stores?.approved?.count ?? 0} طلبات
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Drivers Withdrawals Card -> Links to /delivery */}
              <Link href="/analytics?tab=drivers" className="group">
                <Card className="border shadow-sm hover:border-primary/50 transition-all duration-200 group-hover:shadow-md cursor-pointer">
                  <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-base font-bold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ArrowDownLeft className="h-5 w-5 text-sky-600" />
                        طلبات سحب المناديب (Drivers Withdrawals)
                      </div>
                      <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:translate-x-[-2px] transition-transform rtl:rotate-180" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border">
                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        قيد الانتظار (Pending)
                      </span>
                      <span className="text-lg font-bold text-amber-800 dark:text-amber-300">
                        {formatMoney(withdrawals.drivers?.pending?.amount, locale)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {withdrawals.drivers?.pending?.count ?? 0} طلبات
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border">
                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        تمت الموافقة (Approved)
                      </span>
                      <span className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                        {formatMoney(withdrawals.drivers?.approved?.amount, locale)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {withdrawals.drivers?.approved?.count ?? 0} طلبات
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
