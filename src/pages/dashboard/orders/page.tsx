import { fetchHelper } from "@/api/fetch";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import OrdersViewTabs from "@/components/pages/_orders/OrdersViewTabs";
import { getTranslations } from "@/lib/i18n";
// import GenerateStaticParams from '@/api/metadata';
import CategoryFilter from "@/components/common/category/CategoryFilter";
import ModuleSelector from "@/components/common/selectors/ModuleSelector";
import { PROJECT_NAME } from "@/utils/config";
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const data = await fetchHelper({
    endPoint: ["orders"],
    method: "GET",
    params: await searchParams
  });

  if (!data) return <div>Error...</div>;

  const filteredData = data?.data;
  return (
    <>
      <CustomHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          <ModuleSelector />
        </div>
      </CustomHeader>
      <CategoryFilter className="flex-1 flex-wrap" />
      <OrdersViewTabs orders={filteredData} total={data?.total} tableTitle={t("Orders")} />
    </>
  );
}

export default page;
