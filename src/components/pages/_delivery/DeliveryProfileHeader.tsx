import ToggleStatus from "@/components/common/table/tableActions/ToggleStatus";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, User as UserIcon, Zap } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";
import { getEnv } from "@/lib/env";

const imgUrl = getEnv("VITE_API_URL");

export interface DeliveryUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  image?: string | null;
  avatar?: string | null;
  verified: boolean;
  isVerified?: boolean;
  active?: boolean;
  isActive?: boolean;
  isOnShift?: boolean;
  roleKey?: string;
  allowNotification?: boolean;
  forceAvailable?: boolean;
  isAvailable?: boolean;
  DeliveryDetails?: { forceAvailable: boolean }[];
}

export default function DeliveryProfileHeader({ data }: { data: DeliveryUser }) {
  const t = useTranslations();
  const forceAvailable = Boolean(data.isAvailable);
  const avatar = data.avatar ?? data.image;
  const isVerified = data.isVerified ?? data.verified;
  const isActiveStatus = Boolean(data.isActive ?? data.active ?? true);

  return (
    <div className="bg-card/50 border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center">
      <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-primary/5 border-4 border-background shadow-lg">
        {avatar ? (
          <Image src={imgUrl + avatar} alt={data.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary/40">
            <UserIcon className="size-10" />
          </div>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary uppercase text-[10px] tracking-wider font-bold">
              {t(data.roleKey ?? "Delivery")}
            </Badge>
            {isVerified && (
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-none">
                {t("Verified")}
              </Badge>
            )}
            {data.isOnShift ?? data.active ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none">
                {t("Working Today")}
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-none">
                {t("Not Working")}
              </Badge>
            )}
            {data.allowNotification !== undefined && (
              <Badge variant="outline" className={data.allowNotification ? "text-green-600 border-green-300" : "text-muted-foreground"}>
                {data.allowNotification ? t("Notifications On") : t("Notifications Off")}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Mail className="size-3.5" />
            <span>{data.email}</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
          <div className="flex items-center gap-1.5">
            <Phone className="size-3.5" />
            <span dir="ltr">{data.phone}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 pr-2">
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
          <div className="flex flex-col items-end mr-2">
            <span className="text-sm font-bold text-primary flex items-center gap-1">
              <UserIcon className="size-3 fill-primary" />
              {t("Account Status")}
            </span>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {t("Active Status")}
            </span>
          </div>
          <ToggleStatus
            id={data.id}
            body={{ active: !isActiveStatus }}
            isActive={isActiveStatus}
            endpoint={["delivery"]}
          />
        </div>
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
          <div className="flex flex-col items-end mr-2">
            <span className="text-sm font-bold text-primary flex items-center gap-1">
              <Zap className="size-3 fill-primary" />
              {t("Force Available")}
            </span>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {forceAvailable ? t("Always Available") : t("Scheduled Availability")}
            </span>
          </div>
          <ToggleStatus
            id={data.id}
            body={{ forceAvailable: !forceAvailable }}
            isActive={!!forceAvailable}
            endpoint={["delivery"]}
          />
        </div>
      </div>
    </div>
  );
}
