import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import CategoryColumns from './CategoryColumns';

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Categories"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["categories"]}
        columns={CategoryColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Category")}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["categories"] : undefined,
          //onInfo: true,
        }}
        filters={[{ "name": "name", "type": "text", "width": 3 }]}
      />
    </>
  );
}
