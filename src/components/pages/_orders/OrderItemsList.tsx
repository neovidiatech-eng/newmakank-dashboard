import type { ApiResponseOrderItemsItem } from "@/pages/dashboard/orders/types";
import { PriceAmount } from "@/components/PriceAmount";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon } from "lucide-react";
import { useLocale, useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";

const imgUrl = import.meta.env.VITE_API_URL;

export default function OrderItemsList({ items, storeCommission }: { items: ApiResponseOrderItemsItem[], storeCommission?: number }) {
    const t = useTranslations();
    const locale = useLocale();

    const getOriginalPrice = (item: any) => {
        const commission = storeCommission || 0;
        return item.price - commission;
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {items.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="relative h-20 w-20 min-w-20 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 print:hidden">
                        {item.Service?.image ? (
                            <Image
                                src={imgUrl + item.Service.image}
                                alt={item.Service.name[locale as "en" | "ar"] || item.Service.name.en}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <UserIcon className="h-8 w-8" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-base truncate">
                                {item.Service?.name[locale as "en" | "ar"] || item.Service?.name.en}
                            </h4>
                            <div className="flex flex-col items-end">
                                <div className="font-semibold">
                                    <PriceAmount value={getOriginalPrice(item)} />
                                </div>
                            </div>
                        </div>

                        <div className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium">{t("Quantity")}:</span> {item.quantity} |{" "}
                            <span className="font-medium">{t("Size")}:</span>{" "}
                            {item.Size?.name[locale as "en" | "ar"] || item.Size?.name.en}
                        </div>

                        {item.OrderItemAddons.length > 0 && (
                            <div className="mt-2 text-sm">
                                <span className="font-medium text-muted-foreground">{t("Addons")}: </span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {item.OrderItemAddons.map((addon) => (
                                        <Badge key={addon.id} variant="secondary" className="text-xs">
                                            {addon.Addon.name[locale as "en" | "ar"] || addon.Addon.name.en}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
