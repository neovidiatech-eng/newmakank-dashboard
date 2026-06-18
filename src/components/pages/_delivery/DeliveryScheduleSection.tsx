import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { CalendarClock, CalendarOff, Clock, MapPin, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { startTransition, useState, useEffect } from "react";

import { apiClient } from "@/lib/axios";
import MapPointerInput, { type MapPointer } from "@/components/common/Inputs/map/MapPointerInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import DeleteBtn from "@/components/common/table/tableActions/DeleteBtn.action";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "@/lib/i18n";

const DELIVERY_SCHEDULE_URL = "https://api-v1.makanak-app.com/api/deliveryData/schedule";

const dayOptions = [
  { value: "SUNDAY", label: "الأحد" },
  { value: "MONDAY", label: "الإثنين" },
  { value: "TUESDAY", label: "الثلاثاء" },
  { value: "WEDNESDAY", label: "الأربعاء" },
  { value: "THURSDAY", label: "الخميس" },
  { value: "FRIDAY", label: "الجمعة" },
  { value: "SATURDAY", label: "السبت" }
] as const;

type DayValue = (typeof dayOptions)[number]["value"];

type TimeFormValues = {
  openingTime: string;
  closingTime: string;
};

type DeliverySchedulePayload = {
  openingTime: string;
  closingTime: string;
  day: DayValue;
  deliveryId: number;
  requiredLat: number;
  requiredLng: number;
  requiredRadius: number;
};

const timeSchema = z
  .object({
    openingTime: z.string().min(1, "وقت البداية مطلوب"),
    closingTime: z.string().min(1, "وقت النهاية مطلوب")
  })
  .refine(data => data.closingTime > data.openingTime, {
    path: ["closingTime"],
    message: "وقت النهاية يجب أن يكون بعد وقت البداية"
  });

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string; result?: { message?: string } } | undefined;
    return data?.message || data?.result?.message || error.message;
  }
  if (error instanceof Error) return error.message;
  return "حدث خطأ أثناء حفظ الموعد";
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm font-medium text-destructive">{message}</p>;
}

