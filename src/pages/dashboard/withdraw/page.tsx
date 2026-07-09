import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import WithdrawColumns from "./WithdrawColumns";

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["withdraw"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["withdraw"]}
        columns={WithdrawColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Withdraw")}
        
        filters={[
          {
            name: "storeId",
            type: "selectPaginated",
            apiUrl: ["stores"]
          },
          {
            name: "branchId",
            type: "selectPaginated",
            apiUrl: ["branches"]
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
