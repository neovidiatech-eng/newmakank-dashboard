import CustomHeader from "@/components/layouts/header/CustomHeader";
import TableWithQuery from "@/components/common/table/TableWithQuery";
import getPermissions from "@/api/permissions";
import { getTranslations } from "@/lib/i18n";
import ComplaintColumns from "./ComplaintColumns";
import { ComplaintTypeOptions } from "@/utils/options/typesOptions";

export default async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Complaints"];

  return (
    <>
      <CustomHeader />
      <TableWithQuery
        endPoint={["complaint"]}
        columns={ComplaintColumns}
        hideCreateNew={!permission?.post}
        cardHeader={t("Complaint")}
        tableActions={{
          // onEdit: permission?.put || permission?.patch,
          onInfo: true,
          onDelete: permission?.delete ? ["complaint"] : undefined
        }}
        filters={[
          {
            name: "userId",
            type: "selectPaginated",
            apiUrl: ["users"]
          },
          {
            name: "status",
            type: "radioGroup",
            options: ComplaintTypeOptions(t)
          }
        ]}
      />
    </>
  );
}
