import TableBasic from "@/components/common/table/TableBasic";
import OnlineDeliveryColumns from "./OnlineDeliveryColumns";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useSearchParams } from "@/lib/navigation";
import { useTranslations } from "@/lib/i18n";

interface OnlineDeliveryTableProps {
  permission?: Auth.PermissionsType;
}

export default function OnlineDeliveryTable({ permission }: OnlineDeliveryTableProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();

  // Send `kind` to the server like any other filter instead of fetching everything and
  // filtering client-side — the previous approach fetched a page of ALL orders, then threw
  // away every row that wasn't an online-delivery order, so `total`/pagination never matched
  // what was actually displayed. Deliberately not sending `type=CUSTOM_DELIVERY` — matches
  // the same convention OrdersViewTabs uses (verified against the live API), where `kind`
  // alone is enough to scope to custom-delivery orders of that kind.
  const params: Record<string, unknown> = { kind: "ONLINE" };
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const { data: response } = useApiQuery({
    queryKey: ["online-delivery-orders", JSON.stringify(params)],
    endPoint: ["onlineDelivery"],
    params,
    staleTime: 0
  });

  const data: any[] = Array.isArray(response?.data) ? response.data : [];
  const total = response?.total ?? data.length;

  return (
    <TableBasic
      data={data}
      columns={OnlineDeliveryColumns}
      pagination={{ total }}
      tableActions={{
        onInfo: "/orders"
      }}
      hideCreateNew
      cardHeader={t("Online Delivery Orders")}
      filters={[
        {
          name: "status",
          type: "select",
          options: [
            { label: t("PENDING"), value: "PENDING" },
            { label: t("PREPARING"), value: "PREPARING" },
            { label: t("READY_PICKUP"), value: "READY_PICKUP" },
            { label: t("ON_THE_WAY"), value: "ON_THE_WAY" },
            { label: t("DELIVERED"), value: "DELIVERED" },
            { label: t("CANCELLED"), value: "CANCELLED" },
            { label: t("REJECTED"), value: "REJECTED" },
            { label: t("PAYMENT_FAILD"), value: "PAYMENT_FAILD" },
            { label: t("PENDING_PAYMENT"), value: "PENDING_PAYMENT" }
          ],
          width: 3
        },
        { name: "fromDate", type: "date", width: 3 },
        { name: "toDate", type: "date", width: 3 }
      ]}
    />
  );
}