export default function DeliveryScheduleSection({ data = [], deliveryId }: { data: any[], deliveryId: string }) {
  const router = useRouter();
  const t = useTranslations();
  const isValidDeliveryId = Number.isFinite(Number(deliveryId)) && Number(deliveryId) > 0;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayValue | null>(null);

  const [globalRadius, setGlobalRadius] = useState<string>("0");
  const [globalMap, setGlobalMap] = useState<MapPointer | null>({ lat: 24.7136, lng: 46.6753 });
  // Initialize map and radius from existing data if available
  useEffect(() => {
    if (data && data.length > 0) {
      const firstValid = data.find((d: any) => d.requiredLat || d.requiredRadius);
      if (firstValid) {
        if (firstValid.requiredLat && firstValid.requiredLng) {
          setGlobalMap({ lat: firstValid.requiredLat, lng: firstValid.requiredLng });
        }
        if (firstValid.requiredRadius) {
          setGlobalRadius(String(firstValid.requiredRadius));
        }
      }
    }
  }, [data]);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<TimeFormValues>({
    resolver: zodResolver(timeSchema),
    defaultValues: { openingTime: "00:00", closingTime: "02:00" }
  });

  const handleOpenDay = (dayValue: DayValue) => {
    setSelectedDay(dayValue);
    reset({
      openingTime: "00:00",
      closingTime: "02:00"
    });
    setOpenDialog(true);
  };

  const onSubmit = async (values: TimeFormValues) => {
    if (!isValidDeliveryId || !selectedDay) {
      toast.error("بيانات غير مكتملة");
      return;
    }

    if (Number(globalRadius) <= 0) {
      toast.error("يرجى تحديد نطاق التواجد بشكل صحيح في القسم الأيسر");
      return;
    }

    const payload: DeliverySchedulePayload = {
      openingTime: values.openingTime.substring(0, 5),
      closingTime: values.closingTime.substring(0, 5),
      day: selectedDay,
      deliveryId: Number(deliveryId),
      requiredLat: Number(globalMap?.lat ?? 0),
      requiredLng: Number(globalMap?.lng ?? 0),
      requiredRadius: Number(globalRadius)
    };

    try {
      const res = await apiClient.post(DELIVERY_SCHEDULE_URL, payload);
      toast.success(t("Success"));
      setOpenDialog(false);
      reset();

      // Refresh page
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);

      // Backend bug: It saves the schedule but crashes when formatting the response
      if (errorMessage && errorMessage.includes("Unsupported type for boolean conversion")) {
        toast.success(t("Success"));
        setOpenDialog(false);
        reset();

        startTransition(() => {
          router.refresh();
        });
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const toHHMM = (timeStr: string) => {
    if (!timeStr) return "00:00";
    if (timeStr.includes("T")) {
      const date = new Date(timeStr);
      // Format correctly, ignoring the 1970 part and just extracting HH:MM in UTC
      return timeStr.substring(timeStr.indexOf("T") + 1, timeStr.indexOf("T") + 6);
    }
    return timeStr.substring(0, 5);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Right Side: Days Grid */}
        <div className="flex-1 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            مواعيد وورديات العمل
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dayOptions.map(dayOption => {
              const daySchedules = data.filter((item: any) => {
                const itemDay = item.day || item.dayOfWeek || item.Day || item.day_of_week || "";
                return itemDay.toUpperCase() === dayOption.value.toUpperCase();
              });
              const isWorkingDay = daySchedules.length > 0;

              return (
                <Card
                  key={dayOption.value}
                  onClick={() => handleOpenDay(dayOption.value as DayValue)}
                  className={`relative overflow-hidden cursor-pointer transition-colors ${!isWorkingDay ? "bg-muted/50 border-dashed hover:bg-muted/80" : "shadow-sm hover:border-primary/50"}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-bold">{dayOption.label}</CardTitle>
                      {isWorkingDay ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
                            {t("Working")}
                          </Badge>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleOpenDay(dayOption.value as DayValue);
                            }}
                            className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1 hover:bg-primary/90 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                            {t("Add")}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <CalendarOff className="h-3 w-3" />
                            {t("No Shift")}
                          </Badge>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleOpenDay(dayOption.value as DayValue);
                            }}
                            className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-md flex items-center gap-1 hover:bg-primary/90 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                            {t("Add")}
                          </button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isWorkingDay ? (
                      <div className="space-y-3">
                        {daySchedules.map((entry: any, index) => {
                          const opening = entry.openingTime || entry.startTime || entry.from || entry.OpeningTime || "00:00";
                          const closing = entry.closingTime || entry.endTime || entry.to || entry.ClosingTime || "00:00";
                          return (
                            <div
                              key={entry.id}
                              className={`flex flex-col gap-2 ${index !== 0 ? "pt-3 border-t" : ""} p-2 rounded-md`}
                              onClick={e => e.stopPropagation()}
                            >
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>{t("OpeningTime")}: </span>
                                <span className="font-semibold text-foreground">
                                  {toHHMM(opening)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 text-destructive" />
                                <span>{t("ClosingTime")}: </span>
                                <span className="font-semibold text-foreground">
                                  {toHHMM(closing)}
                                </span>
                              </div>
                              <div className="flex items-center justify-end pt-1">
                                <DeleteBtn onDelete={["deliverySchedule"]} id={String(entry.id)} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-16 flex items-center justify-center text-muted-foreground text-sm italic">
                        {t("No Shift")}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Left Side: Map & Radius Settings */}
        <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col gap-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            إعدادات الموقع الموحدة
          </h3>
          <Card className="border-border/60 bg-card/80 sticky top-24">
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="globalRadius">نطاق التواجد المطلوب للمندوب</Label>
                <Input
                  id="globalRadius"
                  type="number"
                  min="0"
                  step="any"
                  inputMode="decimal"
                  value={globalRadius}
                  onChange={e => setGlobalRadius(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">سيتم تطبيق هذا النطاق على أي وردية جديدة يتم إضافتها.</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  الموقع الافتراضي
                </Label>
                <div className="min-h-[350px] border rounded-lg overflow-hidden relative z-0">
                  <MapPointerInput
                    value={globalMap}
                    onChange={setGlobalMap}
                    defaultCenter={globalMap || { lat: 24.7136, lng: 46.6753 }}
                    placeholder="ابحث عن الموقع"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal for adding Shifts */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              إضافة وردية - {dayOptions.find(d => d.value === selectedDay)?.label}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="openingTime">{t("OpeningTime")}</Label>
                <Input id="openingTime" type="time" disabled={isSubmitting} {...register("openingTime")} />
                <FieldError message={errors.openingTime?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="closingTime">{t("ClosingTime")}</Label>
                <Input id="closingTime" type="time" disabled={isSubmitting} {...register("closingTime")} />
                <FieldError message={errors.closingTime?.message} />
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground border">
              <MapPin className="inline-block h-4 w-4 mr-1 ml-2 text-primary" />
              سيتم حفظ الوردية باستخدام (النطاق: <strong>{globalRadius}</strong>) والموقع المحدد في الخريطة الخارجية.
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t mt-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                {t("Cancel")}
              </Button>
              <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? t("save") + "..." : t("save")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
