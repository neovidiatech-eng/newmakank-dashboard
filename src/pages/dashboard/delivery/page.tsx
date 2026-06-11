
import { fetchHelper } from '@/api/fetch';
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import BasicTableHeader from "@/components/common/table/tableHelperComponents/BasicTableHeader";
import { TablePagination } from "@/components/common/table/tableHelperComponents/TablePagination";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import DeliveryCardsView from "@/components/pages/_delivery/DeliveryCardsView";
import { Card } from "@/components/ui/card";
import { getTranslations } from '@/lib/i18n';
// import GenerateStaticParams from '@/api/metadata';
import { PROJECT_NAME } from "@/utils/config";
import { booleanOptions } from '@/utils/options/booleanOptions';
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  // const permissions = await getPermissions();
  // const permission = permissions?.["deliveryAll"] ?? permissions?.["deliveryall"];
  const data = await fetchHelper({
    endPoint: ["delivery"],
    method: "GET",
    params: await searchParams,
  });

  if (!data) return <div>Error...</div>;

  const filteredData = data?.data ?? [];
  const filters: FormInput[] = [{ "name": "search", "type": "text", "width": 3 }, {
    name: 'isAvailable',
    type: 'select',
    options: booleanOptions(t),
  }];

  return (
    <>
      <CustomHeader />
      <Card className="p-0 overflow-hidden bg-white dark:bg-slate-950 border-gray-200/80 dark:border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-200/80 dark:border-gray-800">
          <BasicTableHeader
            headers={[
              { name: "name" },
              { name: "email" },
              { name: "phone" },
              { name: "isAvailable" },
              { name: "isOnShift" }
            ]}
            data={filteredData}
            cardHeader={t("Delivery")}
            filters={filters}
          />
        </div>
        <div className="p-6">
          <DeliveryCardsView deliveries={filteredData} />
        </div>
        {data?.total ? (
          <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-950 p-6">
            <TablePagination pagination={{ total: data.total }} />
          </div>
        ) : null}
      </Card>
    </>
  );
}

export default page;
