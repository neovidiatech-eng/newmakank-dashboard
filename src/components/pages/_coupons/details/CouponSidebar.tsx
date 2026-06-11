import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Copy, Users } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

interface CouponSidebarProps {
    data: {
        id: number;
        code: string;
        startDate: string;
        endDate: string;
        maxUsage: number;
        usageCount: number;
        type: string;
    };
}

export function CouponSidebar({ data }: CouponSidebarProps) {
    const t = useTranslations();

    const isExpired = new Date(data.endDate) < new Date();
    const isActive = new Date(data.startDate) <= new Date() && !isExpired;
    const daysRemaining = Math.ceil((new Date(data.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    const copyToClipboard = () => {
        navigator.clipboard.writeText(data.code);
    };

    const getStatusColor = () => {
        if (isExpired) return "destructive";
        if (isActive) return "default";
        return "secondary";
    };

    const getStatusText = () => {
        if (isExpired) return t("Expired");
        if (isActive) return t("Active");
        return t("Inactive");
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        {t("Status & Actions")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{t("Status")}</p>
                        <Badge variant={getStatusColor()}>
                            {getStatusText()}
                        </Badge>
                    </div>

                    {!isExpired && (
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">{t("Days Remaining")}</p>
                            <p className="text-2xl font-bold text-green-600">
                                {daysRemaining > 0 ? daysRemaining : 0}
                            </p>
                        </div>
                    )}

                    <Separator />

                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={copyToClipboard}
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            {t("Copy Code")}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {t("Usage Summary")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>{t("Used")}</span>
                            <span className="font-semibold">{data.usageCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>{t("Remaining")}</span>
                            <span className="font-semibold text-green-600">
                                {Math.max(0, data.maxUsage - data.usageCount)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>{t("Total Limit")}</span>
                            <span className="font-semibold">{data.maxUsage}</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{t("Usage Rate")}</p>
                        <p className="text-lg font-bold">
                            {data.maxUsage > 0 ? Math.round((data.usageCount / data.maxUsage) * 100) : 0}%
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {t("Validity Period")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t("Start Date")}</p>
                            <p className="text-sm">
                                {new Date(data.startDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t("End Date")}</p>
                            <p className="text-sm">
                                {new Date(data.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}