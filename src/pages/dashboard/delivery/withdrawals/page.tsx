import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import { getTranslations } from "@/lib/i18n";
import DeliveryWithdrawalsColumns from "./DeliveryWithdrawalsColumns";

export default async function page(): Promise<JSX.Element> {
  const t = await getTranslations();

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["deliveryWithdrawals"]}
        columns={DeliveryWithdrawalsColumns}
        hideCreateNew
        cardHeader={t("Driver Withdrawals")}
        filters={[
          {
            name: "deliveryId",
            type: "selectPaginated",
            apiUrl: ["delivery"]
          },
          {
            name: "status",
            type: "select",
            options: [
              { label: t("PENDING"), value: "PENDING" },
              { label: t("APPROVED"), value: "APPROVED" },
              { label: t("DENIED"), value: "DENIED" }
            ]
          },
          {
            name: "fromDate",
            type: "date"
          },
          {
            name: "toDate",
            type: "date"
          }
        ]}
      />
    </>
  );
}
