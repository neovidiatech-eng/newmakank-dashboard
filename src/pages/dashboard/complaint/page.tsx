import { fetchHelper } from "@/api/fetch";
import getPermissions from "@/api/permissions";
import TableBasic from "@/components/common/table/TableBasic";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from "@/lib/i18n";
import ComplaintColumns from "./ComplaintColumns";
// import GenerateStaticParams from '@/api/metadata';
import { PROJECT_NAME } from "@/utils/config";
import { ComplaintTypeOptions } from "@/utils/options/typesOptions";
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Complaints"] ?? permissions?.["complaints"];
  const data = await fetchHelper({
    endPoint: ["complaint"],
    method: "GET",
    params: await searchParams
  });

  if (!data) return <div>Error...</div>;

  const filteredData = data?.data;

  return (
    <>
      <CustomHeader />
      <TableBasic
        data={filteredData}
        // hideCreateNew={!permission?.post}
        hideCreateNew={true}
        columns={ComplaintColumns}
        pagination={{
          total: data?.total
        }}
        tableActions={{
          // onEdit: permission?.put || permission?.patch,
          onInfo: true,
          onDelete: permission?.delete ? ["complaint"] : undefined
        }}
        cardHeader={t("Complaint")}
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

export default page;
