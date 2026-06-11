import { fetchHelper } from "@/api/fetch";
import getPermissions from "@/api/permissions";
import TableBasic from "@/components/common/table/TableBasic";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from "@/lib/i18n";
import CustomersColumns from "./CustomersColumns";
// import GenerateStaticParams from '@/api/metadata';
import { PROJECT_NAME } from "@/utils/config";
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Customers"] ?? permissions?.["customers"];
  const data = await fetchHelper({
    endPoint: ["customers"],
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
        hideCreateNew={!permission?.post}
        columns={CustomersColumns}
        pagination={{
          total: data?.total
        }}
        tableActions={{
          onEdit: false,
          onInfo: true,
          onDelete: permission?.delete ? ["customers"] : undefined
        }}
        cardHeader={t("Customers")}
        filters={[{ name: "name", type: "text", width: 3 }]}
      />
    </>
  );
}

export default page;
