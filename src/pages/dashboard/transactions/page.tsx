import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import TransactionsColumns from "./TransactionsColumns";

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["transactions"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["transactions"]}
        columns={TransactionsColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Transactions")}
        
        filters={[]}
      />
    </>
  );
}
