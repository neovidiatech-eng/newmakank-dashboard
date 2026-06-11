import { fetchHelper } from "@/api/fetch";
import getPermissions from "@/api/permissions";
import TableBasic from "@/components/common/table/TableBasic";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from "@/lib/i18n";
import StoresColumns from "./StoresColumns";
// import GenerateStaticParams from '@/api/metadata';
import ModuleSelector from "@/components/common/selectors/ModuleSelector";
import { PROJECT_NAME } from "@/utils/config";
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Stores"] ?? permissions?.["stores"];
  const data = await fetchHelper({
    endPoint: ["stores"],
    method: "GET",
    params: await searchParams
  });
  console.log(data, 'dase22dsa');
  if (!data) return <div>Error...</div>;
  const filteredData = data?.data;
  return (
    <>
      <CustomHeader>
        <ModuleSelector />
      </CustomHeader>{" "}
      <TableBasic
        data={filteredData}
        hideCreateNew={!permission?.post}
        columns={StoresColumns}
        pagination={{
          total: data?.total
        }}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["stores"] : undefined,
          onInfo: true,
          fixedActions: true,
        }}
        cardHeader={t("Stores")}
        filters={[{ name: "name", type: "text", width: 3 }, {
          name: 'categoryId',
          type: 'selectPaginated',
          isMulti: true,
          apiUrl: ["categories"]
        },
        ]}
      />
    </>
  );
}

export default page;
