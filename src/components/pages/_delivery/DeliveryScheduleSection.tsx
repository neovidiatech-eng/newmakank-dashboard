import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { CalendarClock, Check, MapPin } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { apiClient } from "@/lib/axios";
import MapPointerInput, { type MapPointer } from "@/components/common/Inputs/map/MapPointerInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

type DeliveryScheduleFormValues = {
  day: DayValue;
  openingTime: string;
  closingTime: string;
  map: MapPointer | null;
  requiredRadius: string;
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

const requiredNumber = (message: string) =>
  z
    .string()
    .min(1, message)
    .refine(value => Number.isFinite(Number(value)), "القيمة يجب أن تكون رقمًا صحيحًا");

const deliveryScheduleSchema = z
  .object({
    day: z.enum(dayOptions.map(day => day.value) as [DayValue, ...DayValue[]], {
      required_error: "اليوم مطلوب",
      invalid_type_error: "اختر يومًا صحيحًا"
    }),
    openingTime: z.string().min(1, "وقت البداية مطلوب"),
    closingTime: z.string().min(1, "وقت النهاية مطلوب"),
    map: z
      .object({
        lat: z.number(),
        lng: z.number()
      })
      .nullable()
      .refine(value => value !== null, "الموقع مطلوب"),
    requiredRadius: requiredNumber("نطاق التواجد مطلوب").refine(
      value => Number(value) >= 0,
      "نطاق التواجد لا يمكن أن يكون سالبًا"
    )
  })
  .refine(data => data.closingTime > data.openingTime, {
    path: ["closingTime"],
    message: "وقت النهاية يجب أن يكون بعد وقت البداية"
  });

const defaultValues: DeliveryScheduleFormValues = {
  day: "SUNDAY",
  openingTime: "00:00",
  closingTime: "02:00",
  map: { lat: 0, lng: 0 },
  requiredRadius: "0"
};

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

export default function DeliveryScheduleSection() {
  const { id } = useParams();
  const deliveryId = Number(id);
  const isValidDeliveryId = Number.isFinite(deliveryId) && deliveryId > 0;

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset
  } = useForm<DeliveryScheduleFormValues>({
    resolver: zodResolver(deliveryScheduleSchema),
    defaultValues
  });

  const onSubmit = async (values: DeliveryScheduleFormValues) => {
    if (!isValidDeliveryId) {
      toast.error("معرف مندوب التوصيل غير صحيح");
      return;
    }

    const payload: DeliverySchedulePayload = {
      openingTime: values.openingTime,
      closingTime: values.closingTime,
      day: values.day,
      deliveryId: Number(id),
      requiredLat: Number(values.map?.lat ?? 0),
      requiredLng: Number(values.map?.lng ?? 0),
      requiredRadius: Number(values.requiredRadius)
    };

    try {
      const response = await apiClient.post<{ message?: string }>(DELIVERY_SCHEDULE_URL, payload);
      toast.success(response.data?.message || "تم إنشاء موعد التوصيل بنجاح");
      reset(defaultValues);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" />
          إدارة مواعيد التوصيل
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label>اليوم</Label>
            <Controller
              control={control}
              name="day"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
                  {dayOptions.map(day => {
                    const isSelected = field.value === day.value;

                    return (
                      <button
                        key={day.value}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => field.onChange(day.value)}
                        className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-muted/30 text-foreground hover:bg-muted"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        <span>{day.label}</span>
                        {isSelected && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            <FieldError message={errors.day?.message} />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="openingTime">وقت البداية</Label>
              <Input id="openingTime" type="time" disabled={isSubmitting} {...register("openingTime")} />
              <FieldError message={errors.openingTime?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="closingTime">وقت النهاية</Label>
              <Input id="closingTime" type="time" disabled={isSubmitting} {...register("closingTime")} />
              <FieldError message={errors.closingTime?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredRadius">نطاق التواجد المطلوب</Label>
              <Input
                id="requiredRadius"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                disabled={isSubmitting}
                {...register("requiredRadius")}
              />
              <FieldError message={errors.requiredRadius?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              الموقع المطلوب
            </Label>
            <Controller
              control={control}
              name="map"
              render={({ field }) => (
                <MapPointerInput
                  value={field.value}
                  onChange={field.onChange}
                  defaultCenter={field.value || { lat: 24.7136, lng: 46.6753 }}
                  placeholder="ابحث عن الموقع"
                />
              )}
            />
            <FieldError message={errors.map?.message} />
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting || !isValidDeliveryId}>
              {isSubmitting ? "جاري الحفظ" : "حفظ الموعد"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
