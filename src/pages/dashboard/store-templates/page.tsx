import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import StoreTemplatesColumns from "@/pages/dashboard/store-templates/StoreTemplatesColumns";

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["store-templates"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["storeTemplates"]}
        columns={StoreTemplatesColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("storeTemplates")}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["storeTemplates"] : undefined,
        }}
        filters={[
          { "name": "name", "type": "text", "width": 4 }
        ]}
      />
    </>
  );
}
