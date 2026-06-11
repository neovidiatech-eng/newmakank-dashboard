
import { fetchHelper } from '@/api/fetch';
import getPermissions from '@/api/permissions';
import ModuleSelector from '@/components/common/selectors/ModuleSelector';
import TableBasic from '@/components/common/table/TableBasic';
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { PROJECT_NAME } from "@/utils/config";
import { getTranslations } from '@/lib/i18n';
import CategoryColumns from './CategoryColumns';
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Categories"] ?? permissions?.["categories"];
  const data = await fetchHelper({
    endPoint: ["categories"],
    method: "GET",
    params: await searchParams,
  });

  if (!data) return <div>Error...</div>;

  const filteredData = data?.data

  return (
    <>
      <CustomHeader >
        <ModuleSelector />
      </CustomHeader>
      <TableBasic
        data={filteredData}
        hideCreateNew={!permission?.post}
        columns={CategoryColumns}
        pagination={{
          total: data?.total,
        }}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["categories"] : undefined,
          //onInfo: true,
        }}
        cardHeader={t("Category")}
        filters={[{ "name": "name", "type": "text", "width": 3 }]}
      />
    </>
  );
}

export default page;
