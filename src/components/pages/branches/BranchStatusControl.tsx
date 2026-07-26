"use client";

import { useState } from "react";
import { fetchHelper } from "@/api/fetch";
import { useTranslations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import StatusOverrideModal from "@/components/common/dialog/StatusOverrideModal";

type BranchStatusControlProps = {
  branchId: number;
  initialStatus?: string; // NORMAL, OPEN, CLOSED, BUSY
};

export default function BranchStatusControl({ branchId, initialStatus = "NORMAL" }: BranchStatusControlProps) {
  const t = useTranslations();
  const [status, setStatus] = useState<string>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const performStatusChange = async (extraData?: { statusReason?: string; busyMinutes?: number }) => {
    setLoading(true);
    try {
      const response = await fetchHelper({
        endPoint: ["branches", branchId, "status"],
        method: "PATCH",
        body: {
          status,
          ...extraData
        }
      });
      if (response?.success) {
        toast.success(t("Status updated successfully"));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (status === "BUSY" || status === "CLOSED") {
      setIsModalOpen(true);
      return;
    }

    await performStatusChange();
  };

  const handleModalConfirm = async (modalData: { statusReason?: string; busyMinutes?: number }) => {
    await performStatusChange(modalData);
  };

  return (
    <>
      <Card className="mt-6 border-orange-200 shadow-sm">
        <CardHeader className="bg-orange-50/50 pb-4 dark:bg-orange-950/20">
          <CardTitle className="text-lg text-orange-800 dark:text-orange-400">
            {t("Manual Status Control")}
          </CardTitle>
          <CardDescription className="text-orange-700/80 dark:text-orange-300/80">
            {t("manualStatusOverrideWarning")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">{t("Status")}</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder={t("Select status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NORMAL">{t("NORMAL (Follow Schedule)")}</SelectItem>
                <SelectItem value="OPEN">{t("OPEN (Forced)")}</SelectItem>
                <SelectItem value="CLOSED">{t("CLOSED (Forced)")}</SelectItem>
                <SelectItem value="BUSY">{t("BUSY (Forced)")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto min-w-[120px]">
            {loading ? t("Saving...") : t("Save")}
          </Button>
        </CardContent>
      </Card>

      <StatusOverrideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
        status={status}
      />
    </>
  );
}
