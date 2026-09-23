import type { ApiResponseBranch, ApiResponseInvoice } from "@/pages/dashboard/orders/types";
import { MapPin } from "lucide-react";
import { useLocale, useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";
import { getEnv } from "@/lib/env";
import { useState } from "react";
const imgUrl = getEnv("VITE_API_IMG_URL");
export default function StoreInfo({
    branch,
    invoice,
}: {
    branch: ApiResponseBranch | null | undefined;
    invoice: ApiResponseInvoice | null | undefined;
}) {
    const t = useTranslations();
    const locale = useLocale();
    const [imgError, setImgError] = useState(false);

    const store = invoice?.store || (branch as any)?.Store || (branch as any)?.store;
    const storeName = store
        ? typeof store.name === "string"
            ? store.name
            : store.name?.[locale as "en" | "ar"] || store.name?.ar || store.name?.en || ""
        : "";
    const storeLogo = store?.logo;
    const storeAddress = store?.address || branch?.address;

    return (
        <>
            {store && (
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border flex items-center justify-center text-xs text-muted-foreground">
                        {storeLogo && storeLogo !== "null" && !imgError ? (
                            <Image
                                src={storeLogo.startsWith("http") ? storeLogo : imgUrl + storeLogo}
                                alt="Store Logo"
                                fill
                                className="object-cover"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <span>{storeName[0] || "?"}</span>
                        )}
                    </div>
                    <div>
                        <div className="font-medium">
                            {storeName}
                        </div>
                        {storeAddress && <div className="text-sm text-muted-foreground">{storeAddress}</div>}
                    </div>
                </div>
            )}

            {branch && (
                <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {branch.lat && branch.lng ? (
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${branch.lat},${branch.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {t("View Branch Location")}
                        </a>
                    ) : (
                        <span className="text-muted-foreground">{t("No location data")}</span>
                    )}
                </div>
            )}
        </>
    );
}
