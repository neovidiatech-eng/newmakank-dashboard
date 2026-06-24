import type { ApiResponseDelivery } from "@/pages/dashboard/orders/types";
import { User as UserIcon } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";

const imgUrl = import.meta.env.VITE_API_URL;

export default function DeliveryInfo({ delivery }: { delivery: ApiResponseDelivery | null | undefined }) {
    const t = useTranslations();

    if (!delivery?.User)
        return <div className="text-muted-foreground text-sm">{t("No Delivery Assigned")}</div>;

    const user = delivery.User;

    return (
        <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100 border">
                {user.image ? (
                    <Image src={imgUrl + user.image} alt={user.name} fill className="object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <UserIcon className="h-6 w-6 text-gray-400" />
                    </div>
                )}
            </div>
            <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground print:hidden">{user.phone}</div>
            </div>
        </div>
    );
}
