import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import BankAccountsColumns from './BankAccountsColumns';

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["bankAccounts"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["bankAccounts"]}
        columns={BankAccountsColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("BankAccounts")}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["bankAccounts"] : undefined,
          //onInfo: true,
        }}
        filters={[]}
      />
    </>
  );
}
