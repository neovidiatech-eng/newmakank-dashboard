import type { ApiResponseInvoiceCustomDelivery } from "@/pages/dashboard/orders/types";
import { PriceAmount } from "@/components/PriceAmount";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock3, ImageIcon, MapPin, Navigation, Package, PackageCheck, Phone, Truck, Wallet } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import Image from "@/lib/Image";
import dynamic from "@/lib/dynamic";
import { getEnv } from "@/lib/env";

const RouteMapView = dynamic(() => import("./RouteMapView"));

type LocalizedText = string | { ar?: string; en?: string } | null | undefined;

type StationImage = {
  id?: number;
  image?: string | null;
  url?: string | null;
  path?: string | null;
};

type CustomDeliveryStation = {
  id?: number;
  sequence?: number;
  order?: number;
  step?: number;
  lat?: number | string | null;
  lng?: number | string | null;
  name?: LocalizedText;
  label?: LocalizedText;
  purchaseList?: string | null;
  notes?: string | null;
  estimatedCost?: number | string | null;
  status?: "WAITING" | "GOING" | "REACHED" | string;
  Images?: StationImage[];
  images?: StationImage[];
  // Online-delivery (multi-recipient batch) fields — only present on ONLINE-kind orders.
  type?: "PICKUP" | "DROPOFF" | string;
  contactPhone?: string | null;
  collectionAmount?: number | string | null;
  addressDetails?: string | null;
  packagingRequested?: boolean | null;
};

type CustomDeliveryProgress = {
  currentStep?: number;
  totalSteps?: number;
  finished?: boolean;
};

function getLocalizedText(value: LocalizedText) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.ar || value.en || "";
}

function getImageUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${getEnv("VITE_API_URL")}${path}`;
}

function getStationLatLng(station?: CustomDeliveryStation) {
  const lat = Number(station?.lat);
  const lng = Number(station?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

function getStatusIcon(status?: string) {
  if (status === "REACHED") return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  if (status === "GOING") return <Navigation className="h-4 w-4 text-orange-500" />;
  return <Clock3 className="h-4 w-4 text-muted-foreground" />;
}

export default function InvoiceCustomDeliveryInfo({
  customDelivery,
  stations,
  progress
}: {
  customDelivery: ApiResponseInvoiceCustomDelivery | null | undefined;
  stations?: CustomDeliveryStation[];
  progress?: CustomDeliveryProgress | null;
}) {
  const t = useTranslations();
  const sortedStations = [...(stations ?? [])].sort(
    (first, second) =>
      Number(first.sequence ?? first.order ?? first.step ?? 0) -
      Number(second.sequence ?? second.order ?? second.step ?? 0)
  );
  const firstStationLocation = getStationLatLng(sortedStations[0]);
  const lastStationLocation = getStationLatLng(sortedStations[sortedStations.length - 1]);
  const pickupLocation = customDelivery?.pickupLocation ?? firstStationLocation;
  const deliveryLocation = customDelivery?.deliveryLocation ?? lastStationLocation;

  if (!customDelivery && sortedStations.length === 0)
    return <div className="text-muted-foreground text-sm">{t("No Custom Delivery Info")}</div>;

  return (
    <div className="space-y-4 text-sm">
      {/* Route Map */}
      {pickupLocation && deliveryLocation && (
        <RouteMapView
          pickup={pickupLocation}
          delivery={deliveryLocation}
          pickupLabel={t("Pickup Location")}
          deliveryLabel={t("Delivery Location")}
        />
      )}

      {/* Legend */}
      {pickupLocation && deliveryLocation && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground px-1">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-green-600" />
            {t("Pickup Location")}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-red-600" />
            {t("Delivery Location")}
          </span>
        </div>
      )}

      {progress && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/20 p-3">
          <Badge variant={progress.finished ? "success" : "secondary"}>
            {progress.finished ? t("Finished") : t("In Progress")}
          </Badge>
          <span className="text-muted-foreground">
            {t("Step")} {progress.currentStep ?? 0} {t("of")} {progress.totalSteps ?? sortedStations.length}
          </span>
        </div>
      )}

      {sortedStations.length > 0 && (
        <div className="space-y-3">
          <div className="font-semibold">{t("Custom Delivery Stations")}</div>
          {sortedStations.map((station, index) => {
            const images = station.Images ?? station.images ?? [];
            const stationName =
              getLocalizedText(station.name) ||
              getLocalizedText(station.label) ||
              `${t("Station")} ${index + 1}`;

            return (
              <div key={station.id ?? index} className="rounded-xl border bg-background p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getStatusIcon(station.status)}</div>
                    <div>
                      <div className="font-semibold">
                        {index + 1}. {stationName}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {station.type && <Badge variant="secondary">{t(station.type)}</Badge>}
                        {station.status && <Badge variant="outline">{t(station.status)}</Badge>}
                        {station.lat && station.lng && (
                          <span className="flex items-center gap-1" dir="ltr">
                            <MapPin className="h-3.5 w-3.5" />
                            {station.lat}, {station.lng}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {station.estimatedCost !== undefined && station.estimatedCost !== null && (
                    <div className="font-medium">
                      <PriceAmount value={Number(station.estimatedCost)} />
                    </div>
                  )}
                </div>

                {station.purchaseList && (
                  <div className="mt-3 rounded-lg bg-muted/20 p-2">
                    <div className="text-xs text-muted-foreground">{t("Purchase List")}</div>
                    <div>{station.purchaseList}</div>
                  </div>
                )}

                {(station.contactPhone || station.addressDetails) && (
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {station.contactPhone && (
                      <div className="rounded-lg bg-muted/20 p-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          {t("Phone")}
                        </div>
                        <div dir="ltr">{station.contactPhone}</div>
                      </div>
                    )}
                    {station.addressDetails && (
                      <div className="rounded-lg bg-muted/20 p-2">
                        <div className="text-xs text-muted-foreground">{t("Address Details")}</div>
                        <div>{station.addressDetails}</div>
                      </div>
                    )}
                  </div>
                )}

                {(station.collectionAmount !== undefined && station.collectionAmount !== null) && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted/20 p-2">
                    <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{t("Collection Amount")}:</span>
                    <PriceAmount value={Number(station.collectionAmount)} />
                  </div>
                )}

                {station.packagingRequested && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted/20 p-2 text-xs">
                    <PackageCheck className="h-3.5 w-3.5 text-emerald-600" />
                    {t("Packaging Requested")}
                  </div>
                )}

                {station.notes && (
                  <div className="mt-3 rounded-lg bg-muted/20 p-2">
                    <div className="text-xs text-muted-foreground">{t("Notes")}</div>
                    <div>{station.notes}</div>
                  </div>
                )}

                {images.length > 0 && (
                  <div className="mt-3">
                    <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <ImageIcon className="h-3.5 w-3.5" />
                      {t("Station Images")}
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {images.map((image, imageIndex) => {
                        const src = getImageUrl(image.image || image.url || image.path);
                        if (!src) return null;

                        return (
                          <a
                            key={image.id ?? imageIndex}
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative aspect-square overflow-hidden rounded-lg border bg-muted"
                          >
                            <Image src={src} alt={stationName} fill className="object-cover" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Items Description */}
      {customDelivery?.itemsDescription && (
        <div>
          <div className="text-muted-foreground mb-1 flex items-center gap-1">
            <Package className="h-3.5 w-3.5" />
            {t("Items Description")}
          </div>
          <div className="pl-5 border rounded p-2 bg-muted/20">
            {customDelivery.itemsDescription}
          </div>
        </div>
      )}

      {/* Estimated Items Cost */}
      {customDelivery?.estimatedItemsCost !== undefined && (
        <div>
          <div className="text-muted-foreground mb-1">{t("Estimated Items Cost")}</div>
          <div className="pl-5 font-medium">
            <PriceAmount value={customDelivery.estimatedItemsCost} />
          </div>
        </div>
      )}

      {/* Driver Instructions */}
      {customDelivery?.driverInstructions && (
        <div>
          <div className="text-muted-foreground mb-1 flex items-center gap-1">
            <Truck className="h-3.5 w-3.5" />
            {t("Driver Instructions")}
          </div>
          <div className="pl-5 border rounded p-2 bg-muted/20">
            {customDelivery.driverInstructions}
          </div>
        </div>
      )}
    </div>
  );
}
