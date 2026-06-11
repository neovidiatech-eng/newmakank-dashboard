import { StatisticsCard } from "@/components/statistics/StatisticsCard";
import { StatisticsMotionGrid } from "@/components/statistics/StatisticsMotionGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DASHBOARD_CARD_MOTION,
  getFundStatCards,
  getOrderStatCards,
  getOverviewStatCards,
  TRANSACTION_TOTAL_CARDS
} from "@/features/dashboard/config/stats";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Banknote, Clock, DollarSign, ShoppingBag, Store, TrendingUp, Users, Wallet } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

export default function DashboardPage() {
  const t = useTranslations();
  const { data: userWallet } = useApiQuery({
    queryKey: ["userWallet"],
    endPoint: ["userWallet"]
  });
  const { data: statsResponse } = useApiQuery({
    queryKey: ["statistics"],
    endPoint: ["statistics"]
  });
  const { data: transactionsResponse } = useApiQuery({
    queryKey: ["transactionsStatistics"],
    endPoint: ["transactionsStatistics"]
  });
  const { data: ordersResponse } = useApiQuery({
    queryKey: ["ordersStatistics"],
    endPoint: ["ordersStatistics"]
  });

  const stats = (statsResponse?.data ?? {}) as any;
  const fundStats = (transactionsResponse?.data?.FundStatistics ?? []) as any[];
  const allTransactionSums = (transactionsResponse?.data?.AllStatistic?._sum ?? {}) as Record<string, number>;
  const ordersStats = (ordersResponse?.data ?? {}) as any;
  const walletData = userWallet?.data || {};
  const hasStats = Boolean(statsResponse?.data);
  const hasTransactions = Boolean(transactionsResponse?.data);
  const hasOrders = Boolean(ordersResponse?.data);
  const walletCards = [
    { title: "Total", value: walletData.total || '-', icon: DollarSign, className: "bg-blue-500/10 text-blue-700 dark:text-blue-300" },
    { title: "Total Earning", value: walletData.totalEarning || '-', icon: TrendingUp, className: "bg-green-500/10 text-green-700 dark:text-green-300" },
    { title: "Total Withdrawn", value: walletData.totalWithdrawn || '-', icon: Banknote, className: "bg-red-500/10 text-red-700 dark:text-red-300" },
    { title: "Pending Withdraw", value: walletData.pendingWithdraw || '-', icon: Clock, className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300" },
    { title: "Collected Cash", value: walletData.collectedCash || '-', icon: Wallet, className: "bg-purple-500/10 text-purple-700 dark:text-purple-300" },
    { title: "Current Balance", value: walletData.currentBalance || '-', icon: DollarSign, className: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300" },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-10 max-w-7xl w-full mx-auto px-4 py-6 defer-paint">
      <div className="relative w-full overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-white via-white to-slate-50/80 px-6 py-8 shadow-sm dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/70">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
            {t("dashboard.liveInsights")}
          </p>
          <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--brand-1))] to-[hsl(var(--brand-2))]">
            {t("dashboard.overview")}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-700 dark:text-slate-200">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100/80 px-3 py-1 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">
              <Users className="h-4 w-4" />
              {t("dashboard.totalCustomers")}: {stats.totalCustomers ?? 0}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-100/80 px-3 py-1 text-violet-700 dark:bg-violet-500/10 dark:text-violet-200">
              <Store className="h-4 w-4" />
              {t("dashboard.totalStores")}: {stats.totalStores ?? 0}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-3 py-1 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
              <ShoppingBag className="h-4 w-4" />
              {t("dashboard.totalOrders")}: {stats.totalOrders ?? 0}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 w-full">
        <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">{t("dashboard.statistics")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {!hasStats && (
              <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
                {t("StatisticsUnavailable")}
              </p>
            )}
            <StatisticsMotionGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {getOverviewStatCards(stats).map(card => {
                const Icon = card.icon;
                return (
                  <StatisticsCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    icon={<Icon className="size-6" />}
                    // className={card.className}
                    motionProps={{ variants: DASHBOARD_CARD_MOTION }}
                  />
                );
              })}
            </StatisticsMotionGrid>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">
              {t("dashboard.transactionsStatistics")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {!hasTransactions && (
              <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
                {t("TransactionsUnavailable")}
              </p>
            )}
            <StatisticsMotionGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {getFundStatCards(fundStats).map(card => {
                const Icon = card.icon;
                return (
                  <StatisticsCard
                    key={`${card.title}-${card.value}`}
                    title={card.title}
                    value={card.value}
                    icon={<Icon className="size-6" />}
                    className={card.className}
                    motionProps={{ variants: DASHBOARD_CARD_MOTION }}
                  />
                );
              })}
              {TRANSACTION_TOTAL_CARDS.map(card => {
                const Icon = card.icon;
                return (
                  <StatisticsCard
                    key={card.title}
                    title={card.title}
                    value={allTransactionSums[card.sumKey] ?? 0}
                    icon={<Icon className="size-6" />}
                    className={card.className}
                    motionProps={{ variants: DASHBOARD_CARD_MOTION }}
                  />
                );
              })}
            </StatisticsMotionGrid>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">{t("dashboard.ordersStatistics")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {!hasOrders && (
              <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
                {t("OrdersUnavailable")}
              </p>
            )}
            <StatisticsMotionGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {getOrderStatCards(ordersStats).map(card => {
                const Icon = card.icon;
                return (
                  <StatisticsCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    icon={<Icon className="size-6" />}
                    className={card.className}
                    motionProps={{ variants: DASHBOARD_CARD_MOTION }}
                  />
                );
              })}
            </StatisticsMotionGrid>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">{t("Wallet")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <StatisticsMotionGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {walletCards.map(card => {
                const Icon = card.icon;
                return (
                  <StatisticsCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    icon={<Icon className="size-6" />}
                    className={card.className}
                    motionProps={{ variants: DASHBOARD_CARD_MOTION }}
                  />
                );
              })}
            </StatisticsMotionGrid>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
