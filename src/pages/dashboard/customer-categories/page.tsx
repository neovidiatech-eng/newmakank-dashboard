import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import CustomerCategoriesColumns from './CustomerCategoriesColumns';

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["customer-categories"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["customerCategories"]}
        columns={CustomerCategoriesColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("customerCategories")}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["customerCategories"] : undefined,
        }}
        filters={[{ "name": "name", "type": "text", "width": 3 }]}
      />
    </>
  );
}
