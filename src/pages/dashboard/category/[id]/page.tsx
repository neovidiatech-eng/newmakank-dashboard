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

  // Fetch all templates categories and filter the selected one locally in frontend
  const [allCategoriesData, storesData, servicesData] = await Promise.all([
    fetchData(["storeTemplatesCategories"]),
    fetchData(["stores"], {
      ...(await searchParams),
      categoryId
    }),
    fetchData(["services"], {
      ...(await searchParams),
      categoryId
    })
  ]);

  const categoryItem = allCategoriesData?.data?.find((cat: any) => cat.id === categoryId);

  if (!categoryItem) {
    return notFound();
  }

  return (
    <CategoryDetailsPage
      category={categoryItem}
      stores={storesData}
      services={servicesData}
    />
  );
}
