import { fetchData } from "@/api/global/fetchData";
import StoreDetailsPage from "@/components/pages/_stores/StoreDetailsPage";
import { notFound } from "@/lib/navigation";

const emptyListResponse: ApiResponse<any[]> = {
  data: [],
  success: true,
  message: "",
  total: 0
};

async function page({
  params,
  searchParams
}: {
  params: Params;
  searchParams: SearchParams;
}): Promise<JSX.Element> {
  const { id } = await params;
  const storeId = Number(id);

  const [data, branchesData, categoriesData, ordersData, servicesData, appliedTemplatesData] = await Promise.all([
    fetchData(["stores", storeId]),
    fetchData(["branches"], {
      ...(await searchParams),
      storeId
    }),
    fetchData(["storeCategories", "store", storeId], {
      ...(await searchParams)
    }),
    fetchData(["orders"], {
      ...(await searchParams),
      storeId
    }),
    fetchData(["services"], {
      ...(await searchParams),
      storeId
    }),
    fetchData(["stores", storeId, "appliedTemplates"], {
      ...(await searchParams)
    })
  ]);
  
  if (!data?.data) {
    return notFound();
  }
  
  return (
    <StoreDetailsPage
      data={data.data}
      branches={branchesData || emptyListResponse}
      categories={categoriesData || emptyListResponse}
      orders={ordersData || emptyListResponse}
      services={servicesData || emptyListResponse}
      appliedTemplates={appliedTemplatesData || emptyListResponse}
    />
  );
}

export default page;
