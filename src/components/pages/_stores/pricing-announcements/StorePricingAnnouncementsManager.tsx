"use client";

import { fetchHelper } from "@/api/fetch";
import { getEnv } from "@/lib/env";
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
  Gift,
  Globe,
  Layers,
  Loader2,
  MapPinned,
  Megaphone,
  RotateCcw,
  Save,
  Search,
  Store as StoreIcon,
  Tag,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import DeliveryPromotionsTab from "./DeliveryPromotionsTab";

interface ZonePrice {
  zoneId: number;
  name: { ar?: string; en?: string } | string;
  cityId?: number;
  price: number | null;
  priceAfterDiscount?: number | null;
}

interface StoreZonePricesResponse {
  storeId: number | string;
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

  // Scope: 'all' = All Stores (Global default), 'store' = Specific Store customization
  const [pricingScope, setPricingScope] = useState<"all" | "store">(
    initialStoreId ? "store" : "all"
  );
  const [selectedSpecificStoreId, setSelectedSpecificStoreId] = useState<number | null>(
    initialStoreId
  );

  const selectedStoreId: string | number | null =
    pricingScope === "all" ? "all" : selectedSpecificStoreId;

  const imgUrl = getEnv("VITE_API_IMG_URL");
  const getLogoUrl = (logo?: string | null) => {
    if (!logo || logo === "null" || logo === "undefined") return null;
    if (logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("data:")) {
      return logo;
    }
    return imgUrl ? `${imgUrl}${logo}` : logo;
  };

  const [storeInfo, setStoreInfo] = useState<{
    name?: string;
    logo?: string | null;
  } | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [activeTab, setActiveTab] = useState<"zone-pricing" | "promotions">("zone-pricing");

  // Zone Pricing State
  const [isTogglingZonePricing, setIsTogglingZonePricing] = useState(false);
  const [isSavingZonePrices, setIsSavingZonePrices] = useState(false);
  const [editedPrices, setEditedPrices] = useState<Record<number, string>>({});
  const [editedDiscountPrices, setEditedDiscountPrices] = useState<Record<number, string>>({});
  const [searchZoneQuery, setSearchZoneQuery] = useState("");

  // Bulk uniform pricing inputs
  const [uniformPriceBeforeInput, setUniformPriceBeforeInput] = useState("");
  const [uniformPriceAfterInput, setUniformPriceAfterInput] = useState("");

  // Quick single zone setter
  const [quickSelectedZoneId, setQuickSelectedZoneId] = useState<string>("");
  const [quickZoneBeforePrice, setQuickZoneBeforePrice] = useState("");
  const [quickZoneAfterPrice, setQuickZoneAfterPrice] = useState("");

