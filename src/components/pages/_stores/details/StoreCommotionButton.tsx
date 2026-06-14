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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";

type CommissionType = "PERCENTAGE" | "FIXED";

interface StoreCommotionButtonProps {
  storeId: number;
  initialValue?: number;
  initialType?: CommissionType;
}

export function StoreCommotionButton({
  storeId,
  initialValue = 0,
  initialType = "PERCENTAGE"
}: StoreCommotionButtonProps) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number>(initialValue);
  const [commissionType, setCommissionType] = useState<CommissionType>(initialType);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setValue(initialValue);
    setCommissionType(initialType);
  }, [initialValue, initialType]);

  const normalizedValue = useMemo(() => {
    if (Number.isNaN(Number(value))) return 0;
    const positiveValue = Math.max(0, Number(value));
    return commissionType === "PERCENTAGE" ? Math.min(100, positiveValue) : positiveValue;
  }, [commissionType, value]);

  const handleSave = async () => {
    setIsSaving(true);

    const res = await fetchHelper({
      endPoint: ["stores", storeId, 'commission'],
      method: "PATCH",
      body: {
        commission: Number(normalizedValue),
        commissionType
      }
    });

    if (res.success) {
      toast.success(t("done"), {
        description: t("commotionUpdated")
      });
      setOpen(false);
      router.refresh();
    } else {
      toast.error(t("error"), {
        description: res?.result?.message ?? t("error")
      });
    }

    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">{t("setCommotion")}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("setCommotion")}</DialogTitle>
          <DialogDescription>{t("setCommotionDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <RadioGroup
            value={commissionType}
            onValueChange={nextType => setCommissionType(nextType as CommissionType)}
            className="grid grid-cols-2 gap-3"
          >
            {(["PERCENTAGE", "FIXED"] as CommissionType[]).map(type => (
              <Label
                key={type}
                className="flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm font-medium"
              >
                <RadioGroupItem value={type} />
                {t(type)}
              </Label>
            ))}
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="store-commission-value">{t("Store Commission")}</Label>
            <Input
              id="store-commission-value"
              type="number"
              min={0}
              max={commissionType === "PERCENTAGE" ? 100 : undefined}
              value={Number.isNaN(Number(value)) ? "" : value}
              onChange={e => {
                const nextValue = Number(e.target.value);
                setValue(Number.isNaN(nextValue) ? 0 : nextValue);
              }}
              placeholder={commissionType === "PERCENTAGE" ? "0 - 100" : "0"}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {t("currentValue")}:{" "}
            <span className="font-medium text-foreground">
              {commissionType === "PERCENTAGE" ? `${normalizedValue}%` : normalizedValue}
            </span>
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
