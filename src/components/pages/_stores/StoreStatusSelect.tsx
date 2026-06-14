import { fetchHelper } from "@/api/fetch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface StoreStatusSelectProps {
  storeId: number | string;
  initialStatus: string;
}

export function StoreStatusSelect({ storeId, initialStatus }: StoreStatusSelectProps) {
  const t = useTranslations();
  const router = useRouter();
  const [status, setStatus] = useState<string>(initialStatus || "OPEN");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setIsUpdating(true);
    try {
      const response = await fetchHelper({
        endPoint: ["stores", Number(storeId), "status"],
        method: "PATCH",
        body: { status: newStatus }
      });
      if (!response?.success) throw response;
      toast.success(t("Store status updated successfully"));
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || t("Failed to update status"));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Select disabled={isUpdating} value={status} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-full min-w-[120px]" id={`store-status-select-${storeId}`}>
        <SelectValue placeholder={t("Select status")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="OPEN">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
            <span className="text-green-600 font-medium">{t("Open")}</span>
          </span>
        </SelectItem>
        <SelectItem value="BUSY">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-400 flex-shrink-0" />
            <span className="text-orange-500 font-medium">{t("Busy")}</span>
          </span>
        </SelectItem>
        <SelectItem value="CLOSED">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
            <span className="text-red-500 font-medium">{t("Closed")}</span>
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
