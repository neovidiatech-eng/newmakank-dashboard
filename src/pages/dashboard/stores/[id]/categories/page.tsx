
import { fetchHelper } from '@/api/fetch';
import TableBasic from '@/components/common/table/TableBasic';
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { PROJECT_NAME } from "@/utils/config";
import { getTranslations } from '@/lib/i18n';
import CategoryColumns from '../../../category/CategoryColumns';
async function page({ searchParams, params }: { params: Params; searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  // const permissions = await getPermissions();
  // const permission = permissions?.["storeCategories"] ?? permissions?.["storecategories"];
  const data = await fetchHelper({
    endPoint: ["storeCategories", 'store', Number((await params).id)],
    method: "GET",
    params: await searchParams,
  });

  if (!data) return <div>Error...</div>;
  const filteredData = data?.data

  return (
    <>
      <CustomHeader >
        <></>
      </CustomHeader>
      <TableBasic
        data={filteredData}
        // hideCreateNew={!permission?.post}
        columns={CategoryColumns}
        pagination={{
          total: data?.total,
        }}
        tableActions={{
          onEdit: true,
          onDelete: ["categories"],
          //onInfo: true,
        }}
        cardHeader={t("Category")}
        filters={[{ "name": "name", "type": "text", "width": 3 }]}
      />
    </>
  );
}

export default page;
