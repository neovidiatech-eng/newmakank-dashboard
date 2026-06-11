
import { fetchHelper } from '@/api/fetch';
import getPermissions from '@/api/permissions';
import TableBasic from '@/components/common/table/TableBasic';
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from '@/lib/i18n';
import RolesColumns from './RolesColumns';
// import GenerateStaticParams from '@/api/metadata';
import { PROJECT_NAME } from "@/utils/config";
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Roles"] ?? permissions?.["roles"];
  const data = await fetchHelper({
    endPoint: ["roles"],
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
        columns={RolesColumns}
        pagination={{
          total: data?.total,
        }}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["role"] : undefined,
          //onInfo: true,
        }}
        cardHeader={t("Roles")}
        filters={[]}
      />
    </>
  );
}

export default page;
