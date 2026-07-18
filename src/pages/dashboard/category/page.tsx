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
        endPoint={["storeTemplatesCategories"]}
        columns={CategoryColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Category")}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["storeTemplatesCategories"] : undefined,
        }}
        filters={[
          { name: "name", type: "text", width: 3 },
          {
            name: "isCustomStoreCategory",
            type: "select",
            width: 3,
            options: [
              { label: t("All"), value: "" },
              { label: t("Template Category"), value: "false" },
              { label: t("Store Category"), value: "true" },
            ]
          }
        ]}
      />
    </>
  );
}
