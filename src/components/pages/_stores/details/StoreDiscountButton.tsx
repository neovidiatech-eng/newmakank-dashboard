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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SelectPaginated from "@/components/common/Inputs/select/SelectPaginatedInput";
import { useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Percent, Trash2, Loader2 } from "lucide-react";

type DiscountType = "PERCENTAGE" | "FIXED";

interface StoreDiscountButtonProps {
  storeId: number;
}

export function StoreDiscountButton({ storeId }: StoreDiscountButtonProps) {
  const t = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [discountType, setDiscountType] = useState<DiscountType>("PERCENTAGE");
  const [value, setValue] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isApplying, setIsApplying] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const numericValue = useMemo(() => {
    const val = Number(value);
    return isNaN(val) ? 0 : val;
  }, [value]);

  const handleApply = async () => {
    if (numericValue <= 0) {
      toast.error(t("pleaseEnterValidDiscountValue"));
      return;
    }

    if (discountType === "PERCENTAGE" && numericValue > 100) {
      toast.error(t("percentageDiscountCannotExceed100"));
      return;
    }

    setIsApplying(true);

    const res = await fetchHelper({
      endPoint: ["stores", storeId, "storeDiscount"],
      method: "PATCH",
      body: {
        discountType,
        value: numericValue,
        ...(categoryId ? { categoryId: Number(categoryId) } : {})
      }
    });

    if (res.success) {
      const appliedCount = res.data?.appliedCount ?? 0;
      const skippedCount = res.data?.skipped?.length ?? 0;

      const reportText = t("discountAppliedReport")
        .replace("{appliedCount}", String(appliedCount))
        .replace("{skippedCount}", String(skippedCount));

      toast.success(t("discountAppliedSuccessfully"), {
        description: reportText
      });
      setOpen(false);
      setValue("");
      setCategoryId("");
      router.refresh();
    } else {
      toast.error(t("error"), {
        description: res?.result?.message ?? t("error")
      });
    }

    setIsApplying(false);
  };

  const handleRemove = async () => {
    setIsRemoving(true);

    const res = await fetchHelper({
      endPoint: ["stores", storeId, "storeDiscountRemove"],
      method: "PATCH",
      body: categoryId ? { categoryId: Number(categoryId) } : undefined
    });

    if (res.success) {
      toast.success(t("discountRemovedSuccessfully"));
      setOpen(false);
      setValue("");
      setCategoryId("");
      router.refresh();
    } else {
      toast.error(t("error"), {
        description: res?.result?.message ?? t("error")
      });
    }

    setIsRemoving(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      // Start from a clean slate every time the dialog is opened, so a category picked
      // (and not submitted) in a previous visit can't silently carry over.
      setValue("");
      setCategoryId("");
      setDiscountType("PERCENTAGE");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Percent className="h-4 w-4" />
          {t("Store Discount")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("Store Discount")}</DialogTitle>
          <DialogDescription>
            {t("StoreDiscountDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <RadioGroup
            value={discountType}
            onValueChange={nextType => setDiscountType(nextType as DiscountType)}
            className="grid grid-cols-2 gap-3"
          >
            {(["PERCENTAGE", "FIXED"] as DiscountType[]).map(type => (
              <Label
                key={type}
                className="flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm font-medium hover:bg-muted/50"
              >
                <RadioGroupItem value={type} />
                {t(type)}
              </Label>
            ))}
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="store-discount-value">{t("Discount Value")}</Label>
            <Input
              id="store-discount-value"
              type="number"
              min={0}
              max={discountType === "PERCENTAGE" ? 100 : undefined}
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={discountType === "PERCENTAGE" ? "0 - 100" : "0"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-discount-category">{t("Discount Category")}</Label>
            <SelectPaginated
              name="store-discount-category"
              value={categoryId}
              onChange={v => setCategoryId((v as string) ?? "")}
              apiUrl={["storeCategories"]}
              searchFilters={[{ key: "storeId", value: storeId }]}
              placeholder={t("allCategoriesDiscount")}
            />
            <p className="text-xs text-muted-foreground">{t("discountCategoryHint")}</p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2">
          <Button
            variant="destructive"
            className="gap-2 sm:mr-auto"
            onClick={handleRemove}
            disabled={isRemoving || isApplying}
          >
            {isRemoving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {categoryId ? t("Remove Category Discount") : t("Remove Discount")}
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleApply} disabled={isApplying || isRemoving}>
              {isApplying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t("apply")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
