
import { fetchHelper } from '@/api/fetch';
import CustomTabs, { TabItem } from "@/components/common/CustomTabs/custom-tab";
import TableBasic from "@/components/common/table/TableBasic";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from '@/lib/i18n';
// import GenerateStaticParams from '@/api/metadata';
import { PROJECT_NAME } from "@/utils/config";
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const data = await fetchHelper({
    endPoint: ["rating"],
    params: await searchParams,
  });

  if (!data) return <div>{t("Error")}...</div>;

  const payload = data?.data || {};
  const storeRatings = Array.isArray(payload?.storeRatings) ? payload.storeRatings : [];
  const deliveryRatings = Array.isArray(payload?.deliveryRatings) ? payload.deliveryRatings : [];

  const RatingColumns = [
    { accessorKey: "id", header: "Id" },
    { accessorKey: "orderId", header: "OrderId" },
    { 
      accessorKey: "userId", 
      header: "User",
      cell: ({ row, getValue }: any) => {
        const user = row.original.user || row.original.Customer || row.original.customer;
        const name = user?.name || user?.firstName || user?.username;
        return <span>{name || getValue() || "-"}</span>;
      }
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ getValue }: any) => <span className="text-yellow-500">★ {getValue()}</span>
    },
    {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ getValue }: any) => <div className="truncate max-w-[260px]">{getValue() ?? "-"}</div>
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ getValue }: any) => <span>{new Date(getValue()).toLocaleDateString()}</span>
    }
  ];

  const tabs: TabItem[] = [
    {
      value: "storeRatings",
      label: t("Store Ratings"),
      content: (
        <>
          <TableBasic
            data={storeRatings}
            columns={RatingColumns}
            pagination={{ total: storeRatings.length }}
            tableActions={{}}
            cardHeader={t("Store Ratings")}
            filters={[{ name: "orderId", type: "text", width: 3 }]}
          />
        </>
      )
    },
    {
      value: "deliveryRatings",
      label: t("Delivery Ratings"),
      content: (
        <>
          <TableBasic
            data={deliveryRatings}
            columns={RatingColumns}
            pagination={{ total: deliveryRatings.length }}
            tableActions={{}}
            cardHeader={t("Delivery Ratings")}
            filters={[{ name: "orderId", type: "text", width: 3 }]}
          />
        </>
      )
    }
  ];

  return (
    <>
      <CustomHeader />
      <div className="p-6">
        <CustomTabs tabs={tabs} clearSearchParams />
      </div>
    </>
  );
}

export default page;
