"use client";

import { fetchHelper } from "@/api/fetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useTranslations } from "@/lib/i18n";
import { useRouter } from "@/lib/navigation";
import { useApiQuery } from "@/hooks/useApiQuery";
import { MapPinned, Save, Trash2, ToggleLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ZonePrice {
  zoneId: number;
  name: { ar?: string; en?: string };
  cityId: number;
  price: number | null;
}

interface ZonePricingResponse {
  zonePricingEnabled: boolean;
  zones: ZonePrice[];
}

export function StoreZonePricingTab({ storeId }: { storeId: number }) {
  const t = useTranslations();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [editedPrices, setEditedPrices] = useState<Record<number, string>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingZoneId, setDeletingZoneId] = useState<number | null>(null);

  const { data: response, refetch } = useApiQuery({
    queryKey: ["store-zone-prices", storeId],
    endPoint: ["stores", storeId, "storeZonePrices"],
    staleTime: 0
  });

  const zonePricingData = response?.data as ZonePricingResponse | undefined;
  const isEnabled = zonePricingData?.zonePricingEnabled ?? false;
  const zones = zonePricingData?.zones ?? [];

  useEffect(() => {
    const initial: Record<number, string> = {};
    zones.forEach(z => {
      if (z.price !== null && z.price !== undefined) {
        initial[z.zoneId] = String(z.price);
      }
    });
    setEditedPrices(initial);
  }, [zones.length]);

  const handleToggle = async () => {
    setIsToggling(true);
    const res = await fetchHelper({
      endPoint: ["stores", storeId, "storeZonePricingToggle"],
      method: "PATCH",
      body: { enabled: !isEnabled }
    });

    if (res?.success) {
      toast.success(
        !isEnabled ? t("zonePricingEnabled") : t("zonePricingDisabled")
      );
      refetch();
    } else {
      toast.error(res?.result?.message ?? t("error"));
    }
    setIsToggling(false);
  };

  const handleSavePrices = async () => {
    const zonePrices = Object.entries(editedPrices)
      .filter(([, val]) => val !== "" && !isNaN(Number(val)))
      .map(([zoneId, price]) => ({
        zoneId: Number(zoneId),
        price: Number(price)
      }));

    if (zonePrices.length === 0) {
      toast.error(t("noZonePricesToSave"));
      return;
    }

    setIsSaving(true);
    const res = await fetchHelper({
      endPoint: ["stores", storeId, "storeZonePrices"],
      method: "PATCH",
      body: { zonePrices }
    });

    if (res?.success) {
      toast.success(t("zonePricesSaved"));
      refetch();
    } else {
      toast.error(res?.result?.message ?? t("error"));
    }
    setIsSaving(false);
  };

  const handleDeletePrice = async (zoneId: number) => {
    const res = await fetchHelper({
      endPoint: ["stores", storeId, "storeZonePrices", zoneId],
      method: "DELETE"
    });

    if (res?.success) {
      toast.success(t("zonePriceDeleted"));
      setEditedPrices(prev => {
        const next = { ...prev };
        delete next[zoneId];
        return next;
      });
      refetch();
    } else {
      toast.error(res?.result?.message ?? t("error"));
    }
    setDeleteDialogOpen(false);
    setDeletingZoneId(null);
  };

  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-primary" />
            {t("Zone Pricing")}
          </CardTitle>
          <div className="flex items-center gap-3">
            <Label
              htmlFor="zone-pricing-toggle"
              className="text-sm text-muted-foreground"
            >
              {isEnabled ? t("Enabled") : t("Disabled")}
            </Label>
            <Switch
              id="zone-pricing-toggle"
              checked={isEnabled}
              onCheckedChange={handleToggle}
              disabled={isToggling}
            />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t("zonePricingDescription")}
        </p>
      </CardHeader>

      <CardContent>
        {!isEnabled ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ToggleLeft className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground text-sm">
              {t("zonePricingDisabledMessage")}
            </p>
          </div>
        ) : zones.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            {t("No zones available")}
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>{t("Zone")}</TableHead>
                  <TableHead className="text-center w-[180px]">
                    {t("Custom Price")}
                  </TableHead>
                  <TableHead className="text-center w-[120px]">
                    {t("Status")}
                  </TableHead>
                  <TableHead className="text-center w-[80px]">
                    {t("Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zones.map(zone => {
                  const zoneName =
                    zone.name?.ar || zone.name?.en || `Zone ${zone.zoneId}`;
                  const hasPrice = zone.price !== null && zone.price !== undefined;

                  return (
                    <TableRow key={zone.zoneId}>
                      <TableCell>
                        <div className="font-medium">{zoneName}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder={t("Enter price")}
                          value={editedPrices[zone.zoneId] ?? ""}
                          onChange={e =>
                            setEditedPrices(prev => ({
                              ...prev,
                              [zone.zoneId]: e.target.value
                            }))
                          }
                          className="w-full max-w-[150px] mx-auto text-center"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        {hasPrice ? (
                          <Badge variant="default">{t("Custom")}</Badge>
                        ) : (
                          <Badge variant="outline">{t("App Default")}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {hasPrice && (
                          <Dialog
                            open={deleteDialogOpen && deletingZoneId === zone.zoneId}
                            onOpenChange={open => {
                              setDeleteDialogOpen(open);
                              if (!open) setDeletingZoneId(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setDeletingZoneId(zone.zoneId)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm">
                              <DialogHeader>
                                <DialogTitle>
                                  {t("Delete Zone Price")}
                                </DialogTitle>
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
                                  onClick={() => handleDeletePrice(zone.zoneId)}
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
                })}
              </TableBody>
            </Table>

            <div className="flex justify-end pt-2">
              <Button onClick={handleSavePrices} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {t("Save Prices")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
