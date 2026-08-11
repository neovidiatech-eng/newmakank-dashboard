import type { ApiResponseOrderItemsItem } from "@/pages/dashboard/orders/types";
import { PriceAmount } from "@/components/PriceAmount";
import { Badge } from "@/components/ui/badge";
import { Gift, User as UserIcon, Package } from "lucide-react";
import { useLocale, useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";
import { getEnv } from "@/lib/env";

const imgUrl = getEnv("VITE_API_IMG_URL");

export default function OrderItemsList({ items, storeCommission }: { items: ApiResponseOrderItemsItem[], storeCommission?: number }) {
    const t = useTranslations();
    const locale = useLocale();

    // ── Group items by bundle ──────────────────────────────────────────────
    const bundleMap = new Map<number, { bundle: NonNullable<ApiResponseOrderItemsItem["OrderBundle"]>; items: ApiResponseOrderItemsItem[] }>();
    const regularItems: ApiResponseOrderItemsItem[] = [];

    for (const item of items) {
        if (item.orderBundleId && item.OrderBundle) {
            const existing = bundleMap.get(item.orderBundleId);
            if (existing) {
                existing.items.push(item);
            } else {
                bundleMap.set(item.orderBundleId, { bundle: item.OrderBundle, items: [item] });
            }
        } else {
            regularItems.push(item);
        }
    }

    // ── Single item renderer ───────────────────────────────────────────────
    const renderItem = (item: ApiResponseOrderItemsItem, insideBundle = false) => (
        <div
            key={item.id}
            className={`flex items-start gap-4 p-4 rounded-lg border ${
                insideBundle
                    ? "border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    : "border"
            }`}
        >
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
                <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-base truncate">
                            {item.Service?.name[locale as "en" | "ar"] || item.Service?.name.en}
                        </h4>
                        {item.isFree ? (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
                                <Gift className="h-3 w-3" />
                                {t("Free")}
                            </Badge>
                        ) : (
                            insideBundle && (
                                <Badge variant="outline" className="text-xs">
                                    {t("Paid")}
                                </Badge>
                            )
                        )}
                    </div>
                    <div className="font-semibold whitespace-nowrap">
                        {item.isFree ? (
                            <span className="text-green-600 dark:text-green-400 text-sm font-bold">0.00</span>
                        ) : (
                            <PriceAmount value={item.price} />
                        )}
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
    );

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* ── Bundle groups ─────────────────────────────────────────── */}
            {Array.from(bundleMap.values()).map(({ bundle, items: bundleItems }) => (
                <div key={bundle.id} className="rounded-xl border border-orange-200 dark:border-orange-800 overflow-hidden">
                    {/* Bundle header */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-orange-50 dark:bg-orange-950 border-b border-orange-200 dark:border-orange-800">
                        <Package className="h-4 w-4 text-orange-500" />
                        <span className="font-semibold text-orange-700 dark:text-orange-300">
                            {bundle.title?.[locale as "ar" | "en"] || bundle.title?.ar || bundle.title?.en}
                        </span>
                        {bundle.freeDiscountAmount > 0 && (
                            <Badge className="ms-auto text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                <Gift className="h-3 w-3 me-1" />
                                {t("Bundle Offer")}
                            </Badge>
                        )}
                    </div>
                    {/* Bundle items */}
                    <div className="flex flex-col gap-3 p-3">
                        {bundleItems.map((item) => renderItem(item, true))}
                    </div>
                </div>
            ))}

            {/* ── Regular items (no bundle) ──────────────────────────────── */}
            {regularItems.map((item) => renderItem(item, false))}
        </div>
    );
}


