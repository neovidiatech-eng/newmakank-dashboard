import { fetchHelper } from "@/api/fetch";
import { ExpandableButton } from "@/components/ui/ExpandableButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Eye, MousePointerClick } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { useState } from "react";

function getLocalizedBannerName(rowData: Record<string, unknown>) {
  const name = rowData.name;

  if (typeof name === "string") return name;

  if (name && typeof name === "object") {
    const localizedName = name as { ar?: string; en?: string };
    return localizedName.ar || localizedName.en || "—";
  }

  return "—";
}

function getBannerClicks(rowData: Record<string, unknown>) {
  const clicks =
    rowData.clicks ??
    rowData.clickCount ??
    rowData.clicksCount ??
    rowData.totalClicks ??
    0;

  return Number(clicks) || 0;
}

export default function BannerStatsAction({
  rowData
}: {
  rowData: Record<string, unknown>;
}) {
  const t = useTranslations();
  const bannerName = getLocalizedBannerName(rowData);
  const [clicks, setClicks] = useState(getBannerClicks(rowData));
  const [isLoading, setIsLoading] = useState(false);
  const bannerId = Number(rowData.id);

  const loadStats = async (open: boolean) => {
    if (!open || !bannerId) return;

    setIsLoading(true);
    const response = await fetchHelper({
      endPoint: ["banners", "bannerStatistics"],
      params: { id: bannerId },
      redirectOnUnauthorized: false
    });
    const stats = response?.data as Record<string, unknown> | null;
    const nextClicks = getBannerClicks({ ...rowData, ...(stats ?? {}) });
    setClicks(nextClicks);
    setIsLoading(false);
  };

  return (
    <Dialog onOpenChange={loadStats}>
      <DialogTrigger asChild>
        <ExpandableButton
          icon={<Eye className="h-4 w-4" />}
          variant="outline"
          className="bg-transparent text-sky-500 hover:text-white hover:bg-sky-500 border border-sky-500 transition-colors duration-200"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle>{t("Banner Statistics")}</DialogTitle>
          <DialogDescription>{t("Banner statistics preview description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 pt-2">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-950 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("Banner Name")}</p>
            <p className="mt-1 text-base font-semibold text-gray-900 dark:text-gray-100">
              {bannerName}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/40 p-4">
            <div>
              <p className="text-xs text-sky-700 dark:text-sky-300">{t("Clicks")}</p>
              <p className="mt-1 text-3xl font-bold text-sky-900 dark:text-sky-100">
                {isLoading ? t("Loading") : clicks.toLocaleString()}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-sky-500">
              <MousePointerClick className="h-6 w-6" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
