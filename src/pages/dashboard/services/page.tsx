import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import ServicesColumns from "./ServicesColumns";

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Service"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["services"]}
        columns={ServicesColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Services")}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["services"] : undefined,
          onInfo: true,
          fixedActions: true
        }}
        filters={[
          { name: "name", type: "text", width: 3 },
          {
            name: "storeId",
            type: "selectPaginated",
            width: 3,
            apiUrl: ["stores"]
          },
          {
            name: "categoryId",
            type: "selectPaginated",
            width: 3,
            apiUrl: ["categories"]
          }
        ]}
      />
    </>
  );
}
