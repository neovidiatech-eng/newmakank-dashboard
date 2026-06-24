"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "@/lib/i18n";
import type { ApiResponseOrderItemsItem } from "@/pages/dashboard/orders/types";

interface CopyOrderButtonProps {
    orderId: string | number;
    items: ApiResponseOrderItemsItem[];
    storeCommission?: number;
}

export default function CopyOrderButton({ orderId, items, storeCommission }: CopyOrderButtonProps) {
    const t = useTranslations();
    const locale = useLocale();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const getOriginalPrice = (item: any) => {
            const commission = storeCommission || 0;
            return item.price - commission;
        };

        const title = `${t("Order Details")} #${orderId}\n\n`;
        
        const itemsText = items.map(item => {
            const name = item.Service?.name[locale as "en" | "ar"] || item.Service?.name.en || "";
            const price = getOriginalPrice(item);
            const size = item.Size?.name[locale as "en" | "ar"] || item.Size?.name.en || "";
            
            let text = `- ${name}\n`;
            text += `  ${t("Quantity")}: ${item.quantity} | ${t("Size")}: ${size}\n`;
            text += `  ${t("Price")}: ${price}\n`;
            
            if (item.OrderItemAddons && item.OrderItemAddons.length > 0) {
                const addonsList = item.OrderItemAddons.map(addon => 
                    addon.Addon.name[locale as "en" | "ar"] || addon.Addon.name.en
                ).join(", ");
                text += `  ${t("Addons")}: ${addonsList}\n`;
            }
            return text;
        }).join("\n");

        const fullText = title + itemsText;

        try {
            await navigator.clipboard.writeText(fullText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const copyText = locale === "ar" ? "نسخ التفاصيل" : "Copy Details";
    const copiedText = locale === "ar" ? "تم النسخ" : "Copied";

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
