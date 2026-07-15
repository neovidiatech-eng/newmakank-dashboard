import type { ApiResponseAddress } from "@/pages/dashboard/orders/types";
import { ExternalLink, MapPin, LocateFixed } from "lucide-react";
import { useTranslations, useLocale } from "@/lib/i18n";
import { useApiQuery } from "@/hooks/useApiQuery";
import { Badge } from "@/components/ui/badge";

export default function AddressInfo({
    address,
    zoneId
}: {
    address: ApiResponseAddress | null | undefined;
    zoneId?: number | null;
}) {
    const t = useTranslations();
    const locale = useLocale();

    const { data: zoneResponse } = useApiQuery({
        queryKey: ["order-address-zone", zoneId],
        endPoint: ["zones", zoneId as number],
        enabled: Boolean(zoneId),
        staleTime: 5 * 60_000
    });
    const zone = zoneResponse?.data;
    const zoneName = zone?.name?.[locale] || zone?.name?.ar || zone?.name?.en;

    if (!address)
        return <div className="text-muted-foreground text-sm">{t("No Address Provided")}</div>;

    return (
        <div className="text-sm">
            <div className="font-medium flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-primary" /> {address.title}
            </div>
            <div className="text-muted-foreground pl-6 mb-2">{address.adress}</div>
            {(address.lat || address.lng) && (
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${address.lat},${address.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 pl-6"
                >
                    {t("View on Map")} <ExternalLink className="h-3 w-3" />
                </a>
            )}
            {zoneId && (
                <div className="flex items-center gap-1.5 pl-6 mt-2">
                    <LocateFixed className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{t("customerSelectedZone")}:</span>
                    <Badge variant="outline" className="text-xs font-medium">
                        {zoneName || `#${zoneId}`}
                    </Badge>
                </div>
            )}
        </div>
    );
}
