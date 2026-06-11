import { fetchHelper } from "@/api/fetch";
import TableBasic from "@/components/common/table/TableBasic";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from "@/lib/i18n";
import VariationTemplateColumns from "./VariationTemplateColumns";
// import GenerateStaticParams from '@/api/metadata';
import { PROJECT_NAME } from "@/utils/config";
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const data = await fetchHelper({
    endPoint: ["variationTemplate"],
    method: "GET",
    params: await searchParams
  });

  if (!data) return <div>Error...</div>;

  const filteredData = data?.data;
  console.log(data, 'datasda')
  return (
    <>
      <CustomHeader />
      <TableBasic
        data={filteredData}
        columns={VariationTemplateColumns}
        pagination={{
          total: data?.total
        }}
        tableActions={{
          onEdit: false,
          onDelete: ["variationTemplate"]
          //onInfo: true,
        }}
        cardHeader={t("VariationTemplate")}
      // filters={[{ name: "name", type: "text", width: 3 }]}
      />
    </>
  );
}

export default page;
