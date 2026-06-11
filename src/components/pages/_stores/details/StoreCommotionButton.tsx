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
import { useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface StoreCommotionButtonProps {
  storeId: number;
  initialValue?: number;
}

export function StoreCommotionButton({ storeId, initialValue = 0 }: StoreCommotionButtonProps) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number>(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  const normalizedValue = useMemo(() => {
    if (Number.isNaN(Number(value))) return 0;
    return Math.max(0, Math.min(100, Number(value)));
  }, [value]);

  const handleSave = async () => {
    setIsSaving(true);

    const res = await fetchHelper({
      endPoint: ["stores", storeId, 'commission'],
      method: "PATCH",
      body: {
        commission: Number(normalizedValue)
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

        <div className="space-y-3 py-2">
          <Input
            type="number"
            min={0}
            max={100}
            value={Number.isNaN(Number(value)) ? "" : value}
            onChange={e => {
              const nextValue = Number(e.target.value);
              setValue(Number.isNaN(nextValue) ? 0 : nextValue);
            }}
            placeholder="0 - 100"
          />
          <p className="text-sm text-muted-foreground">
            {t("currentValue")}:{" "}
            <span className="font-medium text-foreground">{normalizedValue}%</span>
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