  // Delete dialog
  const [deletingZoneId, setDeletingZoneId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Store Announcement State (only for specific store)
  const [announcementText, setAnnouncementText] = useState("");
  const [savedAnnouncement, setSavedAnnouncement] = useState("");
  const [isSavingAnnouncement, setIsSavingAnnouncement] = useState(false);
  const [isClearingAnnouncement, setIsClearingAnnouncement] = useState(false);
  const [clearAnnouncementDialogOpen, setClearAnnouncementDialogOpen] = useState(false);

  // Fetch Zone Pricing & Store Details
  const isAllStores = pricingScope === "all";
  const apiEndPoint = isAllStores
    ? ["stores", "all", "zone-prices"]
    : ["stores", selectedSpecificStoreId ?? 0, "storeZonePrices"];

  const {
    data: response,
    refetch,
    isLoading: isLoadingData,
  } = useApiQuery({
    queryKey: ["store-zone-prices-manager", selectedStoreId],
    endPoint: apiEndPoint,
    staleTime: 0,
    enabled: !!selectedStoreId,
  });

  const zonePricingData = (response?.data as StoreZonePricesResponse) || undefined;
  const isZonePricingEnabled = zonePricingData?.zonePricingEnabled ?? true;
  const rawZones = zonePricingData?.zones ?? [];

  // Update local states whenever data is fetched
  useEffect(() => {
    if (!zonePricingData) return;

    // Prices mapping
    const pricesMap: Record<number, string> = {};
    const discountsMap: Record<number, string> = {};

    zonePricingData.zones?.forEach((zone) => {
      if (zone.price !== null && zone.price !== undefined) {
        pricesMap[zone.zoneId] = String(zone.price);
      }
      if (zone.priceAfterDiscount !== null && zone.priceAfterDiscount !== undefined) {
        discountsMap[zone.zoneId] = String(zone.priceAfterDiscount);
      }
    });

    setEditedPrices(pricesMap);
    setEditedDiscountPrices(discountsMap);

    // Announcement (for store mode)
    const currentAnnouncement = zonePricingData.announcement ?? "";
    setAnnouncementText(currentAnnouncement);
    setSavedAnnouncement(currentAnnouncement);

    // Store details
    if (isAllStores) {
      setStoreInfo({
        name: locale === "ar" ? "جميع المتاجر (تطبيق عام)" : "All Stores (Global Application)",
        logo: null,
      });
    } else {
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
      setLogoError(false);
    }
  }, [zonePricingData, locale, isAllStores]);

  // Format localized zone name helper
  const getZoneDisplayName = (zone: ZonePrice) => {
    if (!zone?.name) return `Zone ${zone.zoneId}`;
    if (typeof zone.name === "string") return zone.name;
    return (zone.name as any)[locale] || (zone.name as any).ar || (zone.name as any).en || `Zone ${zone.zoneId}`;
  };

  // Toggle Store Zone Pricing (specific store only)
  const handleToggleZonePricing = async () => {
    if (isAllStores || !selectedSpecificStoreId) return;

    setIsTogglingZonePricing(true);
    const newStatus = !isZonePricingEnabled;

    const res = await fetchHelper({
      endPoint: ["stores", selectedSpecificStoreId, "storeZonePricingToggle"],
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

    // Validate discount prices
    for (const [zoneIdStr, beforeVal] of Object.entries(editedPrices)) {
      const zoneId = Number(zoneIdStr);
      const before = Number(beforeVal);
      const afterVal = editedDiscountPrices[zoneId];
      if (afterVal !== undefined && afterVal !== "" && !isNaN(Number(afterVal))) {
        const after = Number(afterVal);
        if (after >= before) {
          const zone = rawZones.find((z) => z.zoneId === zoneId);
          const zName = zone ? getZoneDisplayName(zone) : `#${zoneId}`;
          toast.error(
            `${t("invalidDiscountPrice") || "يجب أن يكون السعر بعد الخصم أقل من السعر قبل الخصم"} (${zName})`
          );
          return;
        }
      }
    }

    const zonePrices = Object.entries(editedPrices)
      .filter(([, val]) => val !== "" && !isNaN(Number(val)))
      .map(([zoneIdStr, price]) => {
        const zoneId = Number(zoneIdStr);
        const afterVal = editedDiscountPrices[zoneId];
        return {
          zoneId,
          price: Number(price),
          priceAfterDiscount:
            afterVal !== undefined && afterVal !== "" && !isNaN(Number(afterVal))
              ? Number(afterVal)
              : null,
        };
      });

    if (zonePrices.length === 0) {
      toast.error(t("noZonePricesToSave"));
      return;
    }

    setIsSavingZonePrices(true);
    const saveEndPoint = isAllStores
      ? ["stores", "all", "zone-prices"]
      : ["stores", selectedSpecificStoreId, "storeZonePrices"];

    const res = await fetchHelper({
      endPoint: saveEndPoint as any,
      method: "PATCH",
      body: { zonePrices },
    });

    if (res?.success) {
      toast.success(isAllStores ? (t("allStoresSavedSuccess") || "تم تعميم وحفظ أسعار المناطق على جميع المتاجر بنجاح") : t("zonePricesSaved"));
      refetch();
    } else {
      toast.error(res?.result?.message ?? res?.message ?? t("error"));
    }
    setIsSavingZonePrices(false);
  };

  // Delete individual zone price override
  const handleDeleteZonePrice = async (zoneId: number) => {
    if (!selectedStoreId) return;

    if (isAllStores) {
      // In all stores mode, delete clears local entries for that zone
      setEditedPrices((prev) => {
        const updated = { ...prev };
        delete updated[zoneId];
        return updated;
      });
      setEditedDiscountPrices((prev) => {
        const updated = { ...prev };
        delete updated[zoneId];
        return updated;
      });
      setDeleteDialogOpen(false);
      setDeletingZoneId(null);
      toast.success(locale === "ar" ? "تم مسح سعر المنطقة — انقر حفظ لاعتماد التعديل" : "Cleared price for zone — click save to commit");
      return;
    }

    const res = await fetchHelper({
      endPoint: ["stores", selectedSpecificStoreId, "storeZonePrices", zoneId],
      method: "DELETE",
    });

    if (res?.success) {
      toast.success(t("zonePriceDeleted"));
      setEditedPrices((prev) => {
        const updated = { ...prev };
        delete updated[zoneId];
        return updated;
      });
      setEditedDiscountPrices((prev) => {
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
    const parsedBefore = parseFloat(uniformPriceBeforeInput);
    if (isNaN(parsedBefore) || parsedBefore < 0) {
      toast.error(t("Enter price") || "يرجى إدخال السعر قبل الخصم");
      return;
    }

    let parsedAfter: number | null = null;
    if (uniformPriceAfterInput.trim() !== "") {
      parsedAfter = parseFloat(uniformPriceAfterInput);
      if (isNaN(parsedAfter) || parsedAfter < 0) {
        toast.error(t("Enter price") || "يرجى إدخال سعر صحيح بعد الخصم");
        return;
      }
      if (parsedAfter >= parsedBefore) {
        toast.error(t("invalidDiscountPrice") || "يجب أن يكون السعر بعد الخصم أقل من السعر قبل الخصم");
        return;
      }
    }

    const updatedPrices: Record<number, string> = { ...editedPrices };
    const updatedDiscounts: Record<number, string> = { ...editedDiscountPrices };

    rawZones.forEach((z) => {
      updatedPrices[z.zoneId] = String(parsedBefore);
      if (parsedAfter !== null) {
        updatedDiscounts[z.zoneId] = String(parsedAfter);
      } else {
        delete updatedDiscounts[z.zoneId];
      }
    });

    setEditedPrices(updatedPrices);
    setEditedDiscountPrices(updatedDiscounts);
    toast.success(
      locale === "ar"
        ? "تم تطبيق السعر الموحد على جميع المناطق — يمكنك الآن تعديل المناطق البعيدة ثم الحفظ"
        : "Uniform price applied to all zones — you can now customize far zones and save"
    );
  };

  // Quick Add / Update single zone price
  const handleQuickSetZonePrice = () => {
    if (!quickSelectedZoneId) {
      toast.error(t("Select a Zone") || "اختر منطقة");
      return;
    }
    const parsedBefore = parseFloat(quickZoneBeforePrice);
    if (isNaN(parsedBefore) || parsedBefore < 0) {
      toast.error(t("Enter price") || "أدخل السعر قبل الخصم");
      return;
    }

    let parsedAfter: number | null = null;
    if (quickZoneAfterPrice.trim() !== "") {
      parsedAfter = parseFloat(quickZoneAfterPrice);
      if (isNaN(parsedAfter) || parsedAfter < 0) {
        toast.error(t("Enter price") || "أدخل سعر صالح بعد الخصم");
        return;
      }
      if (parsedAfter >= parsedBefore) {
        toast.error(t("invalidDiscountPrice") || "يجب أن يكون السعر بعد الخصم أقل من السعر قبل الخصم");
        return;
      }
    }

    const zoneId = Number(quickSelectedZoneId);
    setEditedPrices((prev) => ({
      ...prev,
      [zoneId]: String(parsedBefore),
    }));

    setEditedDiscountPrices((prev) => {
      const updated = { ...prev };
      if (parsedAfter !== null) {
        updated[zoneId] = String(parsedAfter);
      } else {
        delete updated[zoneId];
      }
      return updated;
    });

    toast.success(locale === "ar" ? "تم تعيين سعر المنطقة بالجدول" : "Zone price updated in table");
    setQuickSelectedZoneId("");
    setQuickZoneBeforePrice("");
    setQuickZoneAfterPrice("");
  };

  // Save Announcement (specific store only)
  const handleSaveAnnouncement = async () => {
    if (isAllStores || !selectedSpecificStoreId) return;

    const trimmed = announcementText.trim();
    setIsSavingAnnouncement(true);

    const res = await fetchHelper({
      endPoint: ["stores", selectedSpecificStoreId],
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

  // Clear Announcement (specific store only)
  const handleClearAnnouncement = async () => {
    if (isAllStores || !selectedSpecificStoreId) return;

    setIsClearingAnnouncement(true);
    const res = await fetchHelper({
      endPoint: ["stores", selectedSpecificStoreId],
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

  const promoPricedCount = useMemo(() => {
    return Object.entries(editedDiscountPrices).filter(([zoneIdStr, afterStr]) => {
      if (!afterStr || isNaN(Number(afterStr))) return false;
      const beforeStr = editedPrices[Number(zoneIdStr)];
      return beforeStr && !isNaN(Number(beforeStr)) && Number(afterStr) < Number(beforeStr);
    }).length;
  }, [editedPrices, editedDiscountPrices]);

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

      {/* Top-Level Navigation Tabs */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-muted/60 border w-fit shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("zone-pricing")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "zone-pricing"
              ? "bg-background shadow-xs text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Layers className="h-4 w-4 text-primary" />
          {t("baseZonePricesTab") || (locale === "ar" ? "أسعار المناطق الأساسية" : "Base Zone Prices")}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("promotions")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "promotions"
              ? "bg-background shadow-xs text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Gift className="h-4 w-4 text-primary" />
          {t("deliveryPromotionsTab") || (locale === "ar" ? "العروض والحملات" : "Promotions & Campaigns")}
        </button>
      </div>

      {activeTab === "promotions" ? (
        <DeliveryPromotionsTab />
      ) : (
        <>
          {/* Step 1: Pricing Scope Selector (All Stores vs Specific Store) */}
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    {t("pricingScope") || (locale === "ar" ? "نطاق إدارة الأسعار" : "Pricing Scope")}
                  </CardTitle>
                  <CardDescription className="mt-0.5">
                    {pricingScope === "all"
                      ? (t("allStoresDescription") || (locale === "ar" ? "تسعير موحد لجميع المتاجر، مع إمكانية تعديل المناطق البعيدة بالأسفل." : "Unified pricing for all stores, with ability to customize far zones below."))
                      : (locale === "ar" ? "تخصيص أسعار مناطق خاصة لمتجر أو مطعم محدد." : "Customize zone prices for a specific store.")}
                  </CardDescription>
                </div>

                {/* Scope Toggle Buttons */}
                <div className="flex items-center p-1 rounded-xl bg-muted/80 border gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPricingScope("all");
                      setSearchZoneQuery("");
                      setUniformPriceBeforeInput("");
                      setUniformPriceAfterInput("");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      pricingScope === "all"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Globe className="h-3.5 w-3.5 text-primary" />
                    {t("allStoresOption") || (locale === "ar" ? "جميع المتاجر (تطبيق عام)" : "All Stores (Global)")}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPricingScope("store");
                      setSearchZoneQuery("");
                      setUniformPriceBeforeInput("");
                      setUniformPriceAfterInput("");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      pricingScope === "store"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <StoreIcon className="h-3.5 w-3.5 text-primary" />
                    {t("specificStoreOption") || (locale === "ar" ? "متجر محدد (تخصيص)" : "Specific Store")}
                  </button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {pricingScope === "all" ? (
                /* All Stores Banner */
                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Globe className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        {locale === "ar" ? "جميع المتاجر والمطاعم" : "All Stores & Restaurants"}
                        <Badge variant="default" className="text-xs bg-primary text-primary-foreground">
                          {locale === "ar" ? "تطبيق عام" : "Global"}
                        </Badge>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {locale === "ar"
                          ? "الأسعار المدخلة أدناه (قبل وبعد الخصم) يتم حفظها وتعميمها على كل المتاجر بنقرة واحدة."
                          : "Prices below (before & after discount) are saved and applied to all stores in one click."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Specific Store Picker */
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
                      value={selectedSpecificStoreId ? String(selectedSpecificStoreId) : ""}
                      onChange={(val) => {
                        const id = val ? Number(val) : null;
                        setSelectedSpecificStoreId(id);
                        setUniformPriceBeforeInput("");
                        setUniformPriceAfterInput("");
                        setQuickSelectedZoneId("");
                        setQuickZoneBeforePrice("");
                        setQuickZoneAfterPrice("");
                        setSearchZoneQuery("");
                      }}
                      placeholder={t("selectStorePrompt")}
                    />
                  </div>

                  {selectedSpecificStoreId && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border">
                      <div className="flex items-center gap-3">
                        {getLogoUrl(storeInfo?.logo) && !logoError ? (
                          <img
                            src={getLogoUrl(storeInfo?.logo)!}
                            alt={storeInfo?.name || "Store"}
                            className="h-12 w-12 rounded-lg object-cover border bg-background"
                            onError={() => setLogoError(true)}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                            <StoreIcon className="h-6 w-6" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-sm">
                            {storeInfo?.name || `Store #${selectedSpecificStoreId}`}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={isZonePricingEnabled ? "default" : "outline"} className="text-xs">
                              {isZonePricingEnabled ? t("zonePricingEnabled") : t("zonePricingDisabled")}
                            </Badge>
                            {savedAnnouncement && (
                              <Badge variant="secondary" className="text-xs gap-1">
                                <Megaphone className="h-3 w-3" />
                                {t("Active") || "نشط"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <Link href={`/stores/${selectedSpecificStoreId}`} target="_blank">
                        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                          <ExternalLink className="h-3.5 w-3.5" />
                          {t("storeDetailsLink")}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prompt when in specific store mode and no store selected yet */}
          {pricingScope === "store" && !selectedSpecificStoreId ? (
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
            /* Loading Spinner */
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            /* Main Pricing & Configuration Section */
            <div className="space-y-6">
              {/* Specific Store Announcement Card (only shown when a specific store is selected) */}
              {!isAllStores && selectedSpecificStoreId && (
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-amber-500" />
                        {t("storeAnnouncementTitle")}
                      </CardTitle>
                      {savedAnnouncement ? (
                        <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-white text-xs">
                          {t("Active") || (locale === "ar" ? "نشط حالياً" : "Active")}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          {t("None") || (locale === "ar" ? "لا يوجد تنبيه" : "None")}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{t("storeAnnouncementDesc")}</CardDescription>
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
              )}

              {/* Zone Pricing Card */}
              <Card className="shadow-sm">
                <CardHeader className="pb-4 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <MapPinned className="h-4 w-4 text-primary" />
                        {t("Zone Pricing")}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {isAllStores
                          ? (locale === "ar"
                              ? "حدد السعر قبل الخصم (الرسمي) والسعر بعد الخصم (المخفض) للمناطق. سيتم تطبيقه على كل المتاجر."
                              : "Set base and promo prices per zone. These will apply across all stores.")
                          : t("zonePricingDescription")}
                      </CardDescription>
                    </div>

                    {/* Status Toggle Switch (only shown for specific store) */}
                    {!isAllStores && (
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
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-6 space-y-6">
                  {!isZonePricingEnabled && !isAllStores ? (
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
                      {/* Summary Statistics Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl bg-muted/40 border text-center">
                          <span className="text-xs text-muted-foreground block">{t("allZonesCount")}</span>
                          <span className="text-lg font-bold">{rawZones.length}</span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                          <span className="text-xs text-emerald-700 dark:text-emerald-300 block">
                            {locale === "ar" ? "مناطق مسعرة (أساسي)" : "Priced Zones"}
                          </span>
                          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            {customPricedCount}
                          </span>
                        </div>
                        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                          <span className="text-xs text-blue-700 dark:text-blue-300 block">
                            {locale === "ar" ? "مناطق عليها خصم/عرض" : "Promo Zones"}
                          </span>
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {promoPricedCount}
                          </span>
                        </div>
                      </div>

                      {/* Option 1: Uniform Bulk Pricing Bar (Before & After Discount) */}
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                        <div className="flex items-center gap-2">
                          <Layers className="h-4 w-4 text-primary" />
                          <h4 className="text-sm font-semibold">
                            {t("bulkPricingTitle") || (locale === "ar" ? "التسعير الموحد لجميع المناطق" : "Bulk Uniform Pricing")}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {locale === "ar"
                            ? "أدخل السعر الموحد قبل وبعد الخصم لتطبيقه على كل المناطق دفعة واحدة، ثم يمكنك تعديل المناطق البعيدة بشكل منفصل بالجدول قبل الحفظ."
                            : "Enter uniform price before and after discount to fill all zones at once, then adjust far zones individually before saving."}
                        </p>

                        <div className="flex flex-wrap items-end gap-3 pt-1">
                          {/* Price Before Discount */}
                          <div className="w-full sm:w-48">
                            <Label className="text-xs font-medium text-foreground mb-1 block">
                              {t("uniformPriceBeforeDiscount") || (locale === "ar" ? "السعر قبل الخصم (الرسمي)" : "Price Before Discount")}
                            </Label>
                            <div className="relative">
                              <Input
                                type="number"
                                min="0"
                                step="0.5"
                                placeholder="35"
                                value={uniformPriceBeforeInput}
                                onChange={(e) => setUniformPriceBeforeInput(e.target.value)}
                                className="text-center font-medium pr-10"
                              />
                              <span className="absolute right-3 top-2.5 text-xs text-muted-foreground pointer-events-none">
                                {t("EGP") || "ج.م"}
                              </span>
                            </div>
                          </div>

                          {/* Price After Discount (Optional) */}
                          <div className="w-full sm:w-48">
                            <Label className="text-xs font-medium text-foreground mb-1 block">
                              {t("uniformPriceAfterDiscount") || (locale === "ar" ? "السعر بعد الخصم (اختياري)" : "Price After Discount (Opt)")}
                            </Label>
                            <div className="relative">
                              <Input
                                type="number"
                                min="0"
                                step="0.5"
                                placeholder="20"
                                value={uniformPriceAfterInput}
                                onChange={(e) => setUniformPriceAfterInput(e.target.value)}
                                className="text-center font-medium pr-10"
                              />
                              <span className="absolute right-3 top-2.5 text-xs text-muted-foreground pointer-events-none">
                                {t("EGP") || "ج.م"}
                              </span>
                            </div>
                          </div>

                          <Button
                            variant="secondary"
                            size="default"
                            onClick={handleApplyUniformPrice}
                            disabled={!uniformPriceBeforeInput}
                            className="gap-1.5 h-10 px-4"
                          >
                            <Layers className="h-4 w-4 text-primary" />
                            {t("applyToAllZones") || (locale === "ar" ? "تطبيق على جميع المناطق" : "Apply to All Zones")}
                          </Button>
                        </div>
                      </div>

                      {/* Option 2: Quick Zone Picker Dropdown */}
                      <div className="p-4 rounded-xl bg-muted/40 border space-y-3">
                        <div className="flex items-center gap-2">
                          <MapPinned className="h-4 w-4 text-primary" />
                          <h4 className="text-sm font-semibold">
                            {t("quickZoneSelect") || (locale === "ar" ? "تعديل سريع لمنطقة معينة (مثل المناطق البعيدة)" : "Quick Zone Adjust")}
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                          <div className="sm:col-span-1">
                            <Label className="text-xs text-muted-foreground mb-1 block">
                              {t("Zone") || "المنطقة"}
                            </Label>
                            <select
                              className="flex h-9 w-full rounded-xl border border-input/70 bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                              value={quickSelectedZoneId}
                              onChange={(e) => {
                                const zid = e.target.value;
                                setQuickSelectedZoneId(zid);
                                if (zid) {
                                  const numId = Number(zid);
                                  setQuickZoneBeforePrice(editedPrices[numId] ?? "");
                                  setQuickZoneAfterPrice(editedDiscountPrices[numId] ?? "");
                                } else {
                                  setQuickZoneBeforePrice("");
                                  setQuickZoneAfterPrice("");
                                }
                              }}
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
                              {t("priceBeforeDiscount") || "قبل الخصم"}
                            </Label>
                            <div className="relative">
                              <Input
                                type="number"
                                min="0"
                                step="0.5"
                                placeholder="35"
                                value={quickZoneBeforePrice}
                                onChange={(e) => setQuickZoneBeforePrice(e.target.value)}
                                className="pr-10 h-9"
                              />
                              <span className="absolute right-3 top-2 text-xs text-muted-foreground pointer-events-none">
                                {t("EGP") || "ج.م"}
                              </span>
                            </div>
                          </div>

                          <div className="sm:col-span-1">
                            <Label className="text-xs text-muted-foreground mb-1 block">
                              {t("priceAfterDiscount") || "بعد الخصم (اختياري)"}
                            </Label>
                            <div className="relative">
                              <Input
                                type="number"
                                min="0"
                                step="0.5"
                                placeholder="20"
                                value={quickZoneAfterPrice}
                                onChange={(e) => setQuickZoneAfterPrice(e.target.value)}
                                className="pr-10 h-9"
                              />
                              <span className="absolute right-3 top-2 text-xs text-muted-foreground pointer-events-none">
                                {t("EGP") || "ج.م"}
                              </span>
                            </div>
                          </div>

                          <div className="sm:col-span-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleQuickSetZonePrice}
                              disabled={!quickSelectedZoneId || !quickZoneBeforePrice}
                              className="w-full h-9"
                            >
                              {t("Apply") || "تحديث بالجدول"}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Zones Table with Filter & Dual Pricing Columns */}
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
                            {isAllStores
                              ? (t("saveAllStoresPrices") || "حفظ وتعميم الأسعار لجميع المتاجر")
                              : (t("saveStorePrices") || "حفظ أسعار المتجر")}
                          </Button>
                        </div>

                        <div className="rounded-xl border overflow-hidden">
                          <Table>
                            <TableHeader className="bg-muted/50">
                              <TableRow>
                                <TableHead>{t("Zone")}</TableHead>
                                <TableHead className="text-center w-[160px]">
                                  {t("priceBeforeDiscount") || (locale === "ar" ? "السعر قبل الخصم" : "Price Before Discount")}
                                </TableHead>
                                <TableHead className="text-center w-[160px]">
                                  {t("priceAfterDiscount") || (locale === "ar" ? "السعر بعد الخصم (عرض)" : "Price After Discount")}
                                </TableHead>
                                <TableHead className="text-center w-[140px]">
                                  {t("Status") || "الحالة / العرض"}
                                </TableHead>
                                <TableHead className="text-center w-[80px]">
                                  {t("Actions")}
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredZones.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    {t("No data found") || "لا توجد مناطق مطابقة للبحث"}
                                  </TableCell>
                                </TableRow>
                              ) : (
                                filteredZones.map((zone) => {
                                  const zoneName = getZoneDisplayName(zone);
                                  const beforeStr = editedPrices[zone.zoneId] ?? "";
                                  const afterStr = editedDiscountPrices[zone.zoneId] ?? "";

                                  const hasBefore = beforeStr !== "" && !isNaN(Number(beforeStr));
                                  const hasAfter = afterStr !== "" && !isNaN(Number(afterStr));

                                  const beforeNum = hasBefore ? Number(beforeStr) : null;
                                  const afterNum = hasAfter ? Number(afterStr) : null;

                                  const isPromoValid =
                                    beforeNum !== null && afterNum !== null && afterNum < beforeNum;
                                  const isPromoInvalid =
                                    beforeNum !== null && afterNum !== null && afterNum >= beforeNum;

                                  return (
                                    <TableRow key={zone.zoneId}>
                                      <TableCell>
                                        <div className="font-medium text-sm">{zoneName}</div>
                                        <span className="text-xs text-muted-foreground">ID: #{zone.zoneId}</span>
                                      </TableCell>

                                      {/* Column 2: Price Before Discount */}
                                      <TableCell className="text-center">
                                        <div className="relative w-full max-w-[130px] mx-auto">
                                          <Input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            placeholder="35"
                                            value={beforeStr}
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

                                      {/* Column 3: Price After Discount (Optional Promo) */}
                                      <TableCell className="text-center">
                                        <div className="relative w-full max-w-[130px] mx-auto">
                                          <Input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            placeholder={locale === "ar" ? "اختياري" : "Optional"}
                                            value={afterStr}
                                            onChange={(e) =>
                                              setEditedDiscountPrices((prev) => ({
                                                ...prev,
                                                [zone.zoneId]: e.target.value,
                                              }))
                                            }
                                            className={`text-center pr-8 ${
                                              isPromoInvalid
                                                ? "border-destructive focus-visible:ring-destructive"
                                                : isPromoValid
                                                ? "border-emerald-500/50"
                                                : ""
                                            }`}
                                          />
                                          <span className="absolute right-2.5 top-2.5 text-xs text-muted-foreground pointer-events-none">
                                            {t("EGP") || "ج.م"}
                                          </span>
                                        </div>
                                      </TableCell>

                                      {/* Column 4: Status / Promo Badge */}
                                      <TableCell className="text-center">
                                        {isPromoInvalid ? (
                                          <Badge variant="destructive" className="text-xs">
                                            {locale === "ar" ? "غير صالح (>=)" : "Invalid"}
                                          </Badge>
                                        ) : isPromoValid ? (
                                          <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs">
                                            <Tag className="h-3 w-3" />
                                            {locale === "ar"
                                              ? `خصم ${Math.round((beforeNum - afterNum) * 10) / 10} ج.م`
                                              : `${Math.round((beforeNum - afterNum) * 10) / 10} OFF`}
                                          </Badge>
                                        ) : hasBefore ? (
                                          <Badge variant="secondary" className="text-xs">
                                            {t("regularPriceBadge") || (locale === "ar" ? "سعر عادي" : "Standard")}
                                          </Badge>
                                        ) : (
                                          <Badge variant="outline" className="text-muted-foreground text-xs">
                                            {t("App Default")}
                                          </Badge>
                                        )}
                                      </TableCell>

                                      {/* Column 5: Action (Clear / Delete) */}
                                      <TableCell className="text-center">
                                        {(hasBefore || hasAfter) && (
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
                                                title={locale === "ar" ? "مسح سعر المنطقة" : "Clear zone price"}
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-sm">
                                              <DialogHeader>
                                                <DialogTitle>{t("Delete Zone Price")}</DialogTitle>
                                                <DialogDescription>
                                                  {isAllStores
                                                    ? (locale === "ar"
                                                        ? "سيتم مسح الأسعار المحددة لهذه المنطقة من الجدول."
                                                        : "This will clear the prices for this zone from the table.")
                                                    : t("deleteZonePriceConfirm")}
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
                            {isAllStores
                              ? (t("saveAllStoresPrices") || "حفظ وتعميم الأسعار لجميع المتاجر")
                              : (t("saveStorePrices") || "حفظ أسعار المتجر")}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
