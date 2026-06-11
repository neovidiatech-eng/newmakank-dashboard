
import { fetchHelper } from '@/api/fetch';
import getPermissions from '@/api/permissions';
import TableBasic from '@/components/common/table/TableBasic';
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from '@/lib/i18n';
import ModulesColumns from "./ModulesColumns";
// import GenerateStaticParams from '@/api/metadata';
import { PROJECT_NAME } from "@/utils/config";
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Modules"] ?? permissions?.["modules"];
  const data = await fetchHelper({
    endPoint: ["modules"],
    method: "GET",
    params: await searchParams,
  });

  if (!data) return <div>Error...</div>;

  const filteredData = data?.data
  return (
    <>
      <CustomHeader />
      <TableBasic
        data={filteredData}
        hideCreateNew={!permission?.post}
        columns={ModulesColumns}
        pagination={{
          total: data?.total,
        }}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["modules"] : undefined,
          //onInfo: true,
        }}
        cardHeader={t("modules")}
        filters={[{ name: "name", type: "text", width: 3 }]}
      />
    </>
  );
}

export default page;
