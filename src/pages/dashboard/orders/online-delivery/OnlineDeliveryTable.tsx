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

  const params: Record<string, unknown> = {};
  searchParams.forEach((value, key) => {
    if (key !== "type") {
      params[key] = value;
    }
  });

  const { data: response } = useApiQuery({
    queryKey: ["online-delivery-orders", JSON.stringify(params)],
    endPoint: ["onlineDelivery"],
    params,
    staleTime: 0
  });

  const rawData: any[] = Array.isArray(response?.data) ? response.data : [];
  const data = rawData.filter(
    (item: any) =>
      item.type === "CUSTOM_DELIVERY" && item.customDeliveryKind === "ONLINE"
  );
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
