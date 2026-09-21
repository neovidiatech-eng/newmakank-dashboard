import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import { Link } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import StoresTable from "@/components/pages/_stores/StoresTable";
import { fetchHelper } from "@/api/fetch";
import { MapPin } from "lucide-react";

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Stores"];
  const resolvedSearchParams = await searchParams;

  let cities: any[] = [];
  try {
    const citiesRes = await fetchHelper({
      endPoint: ["cities"],
      params: { limit: -1, active: true }
    });
    const rawCities = citiesRes?.data?.data || citiesRes?.data;
    if (Array.isArray(rawCities)) {
      cities = rawCities;
    }
  } catch {
    // fallback gracefully if cities fetch encounters error
  }

  const buildFilterUrl = (updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams();
    if (resolvedSearchParams) {
      Object.entries(resolvedSearchParams).forEach(([k, v]) => {
        if (v && typeof v === "string") params.set(k, v);
      });
    }
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === undefined || v === "") {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });
    params.delete("page");
    const qs = params.toString();
    return qs ? `/stores?${qs}` : "/stores";
  };

  return (
    <>
      <CustomHeader />
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Link href={buildFilterUrl({ isPartner: null, isStoreAccepted: null })}>
          <Badge variant={!resolvedSearchParams?.isStoreAccepted && !resolvedSearchParams?.isPartner ? "default" : "outline"} className="cursor-pointer px-3 py-1.5">
            {t("Stores") || "جميع المتاجر"}
          </Badge>
        </Link>
        <Link href={buildFilterUrl({ isPartner: "true", isStoreAccepted: null })}>
          <Badge variant={resolvedSearchParams?.isPartner === "true" ? "default" : "outline"} className="cursor-pointer px-3 py-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-400">
            🤝 {t("Partner Stores") || "المطاعم الشريكة"}
          </Badge>
        </Link>
        <Link href={buildFilterUrl({ isStoreAccepted: "false", isPartner: null })}>
          <Badge variant={resolvedSearchParams?.isStoreAccepted === "false" ? "default" : "outline"} className="cursor-pointer px-3 py-1.5">
            {t("Pending Review") || "قيد المراجعة"}
          </Badge>
        </Link>
        <Link href="/stores/pricing-announcements">
          <Badge variant="outline" className="cursor-pointer px-3 py-1.5 bg-primary/10 text-primary border-primary/30 hover:bg-primary/20">
            📍 {t("storePricingAndAnnouncements") || "تسعير وتنبيهات المتاجر"}
          </Badge>
        </Link>
        <Link href="/partner-settlements">
          <Badge variant="outline" className="cursor-pointer px-3 py-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-400 ms-auto">
            📊 {t("Partner Settlements Report") || "تقرير تسويات الشركاء"}
          </Badge>
        </Link>
      </div>

      {/* City quick-filter badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/80 dark:border-slate-800">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 ps-1 pe-2 border-e border-slate-200 dark:border-slate-700">
          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
          {t("City") || "تصفية بالمدينة"}:
        </span>
        <Link href={buildFilterUrl({ cityId: null })}>
          <Badge
            variant={!resolvedSearchParams?.cityId ? "default" : "outline"}
            className="cursor-pointer px-3 py-1 text-xs"
          >
            🌍 {t("All Cities") || "كل المدن"}
          </Badge>
        </Link>
        {cities.map((city: any) => {
          const cityName =
            (typeof city.name === "object" ? (city.name.ar || city.name.en) : city.name) ||
            String(city.id);
          const isSelected = String(resolvedSearchParams?.cityId) === String(city.id);
          return (
            <Link key={city.id} href={buildFilterUrl({ cityId: String(city.id) })}>
              <Badge
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer px-3 py-1 text-xs transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                    : "bg-background hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground"
                }`}
              >
                📍 {cityName}
              </Badge>
            </Link>
          );
        })}
      </div>

      <StoresTable
        permission={permission}
        cardHeader={t("Stores")}
        extraParams={{ includeStats: true }}
        filters={[
          { name: "name", type: "text", width: 3 },
          {
            name: "cityId",
            type: "selectPaginated",
            apiUrl: ["cities"],
            label: t("City") || "المدينة",
            width: 3
          },
          {
            name: 'categoryId',
            type: 'selectPaginated',
            isMulti: true,
            apiUrl: ["categories"]
          },
          {
            name: "isPartner",
            type: "select",
            width: 3,
            label: t("Partner Status") || "نوع المتجر",
            options: [
              { label: t("Partner Stores") || "مطاعم شريكة فقط", value: "true" },
              { label: t("Non-Partner Stores") || "مطاعم غير شريكة", value: "false" }
            ]
          },
          {
            name: "isStoreAccepted",
            type: "select",
            width: 3,
            options: [
              { label: t("Approve"), value: "true" },
              { label: t("Pending Review"), value: "false" }
            ]
          },
          {
            name: "orderFilter",
            type: "select",
            width: 3,
            label: t("Order Filter"),
            options: [
              { label: t("Most Orders"), value: "MOST_ORDERS" },
              { label: t("Least Orders"), value: "LEAST_ORDERS" },
              { label: t("Zero Orders"), value: "ZERO_ORDERS" },
              { label: t("Most Cancelled"), value: "MOST_CANCELLED" },
              { label: t("Highest Revenue"), value: "MOST_REVENUE" }
            ]
          },
          {
            name: "zeroOrdersOnly",
            type: "select",
            width: 3,
            label: t("Zero Orders Only"),
            options: [
              { label: t("Yes"), value: "true" },
              { label: t("No"), value: "false" }
            ]
          }
        ]}
      />
    </>
  );
}
