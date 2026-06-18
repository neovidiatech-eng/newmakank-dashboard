import { fetchHelper } from "@/api/fetch";
import BasicTableHeader from "@/components/common/table/tableHelperComponents/BasicTableHeader";
import TableNoData from "@/components/common/table/tableHelperComponents/TableNoData";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import ScheduleGrid from "@/components/pages/_schedule/ScheduleGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/lib/navigation";
import { getTranslations } from "@/lib/i18n";

async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const searchParam = await searchParams;
  const storeId = searchParam.storeId as string | undefined;
  const branchId = searchParam.branchId as string | undefined;

  let data;
  if (branchId) {
    data = await fetchHelper({
      endPoint: ["schedule", Number(branchId)],
      method: "GET",
      params: await searchParams
    });
  } else {
    data = { data: [] };
  }

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("Working hours")}</CardTitle>
            {branchId && (
              <Link href={`/schedule/create?branchId=${branchId}`}>
                <Button variant="outline" size="sm">
                  {t("Create")}
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent className="space-y-4 p-0">
            <div className="px-6 pb-4">
              <BasicTableHeader
                headers={headers}
                data={filteredData}
                cardHeader={t("Working hours")}
                filters={[
                  {
                    name: "storeId",
                    type: "selectPaginated",
                    apiUrl: ["stores"]
                  },
                  {
                    name: "branchId",
                    type: "selectPaginated",
                    apiUrl: ["branches"],
                    labelFormat: "storeBranch",
                    searchFilters: storeId ? [{ key: "storeId", value: storeId }] : undefined,
                    disabled: !storeId
                  }
                ]}
              />
            </div>
            {branchId ? (
              <ScheduleGrid data={filteredData} branchId={branchId} />
            ) : (
              <TableNoData message="select branch to view data" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default page;
