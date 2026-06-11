import { stores } from "@/pages/dashboard/stores/types";
import { StatCard } from "@/components/ui/dashboard-primitives";
import ChangeTimeFormat from "@/utils/ChangeTimeFormat";
import { CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

interface StoreStatsProps {
  data: stores;
}

export function StoreStats({ data }: StoreStatsProps) {
  const t = useTranslations();

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
    </div>
  );
}
