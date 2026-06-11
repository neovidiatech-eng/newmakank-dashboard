import { fetchData } from "@/api/global/fetchData";
import CategoryDetailsPage from "@/components/pages/_categories/CategoryDetailsPage";
import { notFound } from "@/lib/navigation";

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Params;
  searchParams: SearchParams;
}): Promise<JSX.Element> {
  const { id } = await params;
  const categoryId = Number(id);

  const [categoryData, storesData, servicesData] = await Promise.all([
    fetchData(["categories", categoryId]),
    fetchData(["stores"], {
      ...(await searchParams),
      categoryId
    }),
    fetchData(["services"], {
      ...(await searchParams),
      categoryId
    })
  ]);

  if (!categoryData?.data) {
    return notFound();
  }

  return (
    <CategoryDetailsPage
      category={categoryData.data}
      stores={storesData}
      services={servicesData}
    />
  );
}
