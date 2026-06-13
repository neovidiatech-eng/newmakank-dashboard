import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import StoresColumns from "./StoresColumns";

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Stores"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["stores"]}
        columns={StoresColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Stores")}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["stores"] : undefined,
          onInfo: true,
          fixedActions: true,
        }}
        filters={[{ name: "name", type: "text", width: 3 }, {
          name: 'categoryId',
          type: 'selectPaginated',
          isMulti: true,
          apiUrl: ["categories"]
        },
        ]}
      />
    </>
  );
}
