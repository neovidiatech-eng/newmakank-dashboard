import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import { Link } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import StoresTable from "@/components/pages/_stores/StoresTable";

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Stores"];
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <CustomHeader />
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Link href="/stores">
          <Badge variant={!resolvedSearchParams?.isStoreAccepted && !resolvedSearchParams?.isPartner ? "default" : "outline"} className="cursor-pointer px-3 py-1.5">
            {t("Stores") || "جميع المتاجر"}
          </Badge>
        </Link>
        <Link href="/stores?isPartner=true">
          <Badge variant={resolvedSearchParams?.isPartner === "true" ? "default" : "outline"} className="cursor-pointer px-3 py-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-400">
            🤝 {t("Partner Stores") || "المطاعم الشريكة"}
          </Badge>
        </Link>
        <Link href="/stores?isStoreAccepted=false">
          <Badge variant={resolvedSearchParams?.isStoreAccepted === "false" ? "default" : "outline"} className="cursor-pointer px-3 py-1.5">
            {t("Pending Review") || "قيد المراجعة"}
          </Badge>
        </Link>
        <Link href="/partner-settlements">
          <Badge variant="outline" className="cursor-pointer px-3 py-1.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-400 ms-auto">
            📊 {t("Partner Settlements Report") || "تقرير تسويات الشركاء"}
          </Badge>
        </Link>
      </div>
      <StoresTable
        permission={permission}
        cardHeader={t("Stores")}
        extraParams={{ includeStats: true }}
        filters={[
          { name: "name", type: "text", width: 3 },
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
