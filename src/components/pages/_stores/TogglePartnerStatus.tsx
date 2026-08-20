"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/axios";
import { queryClient } from "@/lib/queryClient";
import { toast } from "sonner";
import { Handshake, Loader2 } from "lucide-react";
import { useTranslations } from "@/lib/i18n";

interface TogglePartnerStatusProps {
  storeId: number | string;
  initialIsPartner: boolean;
}

export function TogglePartnerStatus({ storeId, initialIsPartner }: TogglePartnerStatusProps) {
  const t = useTranslations();
  const [isPartner, setIsPartner] = useState(initialIsPartner);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    try {
      await apiClient.patch(`/api/stores/${storeId}/partner`, {
        isPartner: checked
      });

      setIsPartner(checked);
      toast.success(
        checked
          ? t("Store marked as Partner Store") || "تم تعيين المطعم كمطعم شريك بنجاح"
          : t("Partner status removed") || "تم إلغاء صفة الشريك للمطعم"
      );

      queryClient.invalidateQueries({ queryKey: ["stores"] });
      queryClient.invalidateQueries({ queryKey: ["partner-settlements"] });
    } catch (error: any) {
      console.error("Failed to update partner status:", error);
      toast.error(error?.response?.data?.message || error?.message || "فشل تحديث حالة الشريك للمتجر");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isPartner}
        onCheckedChange={handleToggle}
        disabled={isLoading}
        aria-label="Toggle Partner Store"
      />

      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : isPartner ? (
        <Badge
          variant="outline"
          className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/60 font-semibold gap-1 px-2 py-0.5 rounded-full text-[11px]"
        >
          <Handshake className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          {t("Partner") || "شريك"}
        </Badge>
      ) : (
        <Badge
          variant="muted"
          className="text-muted-foreground text-[11px] font-normal"
        >
          {t("Non-Partner") || "عادي"}
        </Badge>
      )}
    </div>
  );
}
