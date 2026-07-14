import type { ApiResponseDelivery } from "@/pages/dashboard/orders/types";
import { User as UserIcon } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";
import { getEnv } from "@/lib/env";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const imgUrl = getEnv("VITE_API_IMG_URL");

const KIND_STYLES: Record<string, string> = {
  ONLINE: "border-sky-400 text-sky-600 dark:text-sky-400",
  PURCHASE: "border-amber-400 text-amber-600 dark:text-amber-400",
  RESTAURANT: "border-orange-400 text-orange-600 dark:text-orange-400"
};

const KIND_LABEL: Record<string, string> = {
  ONLINE: "مندوب أونلاين",
  PURCHASE: "مندوب مشتريات",
  RESTAURANT: "مندوب مطاعم"
};

export default function DeliveryInfo({
  delivery,
  deliveryKind
}: {
  delivery: ApiResponseDelivery | null | undefined;
  deliveryKind?: "ONLINE" | "PURCHASE" | "RESTAURANT" | null;
}) {
    const t = useTranslations();
    const [imgError, setImgError] = useState(false);

    if (!delivery?.User)
        return <div className="text-muted-foreground text-sm">{t("No Delivery Assigned")}</div>;

    const user = delivery.User;

    return (
        <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100 border">
                {user.image && user.image !== "null" && !imgError ? (
                    <Image src={user.image.startsWith("http") ? user.image : imgUrl + user.image} alt={user.name} fill className="object-cover" onError={() => setImgError(true)} />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <UserIcon className="h-6 w-6 text-gray-400" />
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-medium">
                    <span>{user.name}</span>
                    <span className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">#{user.id}</span>
                </div>
                <div className="text-sm text-muted-foreground print:hidden">{user.phone}</div>
                {deliveryKind && (
                    <Badge
                        variant="outline"
                        className={`text-xs font-semibold ${KIND_STYLES[deliveryKind] ?? ""}`}
                    >
                        {KIND_LABEL[deliveryKind] ?? deliveryKind}
                    </Badge>
                )}
            </div>
        </div>
    );
}
