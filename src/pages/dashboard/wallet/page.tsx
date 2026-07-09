import { StatisticsCard } from "@/components/statistics/StatisticsCard";
import { StatisticsMotionGrid } from "@/components/statistics/StatisticsMotionGrid";
import { PriceAmount } from "@/components/PriceAmount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DASHBOARD_CARD_MOTION } from "@/features/dashboard/config/stats";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Banknote, Clock, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import CustomHeader from "@/components/layouts/header/CustomHeader";

export default function WalletPage() {
  const t = useTranslations();
  const { data: userWallet } = useApiQuery({
    queryKey: ["userWallet"],
    endPoint: ["userWallet"]
  });

  const walletData = userWallet?.data || {};
  const walletCards = [
    { title: "Total", value: walletData.total, icon: DollarSign, className: "bg-blue-500/10 text-blue-700 dark:text-blue-300" },
    { title: "Total Earning", value: walletData.totalEarning, icon: TrendingUp, className: "bg-green-500/10 text-green-700 dark:text-green-300" },
    { title: "Total Withdrawn", value: walletData.totalWithdrawn, icon: Banknote, className: "bg-red-500/10 text-red-700 dark:text-red-300" },
    { title: "Pending Withdraw", value: walletData.pendingWithdraw, icon: Clock, className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300" },
    { title: "Collected Cash", value: walletData.collectedCash, icon: Wallet, className: "bg-purple-500/10 text-purple-700 dark:text-purple-300" },
    { title: "Current Balance", value: walletData.currentBalance, icon: DollarSign, className: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300" },
  ];

  return (
    <>
      <CustomHeader />
      <div className="flex flex-col gap-6 max-w-7xl w-full mx-auto px-4 py-6 defer-paint">
        <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">{t("Wallet")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("walletExplanation")}</p>
          </CardHeader>
          <CardContent className="pt-2">
            <StatisticsMotionGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {walletCards.map(card => {
                const Icon = card.icon;
                return (
                  <StatisticsCard
                    key={card.title}
                    title={card.title}
                    value={<PriceAmount value={card.value} />}
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
    </>
  );
}
