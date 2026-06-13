import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import CitiesColumns from './CitiesColumns';

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Cities"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["cities"]}
        columns={CitiesColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Cities")}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["cities"] : undefined,
          //onInfo: true,
        }}
        filters={[{ name: "name", type: "text", width: 3 }]}
      />
    </>
  );
}
