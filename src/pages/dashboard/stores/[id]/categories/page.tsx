import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import CategoryColumns from "@/pages/dashboard/category/CategoryColumns";

export default async function page({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["storeCategories"];
  const { id } = await params;

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["storeCategories", "store", Number(id)]}
        columns={CategoryColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Category")}
        tableActions={{
          onEdit: true,
          onDelete: ["categories"],
        }}
        filters={[{ name: "name", type: "text", width: 3 }]}
      />
    </>
  );
}
