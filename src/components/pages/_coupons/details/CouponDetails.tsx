import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currency } from "@/utils/config";
import { Building, Calendar, DollarSign, Hash, MapPin, Percent, Tag } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

interface CouponDetailsProps {
    data: {
        id: number;
        title: { en: string; ar: string };
        code: string;
        type: string;
        discountType: string;
        discountValue: number;
        maxUsage: number;
        usageCount: number;
        minOrderAmount: number;
        startDate: string;
        endDate: string;
        minDiscountValue: number;
        maxDiscountValue: number;
        createdAt: string;
        UserCoupons?: any[];
        StoreCoupons?: any[];
        ZoneCoupons?: any[];
        ModuleCoupons?: any[];
    };
}

export function CouponDetails({ data }: CouponDetailsProps) {
    const t = useTranslations();

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const details = [
        {
            label: t("Coupon ID"),
            value: `#${data.id}`,
            icon: Hash
        },
        {
            label: t("Title (English)"),
            value: data.title?.en || "N/A",
            icon: Tag
        },
        {
            label: t("Title (Arabic)"),
            value: data.title?.ar || "N/A",
            icon: Tag
        },
        {
            label: t("Code"),
            value: data.code,
            icon: Tag
        },
        {
            label: t("Type"),
            value: data.type,
            icon: MapPin
        },
        {
            label: t("Discount Type"),
            value: data.discountType,
            icon: data.discountType === "PERCENTAGE" ? Percent : DollarSign
        },
        {
            label: t("Discount Value"),
            value: data.discountType === "PERCENTAGE" ? `${data.discountValue}%` : `${currency}${data.discountValue}`,
            icon: data.discountType === "PERCENTAGE" ? Percent : DollarSign
        },
        {
            label: t("Minimum Order Amount"),
            value: `${currency}${data.minOrderAmount}`,
            icon: DollarSign
        },
        {
            label: t("Minimum Discount Value"),
            value: `${currency}${data.minDiscountValue}`,
            icon: DollarSign
        },
        {
            label: t("Maximum Discount Value"),
            value: `${currency}${data.maxDiscountValue}`,
            icon: DollarSign
        },
        {
            label: t("Start Date"),
            value: formatDate(data.startDate),
            icon: Calendar
        },
        {
            label: t("End Date"),
            value: formatDate(data.endDate),
            icon: Calendar
        },
        {
            label: t("Created At"),
            value: formatDate(data.createdAt),
            icon: Calendar
        }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    {t("Coupon Details")}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {details.map((detail, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <detail.icon className="w-4 h-4" />
                                {detail.label}
                            </div>
                            <p className="text-sm font-semibold">{detail.value}</p>
                        </div>
                    ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {t("Associated Entities")}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">{t("Users")}</p>
                            <Badge variant="outline">
                                {data.UserCoupons?.length || 0} {t("users")}
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">{t("Stores")}</p>
                            <Badge variant="outline">
                                {data.StoreCoupons?.length || 0} {t("stores")}
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">{t("Zones")}</p>
                            <Badge variant="outline">
                                {data.ZoneCoupons?.length || 0} {t("Zones")}
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">{t("Modules")}</p>
                            <Badge variant="outline">
                                {data.ModuleCoupons?.length || 0} {t("modules")}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
