import { currency } from "@/utils/config";
import { useLocale } from "@/lib/i18n";

interface PriceAmountProps {
    value: number | string | null | undefined;
}

export function PriceAmount({ value }: PriceAmountProps) {
    const locale = useLocale();
    const numberValue = Number(value ?? 0);
    const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
        maximumFractionDigits: 2
    }).format(Number.isFinite(numberValue) ? numberValue : 0);

    return <span>{formatted} {currency.trim()}</span>;
}