import { fetchHelper } from "@/api/fetch";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import ArchivedOrdersView from "./ArchivedOrdersView";
import { getTranslations } from "@/lib/i18n";
import ModuleSelector from "@/components/common/selectors/ModuleSelector";
import { PROJECT_NAME } from "@/utils/config";
import { Suspense } from "react";

async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const data = await fetchHelper({
    endPoint: ["ordersArchived"],
    method: "GET",
    params: await searchParams
  });

  if (!data) return <div>Error...</div>;

  const filteredData = data?.data;
  return (
    <>
      <CustomHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
          <Suspense fallback={null}>
            <ModuleSelector />
          </Suspense>
        </div>
      </CustomHeader>
      <ArchivedOrdersView orders={filteredData} total={data?.total} tableTitle={t("Archived Orders")} />
    </>
  );
}

export default page;
