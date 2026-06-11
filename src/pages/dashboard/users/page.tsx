
import { fetchHelper } from '@/api/fetch';
import TableBasic from '@/components/common/table/TableBasic';
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from '@/lib/i18n';
import UsersColumns from './UsersColumns';
// import GenerateStaticParams from '@/api/metadata';
import { PROJECT_NAME } from "@/utils/config";
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const data = await fetchHelper({
    endPoint: ["users"],
    method: "GET",
    params: await searchParams,
  });
  console.log(data.data[0], 'sda2eads');
  if (!data) return <div>Error...</div>;

  const filteredData = data?.data

  return (
    <>
      <CustomHeader />
      <TableBasic
        data={filteredData}
        columns={UsersColumns as any}
        pagination={{
          total: data?.total,
        }}
        tableActions={{
          onEdit: true,
          onDelete: ["users"],
          //onInfo: true,
        }}
        cardHeader={t("Users")}
        filters={[{ "name": "name", "type": "text", "width": 3 }]}
      />
    </>
  );
}

export default page;
