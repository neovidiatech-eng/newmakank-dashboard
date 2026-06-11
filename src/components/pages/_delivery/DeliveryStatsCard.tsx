import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { getTranslations } from "@/lib/i18n";

export interface DeliveryDetails {
    rating?: number;
    review?: number;
    bestRated?: boolean;
    availableNow?: boolean;
}

export default async function DeliveryStatsCard({ details }: { details: DeliveryDetails | null | undefined }) {
    const t = await getTranslations();

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>{t("Delivery Stats")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex flex-col items-center gap-1 p-3 rounded-xl border bg-muted/20">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="text-2xl font-bold">{details?.rating ?? 0}</span>
                        <span className="text-xs text-muted-foreground">{t("Rating")}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-3 rounded-xl border bg-muted/20">
                        <Star className="h-5 w-5 text-blue-500" />
                        <span className="text-2xl font-bold">{details?.review ?? 0}</span>
                        <span className="text-xs text-muted-foreground">{t("Reviews")}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-3 rounded-xl border bg-muted/20">
                        <span className={`text-2xl font-bold ${details?.bestRated ? "text-emerald-600" : "text-muted-foreground"}`}>
                            {details?.bestRated ? "★" : "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">{t("Best Rated")}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-3 rounded-xl border bg-muted/20">
                        <span className={`h-3 w-3 rounded-full mt-1 ${details?.availableNow ? "bg-emerald-500" : "bg-rose-400"}`} />
                        <span className="text-xs text-muted-foreground mt-1">{t("Available Now")}</span>
                    </div>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className={details?.bestRated ? "text-yellow-600 border-yellow-300" : ""}>
                        {t("Best Rated")}: {details?.bestRated ? t("Yes") : t("No")}
                    </Badge>
                    <Badge variant="outline" className={details?.availableNow ? "text-emerald-600 border-emerald-300" : ""}>
                        {t("Available Now")}: {details?.availableNow ? t("Yes") : t("No")}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}
