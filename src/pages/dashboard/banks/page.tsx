
import { fetchHelper } from '@/api/fetch';
import getPermissions from '@/api/permissions';
import TableBasic from '@/components/common/table/TableBasic';
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from '@/lib/i18n';
import BanksColumns from './BanksColumns';
// import GenerateStaticParams from '@/api/metadata';
import { PROJECT_NAME } from "@/utils/config";
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["banks"] ?? permissions?.["banks"];
  const data = await fetchHelper({
    endPoint: ["banks"],
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
        columns={BanksColumns}
        pagination={{
          total: data?.total,
        }}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["banks"] : undefined,
          //onInfo: true,
        }}
        cardHeader={t("Banks")}
        filters={[{ "name": "name", "type": "text", "width": 3 }]}
      />
    </>
  );
}

export default page;
