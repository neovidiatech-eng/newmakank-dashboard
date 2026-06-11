
import { fetchHelper } from '@/api/fetch';
import getPermissions from '@/api/permissions';
import TableBasic from '@/components/common/table/TableBasic';
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from '@/lib/i18n';
import BranchesColumns from './BranchesColumns';
// import GenerateStaticParams from '@/api/metadata';
import { PROJECT_NAME } from "@/utils/config";
import BranchesExpandedRow from './BranchesExpandedRow';
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Stores"] ?? permissions?.["stores"];
  const data = await fetchHelper({
    endPoint: ["branches"],
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
        columns={BranchesColumns}
        pagination={{
          total: data?.total,
        }}
        expandable={{
          ExpandedRowComponent: BranchesExpandedRow,
        }}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["branches"] : undefined,
          onInfo: true,
          fixedActions: true,
        }}
        cardHeader={t("Branches")}
        filters={[{ "name": "name", "type": "text", "width": 3 }]}
      />
    </>
  );
}

export default page;
