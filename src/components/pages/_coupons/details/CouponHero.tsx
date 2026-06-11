import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, DollarSign, Percent, Ticket } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

interface CouponHeroProps {
    data: {
        id: number;
        title: { en: string; ar: string };
        code: string;
        type: string;
        discountType: string;
        discountValue: number;
        startDate: string;
        endDate: string;
    };
}

export function CouponHero({ data }: CouponHeroProps) {
    const t = useTranslations();

    const getTitle = (title: { en: string; ar: string }) => {
        return title?.en || title?.ar || "N/A";
    };

    const getDiscountDisplay = () => {
        if (data.discountType === "PERCENTAGE") {
            return `${data.discountValue}%`;
        }
        return `$${data.discountValue}`;
    };

    const isExpired = new Date(data.endDate) < new Date();
    const isActive = new Date(data.startDate) <= new Date() && !isExpired;

    return (
        <Card className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Ticket className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold mb-2">{getTitle(data.title)}</h1>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-lg px-4 py-1 font-mono bg-white/20 text-white border-white/30">
                                    {data.code}
                                </Badge>
                                <Badge variant={isActive ? "default" : "destructive"} className="bg-white/20 text-white border-white/30">
                                    {isActive ? t("Active") : isExpired ? t("Expired") : t("Inactive")}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                {data.discountType === "PERCENTAGE" ? (
                                    <Percent className="w-4 h-4" />
                                ) : (
                                    <DollarSign className="w-4 h-4" />
                                )}
                                <span className="font-semibold">{t("Discount")}: {getDiscountDisplay()}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {t("Valid")}: {new Date(data.startDate).toLocaleDateString()} - {new Date(data.endDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}