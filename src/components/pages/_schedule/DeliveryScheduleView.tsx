import DeleteBtn from "@/components/common/table/tableActions/DeleteBtn.action";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Navigation, Target } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import dynamic from "@/lib/dynamic";
import { useState } from "react";
import "./delivery.css";

const DeliveryScheduleMap = dynamic(() => import("./DeliveryScheduleMap"), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-xl" />
});

export type ScheduleEntry = {
  id: number;
  day: string;
  openingTime: string;
  closingTime: string;
  requiredLat: number | null;
  requiredLng: number | null;
  requiredRadius: number | null;
};

interface DeliveryScheduleViewProps {
  schedule: ScheduleEntry[];
  locale: string;
}

export default function DeliveryScheduleView({ schedule, locale }: DeliveryScheduleViewProps) {
  const t = useTranslations();
  const [activeId, setActiveId] = useState<number | null>(null);

  const formatTime = (value?: string) => {
    if (!value) return t("Not Available");
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return t("Not Available");
    return date.toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {schedule?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl bg-muted/30">
            <Calendar className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-base font-medium text-muted-foreground">
              {t("No Schedule Entries")}
            </p>
          </div>
        ) : (
          schedule?.map(entry => (
            <div
              key={entry?.id}
              onClick={() => setActiveId(entry?.id)}
              className={cn(
                "group relative cursor-pointer rounded-xl border bg-card p-4 transition-all hover:shadow-md overflow-hidden",
                activeId === entry?.id
                  ? "ring-2 ring-primary border-transparent"
                  : "hover:border-primary/40"
              )}
            >
              <div
                className={cn(
                  "absolute top-0 left-0 w-1 h-full transition-colors",
                  activeId === entry?.id ? "bg-primary" : "bg-primary/20 group-hover:bg-primary"
                )}
              />

              <div className="flex justify-between items-start mb-3 pb-2 border-b border-border/40">
                <div className="flex flex-col gap-1">
                  <div className="font-semibold text-foreground capitalize leading-tight">
                    {t(entry?.day)}
                  </div>
                  {activeId === entry?.id && (
                    <Badge className="text-[10px] px-1.5 h-4 w-fit">{t("Selected")}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 -mt-1 -mr-1">
                  <DeleteBtn onDelete={["deliverySchedule"]} id={String(entry?.id)} />
                </div>
              </div>

              {(() => {
                const dOpen = new Date(entry.openingTime);
                const dClose = new Date(entry.closingTime);
                const is24Hrs =
                  !Number.isNaN(dOpen.getTime()) &&
                  !Number.isNaN(dClose.getTime()) &&
                  dOpen.getHours() === 0 &&
                  dOpen.getMinutes() === 0 &&
                  dClose.getHours() === 23 &&
                  dClose.getMinutes() === 59;

                if (is24Hrs) {
                  return (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20 mb-3">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm text-primary">
                        {t("Works 24 Hours")}
                      </span>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex flex-col gap-1 p-2 rounded-lg bg-muted/30 border border-border/40">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3 text-emerald-500" />
                        {t("OpeningTime")}
                      </div>
                      <div className="font-medium text-xs truncate">
                        {formatTime(entry?.openingTime)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 p-2 rounded-lg bg-muted/30 border border-border/40">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3 text-rose-500" />
                        {t("ClosingTime")}
                      </div>
                      <div className="font-medium text-xs truncate">
                        {formatTime(entry?.closingTime)}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {(entry?.requiredLat || entry?.requiredLng) && (
                <div className="flex items-center justify-between text-[11px] text-muted-foreground bg-primary/5 rounded px-2 py-1.5 border border-primary/10">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-indigo-400" />
                    <span>{t("Has Location")}</span>
                  </div>
                  {entry?.requiredRadius && (
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3 h-3 opacity-70" />
                      <span className="font-semibold">{entry?.requiredRadius}m</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="lg:col-span-2">
        <DeliveryScheduleMap
          schedules={schedule}
          activeScheduleId={activeId}
          onScheduleClick={id => setActiveId(id)}
          className="h-[600px] border border-border/50 rounded-2xl"
        />
      </div>
    </div>
  );
}
