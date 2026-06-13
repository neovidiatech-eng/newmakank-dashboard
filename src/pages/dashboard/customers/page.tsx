import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import CustomersColumns from "./CustomersColumns";

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Customers"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["customers"]}
        columns={CustomersColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Customers")}
        tableActions={{
          onEdit: false,
          onInfo: true,
          onDelete: permission?.delete ? ["customers"] : undefined
        }}
        filters={[{ name: "name", type: "text", width: 3 }]}
      />
    </>
  );
}
