"use client";

import { fetchHelper } from "@/api/fetch";
import SelectPaginated from "@/components/common/Inputs/select/SelectPaginatedInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useLocale, useTranslations } from "@/lib/i18n";
import { Link, useSearchParams } from "@/lib/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Layers,
  Loader2,
  MapPinned,
  Megaphone,
  RotateCcw,
  Save,
  Search,
  Store as StoreIcon,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface ZonePrice {
  zoneId: number;
  name: { ar?: string; en?: string } | string;
  cityId?: number;
  price: number | null;
}

interface StoreZonePricesResponse {
  storeId: number;
  storeName?: { ar?: string; en?: string } | string;
  logo?: string | null;
  announcement?: string | null;
  zonePricingEnabled: boolean;
  zones: ZonePrice[];
}

export default function StorePricingAnnouncementsManager() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const initialStoreId = searchParams.get("storeId")
    ? Number(searchParams.get("storeId"))
    : null;

  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(initialStoreId);
  const [storeInfo, setStoreInfo] = useState<{
    name?: string;
    logo?: string | null;
  } | null>(null);

  // Zone Pricing State
  const [isTogglingZonePricing, setIsTogglingZonePricing] = useState(false);
  const [isSavingZonePrices, setIsSavingZonePrices] = useState(false);
  const [editedPrices, setEditedPrices] = useState<Record<number, string>>({});
  const [searchZoneQuery, setSearchZoneQuery] = useState("");
  const [uniformPriceInput, setUniformPriceInput] = useState("");
  const [quickSelectedZoneId, setQuickSelectedZoneId] = useState<string>("");
  const [quickZonePrice, setQuickZonePrice] = useState("");
  const [deletingZoneId, setDeletingZoneId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Store Announcement State
  const [announcementText, setAnnouncementText] = useState("");
  const [savedAnnouncement, setSavedAnnouncement] = useState("");
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);
  const [isClearingAnnouncement, setIsClearingAnnouncement] = useState(false);
  const [clearAnnouncementDialogOpen, setClearAnnouncementDialogOpen] = useState(false);

  // Fetch Zone Pricing & Store Details
  const {
    data: response,
    refetch,
    isLoading: isLoadingData,
  } = useApiQuery({
    queryKey: ["store-zone-prices-manager", selectedStoreId],
    endPoint: ["stores", selectedStoreId ?? 0, "storeZonePrices"],
    staleTime: 0,
    enabled: !!selectedStoreId,
  });

  const zonePricingData = (response?.data as StoreZonePricesResponse) || undefined;
  const isZonePricingEnabled = zonePricingData?.zonePricingEnabled ?? false;
  const rawZones = zonePricingData?.zones ?? [];

  // Update local states whenever store data is fetched
  useEffect(() => {
    if (!zonePricingData) return;

    // Prices mapping
    const pricesMap: Record<number, string> = {};
    zonePricingData.zones.forEach((zone) => {
      if (zone.price !== null && zone.price !== undefined) {
        pricesMap[zone.zoneId] = String(zone.price);
      }
    });
    setEditedPrices(pricesMap);

    // Announcement
    const currentAnnouncement = zonePricingData.announcement ?? "";
    setAnnouncementText(currentAnnouncement);
    setSavedAnnouncement(currentAnnouncement);

    // Store details
    let resolvedName = "";
    if (typeof zonePricingData.storeName === "string") {
      resolvedName = zonePricingData.storeName;
    } else if (zonePricingData.storeName && typeof zonePricingData.storeName === "object") {
      resolvedName =
        (zonePricingData.storeName as any)[locale] ||
        (zonePricingData.storeName as any).ar ||
        (zonePricingData.storeName as any).en ||
        "";
    }

    setStoreInfo({
      name: resolvedName,
      logo: zonePricingData.logo ?? null,
    });
  }, [zonePricingData, locale]);

  // Format localized zone name helper
  const getZoneDisplayName = (zone: ZonePrice) => {
    if (!zone?.name) return `Zone ${zone.zoneId}`;
    if (typeof zone.name === "string") return zone.name;
    return (zone.name as any)[locale] || (zone.name as any).ar || (zone.name as any).en || `Zone ${zone.zoneId}`;
  };

  // Toggle Store Zone Pricing
  const handleToggleZonePricing = async () => {
    if (!selectedStoreId) return;

    setIsTogglingZonePricing(true);
    const newStatus = !isZonePricingEnabled;

    const res = await fetchHelper({
      endPoint: ["stores", selectedStoreId, "storeZonePricingToggle"],
      method: "PATCH",
      body: { enabled: newStatus },
    });

    if (res?.success) {
      toast.success(newStatus ? t("zonePricingEnabled") : t("zonePricingDisabled"));
      refetch();
    } else {
      toast.error(res?.result?.message ?? res?.message ?? t("error"));
    }
    setIsTogglingZonePricing(false);
  };

  // Save Zone Prices
  const handleSaveZonePrices = async () => {
    if (!selectedStoreId) return;

    const zonePrices = Object.entries(editedPrices)
      .filter(([, val]) => val !== "" && !isNaN(Number(val)))
      .map(([zoneId, price]) => ({
        zoneId: Number(zoneId),
        price: Number(price),
      }));

    if (zonePrices.length === 0) {
      toast.error(t("noZonePricesToSave"));
      return;
    }

    setIsSavingZonePrices(true);
    const res = await fetchHelper({
      endPoint: ["stores", selectedStoreId, "storeZonePrices"],
      method: "PATCH",
      body: { zonePrices },
    });

    if (res?.success) {
      toast.success(t("zonePricesSaved"));
      refetch();
    } else {
      toast.error(res?.result?.message ?? res?.message ?? t("error"));
    }
    setIsSavingZonePrices(false);
  };

  // Delete individual zone price override
  const handleDeleteZonePrice = async (zoneId: number) => {
    if (!selectedStoreId) return;

    const res = await fetchHelper({
      endPoint: ["stores", selectedStoreId, "storeZonePrices", zoneId],
      method: "DELETE",
    });

    if (res?.success) {
      toast.success(t("zonePriceDeleted"));
      setEditedPrices((prev) => {
        const updated = { ...prev };
        delete updated[zoneId];
        return updated;
      });
      setDeleteDialogOpen(false);
      setDeletingZoneId(null);
      refetch();
    } else {
      toast.error(res?.result?.message ?? res?.message ?? t("error"));
    }
  };

  // Apply Uniform Bulk Price
  const handleApplyUniformPrice = () => {
    const parsedPrice = parseFloat(uniformPriceInput);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error(t("Enter price"));
      return;
    }

    const updated: Record<number, string> = { ...editedPrices };
    rawZones.forEach((z) => {
      updated[z.zoneId] = String(parsedPrice);
    });

    setEditedPrices(updated);
    toast.success(t("bulkAppliedMessage"));
  };

  // Quick Add / Update single zone price from dropdown
  const handleQuickSetZonePrice = () => {
    if (!quickSelectedZoneId) {
      toast.error(t("Select a Zone") || "اختر منطقة");
      return;
    }
    const parsedPrice = parseFloat(quickZonePrice);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error(t("Enter price"));
      return;
    }

    const zoneId = Number(quickSelectedZoneId);
    setEditedPrices((prev) => ({
      ...prev,
      [zoneId]: String(parsedPrice),
    }));

    toast.success(t("zonePricesSaved") || "تم تعيين سعر المنطقة بالجدول");
    setQuickSelectedZoneId("");
    setQuickZonePrice("");
  };

  // Save Announcement
  const handleSaveAnnouncement = async () => {
    if (!selectedStoreId) return;

    const trimmed = announcementText.trim();
    setIsSavingAnnouncement(true);

    const res = await fetchHelper({
      endPoint: ["stores", selectedStoreId],
      method: "PATCH",
      body: { announcement: trimmed || null },
    });

    if (res?.success) {
      setSavedAnnouncement(trimmed);
      toast.success(t("announcementSaved"));
      refetch();
    } else {
      toast.error(res?.result?.message ?? res?.message ?? t("error"));
    }
    setIsSavingAnnouncement(false);
  };

  // Clear Announcement
  const handleClearAnnouncement = async () => {
    if (!selectedStoreId) return;

    setIsClearingAnnouncement(true);
    const res = await fetchHelper({
      endPoint: ["stores", selectedStoreId],
      method: "PATCH",
      body: { announcement: null },
    });

    if (res?.success) {
      setAnnouncementText("");
      setSavedAnnouncement("");
      toast.success(t("announcementCleared"));
      setClearAnnouncementDialogOpen(false);
      refetch();
    } else {
      toast.error(res?.result?.message ?? res?.message ?? t("error"));
    }
    setIsClearingAnnouncement(false);
  };

  // Filtered zones list for search inside table
  const filteredZones = useMemo(() => {
    if (!searchZoneQuery.trim()) return rawZones;
    const q = searchZoneQuery.toLowerCase().trim();
    return rawZones.filter((zone) => {
      const name = getZoneDisplayName(zone).toLowerCase();
      return name.includes(q) || String(zone.zoneId).includes(q);
    });
  }, [rawZones, searchZoneQuery, locale]);

  // Statistics counters
  const customPricedCount = useMemo(() => {
    return Object.values(editedPrices).filter((v) => v !== "" && !isNaN(Number(v))).length;
  }, [editedPrices]);

  const defaultPricedCount = Math.max(0, rawZones.length - customPricedCount);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Description */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <MapPinned className="h-6 w-6" />
            </span>
            {t("storePricingAndAnnouncements")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("storePricingAndAnnouncementsDesc")}
          </p>
        </div>
      </div>

      {/* Step 1: Store Selection Card */}
      <Card className="border-primary/20 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <StoreIcon className="h-4 w-4 text-primary" />
            {t("selectStoreToManage")}
          </CardTitle>
          <CardDescription>
            {t("selectStorePrompt")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 items-center">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">
                {t("Stores")}
              </Label>
              <SelectPaginated
                name="storeId"
                apiUrl={["stores"]}
                idKey="id"
                labelKey="name"
                value={selectedStoreId ? String(selectedStoreId) : ""}
                onChange={(val) => {
                  const id = val ? Number(val) : null;
                  setSelectedStoreId(id);
                  setUniformPriceInput("");
                  setQuickSelectedZoneId("");
                  setQuickZonePrice("");
                  setSearchZoneQuery("");
                }}
                placeholder={t("selectStorePrompt")}
              />
            </div>

            {selectedStoreId && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border">
                <div className="flex items-center gap-3">
                  {storeInfo?.logo ? (
                    <img
                      src={storeInfo.logo}
                      alt={storeInfo.name || "Store"}
                      className="h-12 w-12 rounded-lg object-cover border bg-background"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      <StoreIcon className="h-6 w-6" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-sm">
                      {storeInfo?.name || `Store #${selectedStoreId}`}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={isZonePricingEnabled ? "default" : "outline"} className="text-xs">
                        {isZonePricingEnabled ? t("zonePricingEnabled") : t("zonePricingDisabled")}
                      </Badge>
                      {savedAnnouncement && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Megaphone className="h-3 w-3" />
                          {t("Active") || "تنبيه نشط"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Link href={`/stores/${selectedStoreId}`} target="_blank">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t("storeDetailsLink")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!selectedStoreId ? (
        /* Empty State Prompt */
        <Card className="border-dashed py-12 text-center">
          <CardContent className="space-y-3">
            <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-2">
              <StoreIcon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium">{t("noStoreSelected")}</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {t("selectStorePrompt")}
            </p>
          </CardContent>
        </Card>
      ) : isLoadingData ? (
        /* Loading Skeleton */
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        /* Main Store Controls Grid */
        <div className="space-y-6">
          {/* Announcement Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-amber-500" />
                  {t("storeAnnouncementTitle")}
                </CardTitle>
                {savedAnnouncement ? (
                  <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-white text-xs">
                    {t("Active") || "نشط حالياً"}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    {t("None") || "لا يوجد تنبيه"}
                  </Badge>
                )}
              </div>
              <CardDescription>
                {t("storeAnnouncementDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder={t("announcementPlaceholder")}
                className="resize-y"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-xs text-muted-foreground">
                  {announcementText.length} {t("characters") || "حرف"}
                </span>

                <div className="flex items-center gap-2">
                  {savedAnnouncement && (
                    <Dialog
                      open={clearAnnouncementDialogOpen}
                      onOpenChange={setClearAnnouncementDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive gap-1.5"
                          disabled={isClearingAnnouncement}
                        >
                          <Trash2 className="h-4 w-4" />
                          {t("clearAnnouncement")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{t("clearAnnouncement")}</DialogTitle>
                          <DialogDescription>
                            {t("clearAnnouncementConfirm")}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setClearAnnouncementDialogOpen(false)}
                          >
                            {t("Cancel")}
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleClearAnnouncement}
                            disabled={isClearingAnnouncement}
                          >
                            {isClearingAnnouncement ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                            ) : null}
                            {t("Delete")}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}

                  <Button
                    size="sm"
                    onClick={handleSaveAnnouncement}
                    disabled={isSavingAnnouncement || announcementText === savedAnnouncement}
                    className="gap-1.5"
                  >
                    {isSavingAnnouncement ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {t("saveAnnouncement")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zone Pricing Configuration Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <MapPinned className="h-4 w-4 text-primary" />
                    {t("Zone Pricing")}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {t("zonePricingDescription")}
                  </CardDescription>
                </div>

                {/* Status Toggle Switch */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/60 border">
                  <Switch
                    checked={isZonePricingEnabled}
                    onCheckedChange={handleToggleZonePricing}
                    disabled={isTogglingZonePricing}
                    id="zone-pricing-toggle"
                  />
                  <Label
                    htmlFor="zone-pricing-toggle"
                    className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                  >
                    {isTogglingZonePricing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {isZonePricingEnabled ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {t("zonePricingEnabled")}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {t("zonePricingDisabled")}
                      </span>
                    )}
                  </Label>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {!isZonePricingEnabled ? (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">{t("zonePricingDisabled")}</p>
                    <p className="text-muted-foreground dark:text-amber-300/80">
                      {t("zonePricingDisabledMessage")}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Summary Stats Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-muted/40 border text-center">
                      <span className="text-xs text-muted-foreground block">{t("allZonesCount")}</span>
                      <span className="text-lg font-bold">{rawZones.length}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <span className="text-xs text-emerald-700 dark:text-emerald-300 block">
                        {t("customPricedCount")}
                      </span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {customPricedCount}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                      <span className="text-xs text-blue-700 dark:text-blue-300 block">
                        {t("defaultPricedCount")}
                      </span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {defaultPricedCount}
                      </span>
                    </div>
                  </div>

                  {/* Option 1: Uniform Bulk Pricing Bar */}
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-semibold">{t("bulkPricingTitle")}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("bulkPricingDesc")}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative w-full max-w-[200px]">
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder={t("uniformPrice")}
                          value={uniformPriceInput}
                          onChange={(e) => setUniformPriceInput(e.target.value)}
                          className="text-center font-medium pr-10"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-muted-foreground pointer-events-none">
                          {t("EGP") || "ج.م"}
                        </span>
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleApplyUniformPrice}
                        disabled={!uniformPriceInput}
                        className="gap-1.5"
                      >
                        <Layers className="h-4 w-4" />
                        {t("applyToAllZones")}
                      </Button>
                    </div>
                  </div>

                  {/* Option 2: Quick Zone Picker Dropdown */}
                  <div className="p-4 rounded-xl bg-muted/40 border space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPinned className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-semibold">{t("quickZoneSelect")}</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      <div className="sm:col-span-1">
                        <Label className="text-xs text-muted-foreground mb-1 block">
                          {t("Zone") || "المنطقة"}
                        </Label>
                        <select
                          className="flex h-9 w-full rounded-xl border border-input/70 bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                          value={quickSelectedZoneId}
                          onChange={(e) => setQuickSelectedZoneId(e.target.value)}
                        >
                          <option value="">{t("Select a Zone") || "-- اختر منطقة --"}</option>
                          {rawZones.map((z) => (
                            <option key={z.zoneId} value={z.zoneId}>
                              {getZoneDisplayName(z)} ({editedPrices[z.zoneId] ? `${editedPrices[z.zoneId]} ج.م` : t("App Default")})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-1">
                        <Label className="text-xs text-muted-foreground mb-1 block">
                          {t("Custom Price") || "السعر المخصص"}
                        </Label>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            step="0.5"
                            placeholder={t("Enter price")}
                            value={quickZonePrice}
                            onChange={(e) => setQuickZonePrice(e.target.value)}
                            className="pr-10"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-muted-foreground pointer-events-none">
                            {t("EGP") || "ج.م"}
                          </span>
                        </div>
                      </div>

                      <div className="sm:col-span-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleQuickSetZonePrice}
                          disabled={!quickSelectedZoneId || !quickZonePrice}
                          className="w-full h-9"
                        >
                          {t("Apply") || "تحديد السعر"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Zones Table with Filter */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="relative w-full sm:max-w-xs">
                        <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder={t("searchZones")}
                          value={searchZoneQuery}
                          onChange={(e) => setSearchZoneQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>

                      <Button
                        onClick={handleSaveZonePrices}
                        disabled={isSavingZonePrices}
                        className="gap-2"
                      >
                        {isSavingZonePrices ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {t("Save Prices")}
                      </Button>
                    </div>

                    <div className="rounded-xl border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead>{t("Zone")}</TableHead>
                            <TableHead className="text-center w-[200px]">
                              {t("Custom Price")}
                            </TableHead>
                            <TableHead className="text-center w-[130px]">
                              {t("Status")}
                            </TableHead>
                            <TableHead className="text-center w-[80px]">
                              {t("Actions")}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredZones.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                {t("No data found") || "لا توجد مناطق مطابقة للبحث"}
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredZones.map((zone) => {
                              const zoneName = getZoneDisplayName(zone);
                              const hasPrice =
                                editedPrices[zone.zoneId] !== undefined &&
                                editedPrices[zone.zoneId] !== "" &&
                                !isNaN(Number(editedPrices[zone.zoneId]));

                              return (
                                <TableRow key={zone.zoneId}>
                                  <TableCell>
                                    <div className="font-medium text-sm">{zoneName}</div>
                                    <span className="text-xs text-muted-foreground">ID: #{zone.zoneId}</span>
                                  </TableCell>

                                  <TableCell className="text-center">
                                    <div className="relative w-full max-w-[150px] mx-auto">
                                      <Input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        placeholder={t("Enter price")}
                                        value={editedPrices[zone.zoneId] ?? ""}
                                        onChange={(e) =>
                                          setEditedPrices((prev) => ({
                                            ...prev,
                                            [zone.zoneId]: e.target.value,
                                          }))
                                        }
                                        className="text-center pr-8"
                                      />
                                      <span className="absolute right-2.5 top-2.5 text-xs text-muted-foreground pointer-events-none">
                                        {t("EGP") || "ج.م"}
                                      </span>
                                    </div>
                                  </TableCell>

                                  <TableCell className="text-center">
                                    {hasPrice ? (
                                      <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                        {t("Custom")}
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-muted-foreground">
                                        {t("App Default")}
                                      </Badge>
                                    )}
                                  </TableCell>

                                  <TableCell className="text-center">
                                    {hasPrice && (
                                      <Dialog
                                        open={deleteDialogOpen && deletingZoneId === zone.zoneId}
                                        onOpenChange={(open) => {
                                          setDeleteDialogOpen(open);
                                          if (!open) setDeletingZoneId(null);
                                        }}
                                      >
                                        <DialogTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive h-8 w-8"
                                            onClick={() => setDeletingZoneId(zone.zoneId)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-sm">
                                          <DialogHeader>
                                            <DialogTitle>{t("Delete Zone Price")}</DialogTitle>
                                            <DialogDescription>
                                              {t("deleteZonePriceConfirm")}
                                            </DialogDescription>
                                          </DialogHeader>
                                          <DialogFooter className="gap-2">
                                            <Button
                                              variant="outline"
                                              onClick={() => setDeleteDialogOpen(false)}
                                            >
                                              {t("Cancel")}
                                            </Button>
                                            <Button
                                              variant="destructive"
                                              onClick={() => handleDeleteZonePrice(zone.zoneId)}
                                            >
                                              {t("Delete")}
                                            </Button>
                                          </DialogFooter>
                                        </DialogContent>
                                      </Dialog>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Bottom Save Bar */}
                    <div className="flex justify-end pt-3">
                      <Button
                        onClick={handleSaveZonePrices}
                        disabled={isSavingZonePrices}
                        size="lg"
                        className="gap-2 px-6"
                      >
                        {isSavingZonePrices ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {t("Save Prices")}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
