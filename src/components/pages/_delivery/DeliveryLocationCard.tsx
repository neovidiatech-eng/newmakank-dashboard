import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, ExternalLink, MapPin } from "lucide-react";
import { getLocale, getTranslations } from "@/lib/i18n";

export interface DeliveryLocationDetails {
    lat?: number | null;
    lng?: number | null;
    bearing?: number | null;
    lastLocationUpdate?: string | null;
}

export default async function DeliveryLocationCard({ details }: { details: DeliveryLocationDetails | null | undefined }) {
    const t = await getTranslations();
    const locale = await getLocale();

    const formatDateTime = (value?: string | null) => {
        if (!value) return t("Not Available");
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return t("Not Available");
        return date.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const hasLocation = Boolean(details?.lat && details?.lng);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("Location Details")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{t("Last Location Update")}:</span>
                </div>
                <div className="font-medium">{formatDateTime(details?.lastLocationUpdate)}</div>
                <Separator />
                <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                        <div>
                            {hasLocation
                                ? `${details!.lat!.toFixed(6)}, ${details!.lng!.toFixed(6)}`
                                : t("Not Available")}
                        </div>
                        {hasLocation && (
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${details!.lat},${details!.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                            >
                                {t("View on Map")} <ExternalLink className="h-3 w-3" />
                            </a>
                        )}
                    </div>
                </div>
                {details?.bearing != null && (
                    <>
                        <Separator />
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span>{t("Bearing")}:</span>
                            <span className="font-medium text-foreground">{details.bearing}°</span>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
