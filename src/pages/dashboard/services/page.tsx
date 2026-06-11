import { fetchHelper } from "@/api/fetch";
import getPermissions from "@/api/permissions";
import TableBasic from "@/components/common/table/TableBasic";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from "@/lib/i18n";
import ServicesColumns from "./ServicesColumns";
// import GenerateStaticParams from '@/api/metadata';
import ModuleSelector from "@/components/common/selectors/ModuleSelector";
import { PROJECT_NAME } from "@/utils/config";
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Service"] ?? permissions?.["service"];
  const data = await fetchHelper({
    endPoint: ["services"],
    method: "GET",
    params: await searchParams
  });

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
        columns={ServicesColumns}
        pagination={{
          total: data?.total
        }}
        tableActions={{
          onEdit: permission?.put || permission?.patch,
          onDelete: permission?.delete ? ["services"] : undefined,
          onInfo: true,
          fixedActions: true
        }}
        cardHeader={t("Services")}
        filters={[
          { name: "name", type: "text", width: 3 },
          {
            name: "storeId",
            type: "selectPaginated",
            width: 3,
            apiUrl: ["stores"]
          },
          {
            name: "categoryId",
            type: "selectPaginated",
            width: 3,
            apiUrl: ["categories"]
          }
        ]}
      />
    </>
  );
}

export default page;
