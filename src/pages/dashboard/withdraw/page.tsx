import { fetchHelper } from "@/api/fetch";
import getPermissions from "@/api/permissions";
import TableBasic from "@/components/common/table/TableBasic";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from "@/lib/i18n";
import WithdrawColumns from "./WithdrawColumns";
// import GenerateStaticParams from '@/api/metadata';
import { PROJECT_NAME } from "@/utils/config";
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["withdraw"] ?? permissions?.["withdraw"];
  const data = await fetchHelper({
    endPoint: ["withdraw"],
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
        columns={WithdrawColumns}
        pagination={{
          total: data?.total
        }}
        hideCreateNew={!permission?.post}
        cardHeader={t("Withdraw")}
        filters={[
          {
            name: "storeId",
            type: "selectPaginated",
            apiUrl: ["stores"]
          },
          {
            name: "branchId",
            type: "selectPaginated",
            apiUrl: ["branches"]
          }
        ]}
      />
    </>
  );
}

export default page;
