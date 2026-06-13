import type { ApiResponseBranch, ApiResponseInvoice } from "@/pages/dashboard/orders/types";
import { MapPin } from "lucide-react";
import { useLocale, useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";

const imgUrl = import.meta.env.VITE_API_URL;

export default function StoreInfo({
    branch,
    invoice,
}: {
    branch: ApiResponseBranch | null | undefined;
    invoice: ApiResponseInvoice | null | undefined;
}) {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <>
            {invoice?.store && (
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 border">
                        {invoice.store.logo && (
                            <Image
                                src={imgUrl + invoice.store.logo}
                                alt="Store Logo"
                                fill
                                className="object-cover"
                            />
                        )}
                    </div>
                    <div>
                        <div className="font-medium">
                            {invoice.store.name[locale as "en" | "ar"] || invoice.store.name.en}
                        </div>
                        <div className="text-sm text-muted-foreground">{invoice.store.address}</div>
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
