import { fetchHelper } from "@/api/fetch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Link } from "@/lib/navigation";
import { Bell, Gift, Pencil, Plus, Power, Trash2, Megaphone } from "lucide-react";
import { useLocale, useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CampaignApiType = "NOTIFICATION" | "OFFER";
type CampaignStatus = "active" | "scheduled" | "expired" | "inactive";

type LocalizedText = string | { ar?: string; en?: string } | null | undefined;

type CampaignItem = {
  id: number;
  type?: CampaignApiType;
  title?: LocalizedText;
  name?: LocalizedText;
  description?: LocalizedText;
  body?: LocalizedText;
  featureText?: LocalizedText;
  valueText?: LocalizedText;
  targetType?: string;
  storeId?: number | null;
  serviceId?: number | null;
  startAt?: string | null;
  endAt?: string | null;
  displayIntervalHours?: number | null;
  manualStatus?: "ACTIVE" | "INACTIVE";
  sentAt?: string | null;
  Store?: { id?: number; name?: LocalizedText } | null;
  Service?: { id?: number; name?: LocalizedText } | null;
};

const statusVariant: Record<CampaignStatus, "success" | "warning" | "muted" | "destructive"> = {
  active: "success",
  scheduled: "warning",
  expired: "muted",
  inactive: "destructive"
};

function getLocalizedText(value: LocalizedText, locale: string) {
  if (!value) return "—";
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed[locale as "ar" | "en"] || parsed.ar || parsed.en || value;
      }
    } catch (e) {
      // not json
    }
    return value;
  }
  return value[locale as "ar" | "en"] || value.ar || value.en || "—";
}

function getCampaignStatus(campaign: CampaignItem): CampaignStatus {
  if (campaign.manualStatus === "INACTIVE") return "inactive";

  const now = Date.now();
  const start = campaign.startAt ? new Date(campaign.startAt).getTime() : null;
  const end = campaign.endAt ? new Date(campaign.endAt).getTime() : null;

  if (start && start > now) return "scheduled";
  if (end && end < now) return "expired";
  return "active";
}

function getTargetLabel(campaign: CampaignItem, t: ReturnType<typeof useTranslations>, locale: string) {
  if (campaign.targetType === "STORE") return getLocalizedText(campaign.Store?.name, locale);
  if (campaign.targetType === "SERVICE") return getLocalizedText(campaign.Service?.name, locale);
  if (campaign.targetType === "SELECTED_USERS") return t("selectedCustomers");
  if (campaign.targetType === "CUSTOMER") return t("customers");
  return t("allCustomers");
}

function getScheduleLabel(campaign: CampaignItem, t: ReturnType<typeof useTranslations>) {
  const interval = campaign.displayIntervalHours;
  const intervalLabel = interval === 0 ? t("showEveryFetch") : `${interval ?? 24} ${t("hours")}`;
  const start = campaign.startAt ? new Date(campaign.startAt).toLocaleString() : t("notSpecified");
  const end = campaign.endAt ? new Date(campaign.endAt).toLocaleString() : t("notSpecified");

  return `${intervalLabel} · ${start} → ${end}`;
}

