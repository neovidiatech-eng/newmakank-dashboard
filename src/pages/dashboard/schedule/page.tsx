import { fetchHelper } from "@/api/fetch";
import BasicTableHeader from "@/components/common/table/tableHelperComponents/BasicTableHeader";
import TableNoData from "@/components/common/table/tableHelperComponents/TableNoData";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import ScheduleGrid from "@/components/pages/_schedule/ScheduleGrid";
import { PROJECT_NAME } from "@/utils/config";
import { getTranslations } from "@/lib/i18n";

async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const searchParam = await searchParams;
  const branchId = searchParam.branchId as string | undefined;

  const data = await fetchHelper({
    endPoint: ["schedule", ...(branchId ? [Number(branchId)] : [])],
    method: "GET",
    params: await searchParams
  });

  if (!data) return <div>{t("Error")}...</div>;
  const filteredData = (data?.data || []) as any[];
  const headers = [
    { name: "id" },
    { name: "day" },
    { name: "openingTime" },
    { name: "closingTime" }
  ];

  return (
    <div className="flex flex-col gap-4">
      <CustomHeader />
      <div className="p-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200/80 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200/80 dark:border-gray-800">
            <BasicTableHeader
              headers={headers}
              data={filteredData}
              cardHeader={t("Schedule")}
              filters={[
                {
                  name: "branchId",
                  type: "selectPaginated",
                  apiUrl: ["branches"],
                  labelFormat: "storeBranch"
                }
              ]}
            />
          </div>
          {branchId ? (
            <ScheduleGrid data={filteredData} branchId={branchId} />
          ) : (
            <TableNoData message="select branch to view data" />
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
