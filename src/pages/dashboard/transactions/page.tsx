import { fetchHelper } from "@/api/fetch";
import getPermissions from "@/api/permissions";
import TableBasic from "@/components/common/table/TableBasic";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from "@/lib/i18n";
import TransactionsColumns from "./TransactionsColumns";
// import GenerateStaticParams from '@/api/metadata';
import { PROJECT_NAME } from "@/utils/config";
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["transactions"] ?? permissions?.["transactions"];
  const data = await fetchHelper({
    endPoint: ["transactions"],
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
        columns={TransactionsColumns}
        pagination={{
          total: data?.total
        }}
        hideCreateNew={!permission?.post}
        cardHeader={t("Transactions")}
        filters={[]}
      />
    </>
  );
}

export default page;