export default function CampaignsListClient({
  offersData,
  offersTotal,
  notificationsData,
  notificationsTotal
}: {
  offersData: CampaignItem[];
  offersTotal: number;
  notificationsData: any[];
  notificationsTotal: number;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const handleDelete = async (id: number, isOffer: boolean) => {
    const response = await fetchHelper({
      endPoint: isOffer ? ["campaigns", id] : ["adminNotifications", id],
      method: "DELETE",
      redirectOnUnauthorized: false
    });

    if (response?.success) {
      toast.success(t("Deleted"));
      router.refresh();
    } else {
      toast.error(response?.message || t("Something went wrong"));
    }
  };

  const handleToggleStatus = async (campaign: CampaignItem) => {
    const nextStatus = campaign.manualStatus === "INACTIVE" ? "ACTIVE" : "INACTIVE";
    const response = await fetchHelper({
      endPoint: ["campaigns", campaign.id, "campaignStatus"],
      method: "PATCH",
      body: { manualStatus: nextStatus },
      redirectOnUnauthorized: false
    });

    if (response?.success) {
      toast.success(t("Success"));
      router.refresh();
    } else {
      toast.error(response?.message || t("Failed to change status"));
    }
  };

  return (
    <Card className="overflow-hidden border-gray-200/80 bg-white dark:border-gray-800 dark:bg-slate-950">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{t("campaignsCenter")}</CardTitle>
            <CardDescription className="mt-2">{t("campaignsCenterDescription")}</CardDescription>
          </div>
          <Button asChild>
            <Link href="/campaigns/create">
              <Plus className="h-4 w-4" />
              {t("Create New")}
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="offers" className="w-full" dir={locale === "ar" ? "rtl" : "ltr"}>
          <div className="border-b px-6 pt-2">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="offers" className="gap-2">
                <Gift className="h-4 w-4" />
                {t("campaignTypeValue.offer")}
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{offersTotal}</Badge>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Megaphone className="h-4 w-4" />
                {t("campaignTypeValue.notification")}
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{notificationsTotal}</Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="offers" className="m-0 border-none outline-none">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead className="text-center">{t("campaignName")}</TableHead>
                  <TableHead className="text-center">{t("targeting")}</TableHead>
                  <TableHead className="text-center">{t("campaignIncentive")}</TableHead>
                  <TableHead className="text-center">{t("appearanceSchedule")}</TableHead>
                  <TableHead className="text-center">{t("sentAt")}</TableHead>
                  <TableHead className="text-center">{t("status")}</TableHead>
                                    <TableHead className="text-center">{t("Actions")}</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {offersData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      {t("No Data")}
                    </TableCell>
                  </TableRow>
                ) : offersData.map(campaign => {
                  const status = getCampaignStatus(campaign);

                  return (
                    <TableRow key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/50">
                      <TableCell className="text-center font-semibold">
                        {getLocalizedText(campaign.title || campaign.name, locale)}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {getTargetLabel(campaign, t, locale)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getLocalizedText(campaign.valueText || campaign.featureText, locale)}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {getScheduleLabel(campaign, t)}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {campaign.sentAt ? new Date(campaign.sentAt).toLocaleString() : "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={statusVariant[status]}>
                          {t(`campaignStatus.${status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-wrap justify-center gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/campaigns/create?mode=edit&id=${campaign.id}`}>
                              <Pencil className="h-4 w-4" />
                              {t("Edit")}
                            </Link>
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => handleToggleStatus(campaign)}>
                            <Power className="h-4 w-4" />
                            {campaign.manualStatus === "INACTIVE" ? t("Activate") : t("Deactivate")}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            onClick={() => handleDelete(campaign.id, true)}
                          >
                            <Trash2 className="h-4 w-4" />
                            {t("Delete")}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="notifications" className="m-0 border-none outline-none">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead className="text-center">{t("Title")}</TableHead>
                  <TableHead className="text-center">{t("Body")}</TableHead>
                  <TableHead className="text-center">{t("targeting")}</TableHead>
                  <TableHead className="text-center">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notificationsData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                      {t("No Data")}
                    </TableCell>
                  </TableRow>
                ) : notificationsData.map(notification => (
                  <TableRow key={notification.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/50">
                    <TableCell className="text-center font-semibold">
                      {getLocalizedText(notification.title, locale)}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground max-w-xs truncate" title={getLocalizedText(notification.body, locale)}>
                      {getLocalizedText(notification.body, locale)}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {notification.targetType === "SELECTED_USERS" ? t("selectedCustomers") :
                       notification.targetType === "ALL" ? t("allCustomers") :
                       t("customers")}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-wrap justify-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          onClick={() => handleDelete(notification.id, false)}
                        >
                          <Trash2 className="h-4 w-4" />
                          {t("Delete")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
