import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import BanksColumns from './BanksColumns';

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["banks"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["banks"]}
        columns={BanksColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Banks")}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["banks"] : undefined,
          //onInfo: true,
        }}
        filters={[{ "name": "name", "type": "text", "width": 3 }]}
      />
    </>
  );
}
