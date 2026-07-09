import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import { getTranslations } from "@/lib/i18n";
import CashSettlementsColumns from "./CashSettlementsColumns";
import CreateCashSettlementDialog from "./CreateCashSettlementDialog";

export default async function page(): Promise<JSX.Element> {
  const t = await getTranslations();

  return (
    <>
      <CustomHeader />
      <div className="flex justify-end mb-4">
        <CreateCashSettlementDialog />
      </div>
      <TableWithQuery
        endPoint={["deliveryCashSettlements"]}
        columns={CashSettlementsColumns}
        hideCreateNew
        cardHeader={t("Cash Settlements")}
        filters={[
          {
            name: "deliveryId",
            type: "selectPaginated",
            apiUrl: ["delivery"]
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
