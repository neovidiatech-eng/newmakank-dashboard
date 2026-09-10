import React from "react";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useCityStore } from "@/store/cityStore";
import { useLocale, useTranslations } from "@/lib/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CitySelectorProps {
  value?: number | null;
  onChange?: (cityId: number | null, cityName?: string | null) => void;
  className?: string;
  placeholder?: string;
  allCitiesLabel?: string;
  showIcon?: boolean;
}

export default function CitySelector({
  value,
  onChange,
  className,
  placeholder,
  allCitiesLabel,
  showIcon = true,
}: CitySelectorProps) {
  const t = useTranslations();
  const locale = useLocale();
  const storeCityId = useCityStore((state) => state.selectedCityId);
  const setStoreCity = useCityStore((state) => state.setCity);

  const isControlled = value !== undefined;
  const currentCityId = isControlled ? value : storeCityId;

  const { data: response } = useApiQuery({
    queryKey: ["cities", "selector"],
    endPoint: ["cities"],
    params: { limit: 1000 },
  });

  const rawCities = (response?.data?.data || response?.data || []) as any[];
  const cities = Array.isArray(rawCities) ? rawCities : [];

  const getCityName = (city: any): string => {
    if (!city) return "";
    if (typeof city.name === "string") return city.name;
    if (typeof city.name === "object" && city.name) {
      return (locale === "ar" ? city.name.ar : city.name.en) || city.name.ar || city.name.en || "";
    }
    return String(city.id || "");
  };

  const handleValueChange = (val: string) => {
    if (val === "all" || !val) {
      if (onChange) {
        onChange(null, null);
      }
      if (!isControlled) {
        setStoreCity(null, null);
      }
    } else {
      const selectedId = Number(val);
      const matchedCity = cities.find((c) => Number(c.id) === selectedId);
      const name = matchedCity ? getCityName(matchedCity) : null;
      if (onChange) {
        onChange(selectedId, name);
      }
      if (!isControlled) {
        setStoreCity(selectedId, name);
      }
    }
  };

  const selectValueStr = currentCityId ? String(currentCityId) : "all";
  const labelAll = allCitiesLabel || t("All Cities") || "كل المدن";
  const placeholderText = placeholder || t("Select City") || "اختر المدينة";

  return (
    <Select value={selectValueStr} onValueChange={handleValueChange}>
      <SelectTrigger className={cn("w-[180px] h-9 text-xs gap-2", className)}>
        {showIcon && <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
        <SelectValue placeholder={placeholderText} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{labelAll}</SelectItem>
        {cities.map((city: any) => {
          const cName = getCityName(city);
          return (
            <SelectItem key={city.id} value={String(city.id)}>
              {cName}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
