import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { currency } from "@/utils/config";
import { Clock, DollarSign, TrendingUp, Users } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

interface CouponStatsProps {
    data: {
        maxUsage: number;
        usageCount: number;
        minOrderAmount: number;
        discountValue: number;
        discountType: string;
    };
}

export function CouponStats({ data }: CouponStatsProps) {
    const t = useTranslations();

    const usagePercentage = data.maxUsage > 0 ? (data.usageCount / data.maxUsage) * 100 : 0;
    const remainingUses = Math.max(0, data.maxUsage - data.usageCount);

    const stats = [
        {
            title: t("Total Usage"),
            value: data.usageCount,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/20"
        },
        {
            title: t("Remaining Uses"),
            value: remainingUses,
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/20"
        },
        {
            title: t("Min Order Amount"),
            value: `${currency}${data.minOrderAmount}`,
            icon: DollarSign,
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/20"
        },
        {
            title: t("Max Usage Limit"),
            value: data.maxUsage,
            icon: Clock,
            color: "text-orange-600",
            bgColor: "bg-orange-100 dark:bg-orange-900/20"
        }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {t("Coupon Statistics")}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>{t("Usage Progress")}</span>
                        <span>{data.usageCount} / {data.maxUsage}</span>
                    </div>
                    <Progress value={usagePercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                        {remainingUses} {t("uses remaining")}
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center space-y-2">
                            <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-xs text-muted-foreground">{stat.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}