"use client";

import { fetchHelper } from "@/api/fetch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Clock } from "lucide-react";

interface StorePrepTimeButtonProps {
  storeId: number;
  initialPrepTime?: number;
  initialDeliveryMin?: number;
  initialDeliveryMax?: number;
  initialMinOrderAmount?: number;
}

export function StorePrepTimeButton({
  storeId,
  initialPrepTime = 0,
  initialDeliveryMin = 0,
  initialDeliveryMax = 0,
  initialMinOrderAmount = 0
}: StorePrepTimeButtonProps) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [prepTime, setPrepTime] = useState<number>(initialPrepTime);
  const [deliveryMin, setDeliveryMin] = useState<number>(initialDeliveryMin);
  const [deliveryMax, setDeliveryMax] = useState<number>(initialDeliveryMax);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(initialMinOrderAmount);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch profile to determine if Admin
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchHelper({ endPoint: ["profile"] }),
    staleTime: 60_000,
    retry: false
  });

  const profile = profileQuery.data?.data?.user;
  const isAdmin = profile?.roleKey === "Admin" || profile?.Role?.key === "Admin";

  useEffect(() => {
    setPrepTime(initialPrepTime);
    setDeliveryMin(initialDeliveryMin);
    setDeliveryMax(initialDeliveryMax);
    setMinOrderAmount(initialMinOrderAmount);
  }, [initialPrepTime, initialDeliveryMin, initialDeliveryMax, initialMinOrderAmount]);

  const handleSave = async () => {
    if (isAdmin && deliveryMax < deliveryMin) {
      toast.error(t("error") || "Error", {
        description: t("maxDeliveryLessThanMin") || "Maximum delivery time cannot be less than minimum delivery time."
      });
      return;
    }

    setIsSaving(true);

    const body: Record<string, number> = {
      prepTimeMinutes: Number(prepTime),
      minOrderAmount: Number(minOrderAmount)
    };

    if (isAdmin) {
      body.deliveryTimeMinMinutes = Number(deliveryMin);
      body.deliveryTimeMaxMinutes = Number(deliveryMax);
    }

    const res = await fetchHelper({
      endPoint: ["stores", storeId],
      method: "PATCH",
      body
    });

    if (res.success) {
      toast.success(t("done") || "Done", {
        description: t("prepTimeUpdated") || "Prep & delivery times updated successfully."
      });
      setOpen(false);
      router.refresh();
    } else {
      toast.error(t("error") || "Error", {
        description: res?.result?.message ?? t("error")
      });
    }

    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5 bg-background border border-border">
          <Clock className="h-4 w-4" />
          <span>{t("setPrepTime") || "تعديل وقت التحضير والتوصيل"}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("setPrepTime") || "تعديل وقت التحضير والتوصيل"}</DialogTitle>
          <DialogDescription>
            {t("setPrepTimeDescription") || "قم بتعديل مدة تحضير الطلبات ونطاق وقت التوصيل للمتجر."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Prep Time & Min Order Amount fields - Visible for both Store and Admin */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prep-time-minutes">
                {t("prepTimeMinutes") || "مدة التحضير (بالدقائق)"}
              </Label>
              <Input
                id="prep-time-minutes"
                type="number"
                min={0}
                value={Number.isNaN(prepTime) ? "" : prepTime}
                onChange={e => setPrepTime(Math.max(0, Number(e.target.value)))}
                placeholder="15"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-order-amount">
                {t("minOrderAmount") || "أقل قيمة طلب"}
              </Label>
              <Input
                id="min-order-amount"
                type="number"
                min={0}
                value={Number.isNaN(minOrderAmount) ? "" : minOrderAmount}
                onChange={e => setMinOrderAmount(Math.max(0, Number(e.target.value)))}
                placeholder="0"
              />
            </div>
          </div>

          {/* Delivery Min and Max fields - Visible only for Admin */}
          {isAdmin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="delivery-min-minutes">
                    {t("deliveryTimeMinMinutes") || "الحد الأدنى لوقت التوصيل (بالدقائق)"}
                  </Label>
                  <Input
                    id="delivery-min-minutes"
                    type="number"
                    min={0}
                    value={Number.isNaN(deliveryMin) ? "" : deliveryMin}
                    onChange={e => setDeliveryMin(Math.max(0, Number(e.target.value)))}
                    placeholder="20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery-max-minutes">
                    {t("deliveryTimeMaxMinutes") || "الحد الأقصى لوقت التوصيل (بالدقائق)"}
                  </Label>
                  <Input
                    id="delivery-max-minutes"
                    type="number"
                    min={0}
                    value={Number.isNaN(deliveryMax) ? "" : deliveryMax}
                    onChange={e => setDeliveryMax(Math.max(0, Number(e.target.value)))}
                    placeholder="45"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("cancel") || "إلغاء"}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {t("save") || "حفظ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
