"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "@/lib/i18n";
import type { ApiResponseOrderItemsItem } from "@/pages/dashboard/orders/types";
import { currency } from "@/utils/config";

interface CopyOrderButtonProps {
    orderId: string | number;
    items: ApiResponseOrderItemsItem[];
    /** Full order data for summary block */
    orderData?: {
        price?: number;
        shipping?: number;
        tax?: number;
        discountAmount?: number;
        totalPriceAfterDiscount?: number;
        totalPrice?: number;
        storeCommission?: number;
        globalCommission?: number;
        paymentMethod?: string;
        type?: string;
        customDeliveryKind?: "ONLINE" | "PURCHASE" | "RESTAURANT" | null;
        Delivery?: { User?: { id?: number; name?: string; phone?: string } } | null;
    };
}

function fmt(value: number | null | undefined, locale: string) {
    if (value == null || isNaN(Number(value))) return `0 ${currency}`;
    const loc = locale === "ar" ? "ar-EG" : "en-US";
    return `${Number(value).toLocaleString(loc, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export default function CopyOrderButton({ orderId, items, orderData }: CopyOrderButtonProps) {
    const t = useTranslations();
    const locale = useLocale();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const lines: string[] = [];

        lines.push(`🧾 ${t("Order Details")} #${orderId}`);
        lines.push("──────────────────────────");

        // Delivery kind — use customDeliveryKind if set, else fall back to order type
        const kind = orderData?.customDeliveryKind;
        const orderTypeFallback = (orderData as any)?.type as string | undefined;
        
        let kindLabel = "";
        if (kind) {
            kindLabel = t(kind) || kind;
        } else if (orderTypeFallback) {
            kindLabel = t(orderTypeFallback) || orderTypeFallback;
        }

        if (kindLabel) {
            lines.push(`🚚 ${kindLabel}`);
        }
        if (orderData?.Delivery?.User?.name) {
            const driverId = orderData.Delivery.User.id;
            const idPart = driverId ? ` (#${driverId})` : "";
            lines.push(`👤 ${orderData.Delivery.User.name}${idPart} — ${orderData.Delivery.User.phone ?? ""}`);
        }

        lines.push("");
        lines.push(`📦 ${t("Order Items")}:`);

        items.forEach(item => {
            const name = item.Service?.name[locale as "en" | "ar"] || item.Service?.name.en || "";
            const size = item.Size?.name[locale as "en" | "ar"] || item.Size?.name.en || "";
            lines.push(`  • ${name}`);
            lines.push(`    ${t("Quantity")}: ${item.quantity}  |  ${t("Size")}: ${size}`);
            lines.push(`    ${t("Price")}: ${fmt(item.price, locale)}`);
            if (item.OrderItemAddons && item.OrderItemAddons.length > 0) {
                const addonsList = item.OrderItemAddons
                    .map(a => a.Addon.name[locale as "en" | "ar"] || a.Addon.name.en)
                    .join(", ");
                lines.push(`    ${t("Addons")}: ${addonsList}`);
            }
        });

        // Price summary
        if (orderData) {
            lines.push("");
            lines.push("──────────────────────────");
            lines.push(`💰 ${t("Payment Details")}:`);
            lines.push(`  ${t("Subtotal")}: ${fmt(orderData.price, locale)}`);
            if ((orderData.shipping ?? 0) > 0) {
                lines.push(`  ${t("Shipping")}: ${fmt(orderData.shipping, locale)}`);
            }
            if ((orderData.tax ?? 0) > 0) {
                lines.push(`  ${t("Tax")}: ${fmt(orderData.tax, locale)}`);
            }
            if ((orderData.discountAmount ?? 0) > 0) {
                lines.push(`  ${t("Discount")}: -${fmt(orderData.discountAmount, locale)}`);
            }
            if ((orderData.storeCommission ?? 0) > 0) {
                lines.push(`  ${t("Store Commission")}: ${fmt(orderData.storeCommission, locale)}`);
            }
            if ((orderData.globalCommission ?? 0) > 0) {
                lines.push(`  ${t("Platform Fee")}: ${fmt(orderData.globalCommission, locale)}`);
            }
            const total = orderData.totalPriceAfterDiscount ?? (orderData as any)?.totalPrice ?? orderData.price;
            lines.push(`  ━━━━━━━━━━━━━━━━━━━━━━`);
            lines.push(`  ${t("Total")}: ${fmt(total, locale)}`);
            if (orderData.paymentMethod) {
                lines.push(`  ${t("Payment Method")}: ${t(orderData.paymentMethod) || orderData.paymentMethod}`);
            }
        }

        const fullText = lines.join("\n");

        try {
            await navigator.clipboard.writeText(fullText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // clipboard unavailable
        }
    };

    const copyText = locale === "ar" ? "نسخ التفاصيل" : "Copy Details";
    const copiedText = locale === "ar" ? "تم النسخ ✓" : "Copied ✓";

    return (
        <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleCopy}
        >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? copiedText : copyText}</span>
        </Button>
    );
}
