import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import ModulesColumns from "./ModulesColumns";

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Modules"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["modules"]}
        columns={ModulesColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("modules")}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["modules"] : undefined,
          //onInfo: true,
        }}
        filters={[{ name: "name", type: "text", width: 3 }]}
      />
    </>
  );
}
