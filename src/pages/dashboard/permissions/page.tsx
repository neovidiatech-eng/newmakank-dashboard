import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import PermissionsColumns from "./PermissionsColumns";

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Permissions"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["permissions"]}
        columns={PermissionsColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Permissions")}
        tableActions={{
          onEdit: permission?.put || permission?.patch
          // onDelete: ["permissions"],
          //onInfo: true,
        }}
        
      />
    </>
  );
}
