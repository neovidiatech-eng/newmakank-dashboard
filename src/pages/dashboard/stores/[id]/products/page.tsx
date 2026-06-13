import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import ServicesColumns from "@/pages/dashboard/services/ServicesColumns";

export default async function page({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Service"];
  const { id } = await params;

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["services", "store", Number(id)]}
        columns={ServicesColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Services")}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["services"] : undefined,
          onInfo: '/services'
        }}
        filters={[{ name: "name", type: "text", width: 3 }]}
      />
    </>
  );
}
