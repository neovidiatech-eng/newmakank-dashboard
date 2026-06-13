import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import BranchesColumns from './BranchesColumns';

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Stores"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["branches"]}
        columns={BranchesColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Branches")}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["branches"] : undefined,
          onInfo: true,
          fixedActions: true,
        }}
        filters={[{ "name": "name", "type": "text", "width": 3 }]}
      />
    </>
  );
}
