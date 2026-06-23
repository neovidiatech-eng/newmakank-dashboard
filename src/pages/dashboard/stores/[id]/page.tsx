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
  const resolvedParams = await params;
  const storeId = Number(resolvedParams.id);
  const resolvedSearchParams = await searchParams;
  const activeTab = resolvedSearchParams.tab || "products";
  
  // Remove tab from the parameters sent to the API
  const { tab, ...apiSearchParams } = resolvedSearchParams;

  const [data, branchesData, categoriesData, ordersData, servicesData, appliedTemplatesData] = await Promise.all([
    fetchData(["stores", storeId]),
    activeTab === "branches" ? fetchData(["branches"], {
      ...apiSearchParams,
      storeId
    }) : Promise.resolve(null),
    activeTab === "categories" ? fetchData(["storeCategories"], {
      ...apiSearchParams,
      storeId
    }) : Promise.resolve(null),
    activeTab === "orders" ? fetchData(["orders"], {
      ...apiSearchParams,
      storeId
    }) : Promise.resolve(null),
    activeTab === "products" ? fetchData(["services"], {
      ...apiSearchParams,
      storeId
    }) : Promise.resolve(null),
    activeTab === "appliedTemplates" ? fetchData(["stores", storeId, "appliedTemplates"], {
      ...apiSearchParams
    }) : Promise.resolve(null)
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
