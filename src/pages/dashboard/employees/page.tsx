import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import EmployeesColumns from './EmployeesColumns';

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Employees"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["employees"]}
        columns={EmployeesColumns as any}
        hideCreateNew={!permission?.post}
        cardHeader={t("Employees")}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["employees"] : undefined,
        }}
        filters={[{ "name": "name", "type": "text", "width": 3 }]}
      />
    </>
  );
}
