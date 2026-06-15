import { fetchHelper } from "@/api/fetch";
import { revalidatePathAction } from "@/api/global/revalidatePath";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useTranslations } from "@/lib/i18n";
import { usePathname, useRouter } from "@/lib/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OrderDelaySelect({
  orderId,
  compact = false
}: {
  orderId: number;
  compact?: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState<string>("");

  const handleActionChange = (actionValue: string) => {
    setValue(actionValue);
    startTransition(async () => {
      try {
        let response;
        if (actionValue === "late") {
          response = await fetchHelper({
            endPoint: ["orders", orderId, "unassign"],
            method: "PATCH"
          });
          if (!response?.success) throw response;
          toast.success(response?.message || t("Order marked as late"));
        } else if (actionValue === "fox") {
          response = await fetchHelper({
            endPoint: ["orders", orderId, "fox"],
            method: "PATCH"
          });
          if (!response?.success) throw response;
          toast.success(response?.message || t("Order disconnected (Fox)"));
        }
        await revalidatePathAction(pathname);
        router.refresh();
      } catch (error: any) {
        toast.error(error?.result?.message || error?.message || t("Failed to execute action"));
      } finally {
        setValue("");
      }
    });
  };

  return (
    <div className={cn("space-y-2", compact && "space-y-1")}>
      <Select value={value} onValueChange={handleActionChange} disabled={isPending}>
        <SelectTrigger className={cn("min-w-[180px]", compact && "h-8 min-w-[150px]")}>
          <SelectValue placeholder={t("Delay Action")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t("Delay Status")}</SelectLabel>
            <SelectItem value="late">
              {t("Late")}
            </SelectItem>
            <SelectItem value="fox">
              {t("Fox")}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
