import { stores } from "@/pages/dashboard/stores/types";
import { StatCard } from "@/components/ui/dashboard-primitives";
import ChangeTimeFormat from "@/utils/ChangeTimeFormat";
import { CalendarDays, MapPin, ShieldCheck, Mail, Phone } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

interface StoreStatsProps {
  data: stores;
}

export function StoreStats({ data }: StoreStatsProps) {
  const t = useTranslations();

  const users = Array.isArray((data as any)?.User) ? (data as any)?.User : [];
  const primaryUser = users[0] || (data as any)?.User;
  
  const email = primaryUser?.email;
  const phone = primaryUser?.phone || data?.phone;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      <StatCard
        icon={CalendarDays}
        label={t("createdAt")}
        value={ChangeTimeFormat({
          time: data?.createdAt,
          hour: false,
          hour12: false,
          minute: false
        })}
      />
      <StatCard
        icon={ShieldCheck}
        label={t("Status")}
        value={data?.status}
        valueClassName={data?.status === "OPEN" ? "text-green-600" : "text-muted-foreground"}
      />
      {data?.address && <StatCard icon={MapPin} label={t("address")} value={data.address} />}
      {email && <StatCard icon={Mail} label={t("Email")} value={email} className="break-all" />}
      {phone && <StatCard icon={Phone} label={t("Phone")} value={<span dir="ltr">{phone}</span>} />}
    </div>
  );
}
