import type { ApiResponseCustomer } from "@/pages/dashboard/orders/types";
import { User as UserIcon } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";
import { useState } from "react";

const imgUrl = import.meta.env.VITE_API_IMG_URL;
export default function CustomerInfo({ customer }: { customer: ApiResponseCustomer | null | undefined }) {
    const t = useTranslations();
    const [imgError, setImgError] = useState(false);

    if (!customer)
        return <div className="text-muted-foreground text-sm">{t("No Customer Info")}</div>;

    return (
        <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100 border">
                {customer.image && customer.image !== "null" && !imgError ? (
                    <Image src={customer.image.startsWith("http") ? customer.image : imgUrl + customer.image} alt={customer.name} fill className="object-cover" onError={() => setImgError(true)} />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <UserIcon className="h-6 w-6 text-gray-400" />
                    </div>
                )}
            </div>
            <div>
                <div className="font-medium">{customer.name}</div>
                <div className="text-sm text-muted-foreground print:hidden" dir="ltr">
                    {customer.phone}
                </div>
            </div>
        </div>
    );
}
