import type { ApiResponseAddress } from "@/pages/dashboard/orders/types";
import { ExternalLink, MapPin } from "lucide-react";
import { getTranslations } from "@/lib/i18n";

export default async function AddressInfo({ address }: { address: ApiResponseAddress | null | undefined }) {
    const t = await getTranslations();

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
        </div>
    );
}
