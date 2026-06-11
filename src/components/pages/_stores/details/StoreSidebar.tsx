import { stores } from "@/pages/dashboard/stores/types";
import MapPointerInput from "@/components/common/Inputs/map/MapPointerInput";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Power } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { StoreStatusSelect } from "../StoreStatusSelect";

interface StoreSidebarProps {
  data: stores & { status?: string };
}

export function StoreSidebar({ data }: StoreSidebarProps) {
  const t = useTranslations();
  console.log(data, "sda;e2ds");

  return (
    <div className="space-y-5">
      {/* Store status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
            <Power className="h-4 w-4 text-primary" />
            {t("Store Status")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StoreStatusSelect storeId={data.id} initialStatus={data.status || "OPEN"} />
        </CardContent>
      </Card>

      {/* Location — map fills the card, no nested card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground uppercase tracking-wide">
            <MapPin className="h-4 w-4 text-primary" />
            {t("Location & Contact")}
          </CardTitle>
        </CardHeader>
        <div className="h-64 w-full">
          <MapPointerInput
            value={{ lat: data?.lat, lng: data?.lng }}
            hideActions={true}
            className="h-full"
            defaultCenter={{ lat: data?.lat, lng: data?.lng }}
            defaultZoom={15}
          />
        </div>
      </Card>
    </div>
  );
}
