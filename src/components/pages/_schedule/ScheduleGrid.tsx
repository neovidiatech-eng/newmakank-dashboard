import DeleteBtn from "@/components/common/table/tableActions/DeleteBtn.action";
import ScheduleFormPage from "@/components/pages/_schedule/scheduleForm.page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { daysOptions } from "@/utils/options/typesOptions";
import { CalendarOff, Clock, Plus } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { startTransition, useState } from "react";

interface ScheduleItem {
  id: number;
  openingTime: string;
  closingTime: string;
  day: string;
  branchId: number;
}

interface ScheduleGridProps {
  data: ScheduleItem[];
  branchId?: string;
}

type EditableScheduleData = {
  id?: number;
  branchId?: number;
  day: string;
  openingTime: string;
  closingTime: string;
};

export default function ScheduleGrid({ data, branchId }: ScheduleGridProps) {
  const t = useTranslations();
  const router = useRouter();
  const days = daysOptions(t);
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<EditableScheduleData | undefined>(undefined);

  const sharedBranchId = branchId || (data[0]?.branchId ? String(data[0].branchId) : undefined);

  const toHHMM = (timeStr: string) => {
    const parsedDate = new Date(timeStr);
    if (!Number.isNaN(parsedDate.getTime())) {
      return `${String(parsedDate.getHours()).padStart(2, "0")}:${String(parsedDate.getMinutes()).padStart(2, "0")}`;
    }

    const match = timeStr.match(/(\d{2}:\d{2})/);
    return match ? match[1] : "";
  };

  const formatTime = (timeStr: string) => {
    try {
      return new Date(timeStr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      });
    } catch {
      return timeStr;
    }
  };

  const handleOpenDay = (dayValue: string, scheduleEntry?: ScheduleItem) => {
    const resolvedBranchId =
      scheduleEntry?.branchId || (sharedBranchId ? Number(sharedBranchId) : undefined);

    setSelectedData({
      id: scheduleEntry?.id,
      branchId: resolvedBranchId,
      day: dayValue,
      openingTime: scheduleEntry ? toHHMM(scheduleEntry.openingTime) : "",
      closingTime: scheduleEntry ? toHHMM(scheduleEntry.closingTime) : ""
    });
    setOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
        {days.map(dayOption => {
          const scheduleEntries = data.filter(
            item => item.day.toUpperCase() === dayOption.value.toUpperCase()
          );
          const isWorkingDay = scheduleEntries.length > 0;

          return (
            <Card
              key={dayOption.value}
              onClick={() => !isWorkingDay && handleOpenDay(String(dayOption.value))}
              className={`relative overflow-hidden ${!isWorkingDay ? "bg-muted/50 border-dashed cursor-pointer" : "shadow-sm"}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-bold">{dayOption.label}</CardTitle>
                  {isWorkingDay ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="green">{t("Work")}</Badge>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleOpenDay(String(dayOption.value));
                        }}
                        className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1 hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        {t("Add")}
                      </button>
                    </div>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CalendarOff className="h-3 w-3" />
                      {t("Off Day")}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isWorkingDay ? (
                  <div className="space-y-4">
                    {scheduleEntries.map((entry, index) => (
                      <div
                        key={entry.id}
                        className={`flex flex-col gap-2 ${index !== 0 ? "pt-4 border-t" : ""} cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors`}
                        onClick={e => {
                          e.stopPropagation();
                          handleOpenDay(String(dayOption.value), entry);
                        }}
                      >
                        {toHHMM(entry.openingTime) === "00:00" && toHHMM(entry.closingTime) === "23:59" ? (
                          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <Clock className="h-4 w-4" />
                            <span>{t("Works 24 Hours")}</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 text-primary" />
                              <span>{t("OpeningTime")}: </span>
                              <span className="font-semibold text-foreground">
                                {formatTime(entry.openingTime)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 text-destructive" />
                              <span>{t("ClosingTime")}: </span>
                              <span className="font-semibold text-foreground">
                                {formatTime(entry.closingTime)}
                              </span>
                            </div>
                          </>
                        )}
                        <div
                          className="flex justify-end pt-1"
                          onClick={event => event.stopPropagation()}
                        >
                          <DeleteBtn onDelete={["schedule"]} id={String(entry.id)} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-24 flex items-center justify-center text-muted-foreground text-sm italic">
                    {t("Closed")}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("Schedule Information")}</DialogTitle>
          </DialogHeader>
          <ScheduleFormPage
            data={selectedData}
            branchId={sharedBranchId}
            redirectOnSuccess={false}
            onSuccess={() => {
              setOpen(false);
              startTransition(() => {
                router.refresh();
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
