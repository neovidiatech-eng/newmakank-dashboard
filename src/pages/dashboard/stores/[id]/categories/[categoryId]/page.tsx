import { fetchData } from "@/api/global/fetchData";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import CategoryServicesView from "@/components/pages/_stores/details/CategoryServicesView";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { MoveLeft } from "lucide-react";
import { notFound } from "@/lib/navigation";

async function CategoryServicesPage({
  params,
  searchParams
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id: storeId, categoryId } = await params;
  const sParams = await searchParams;

  const [categoryData, servicesData] = await Promise.all([
    fetchData(["storeCategories", Number(categoryId)]),
    fetchData(["services"], {
      ...sParams,
      storeId: Number(storeId),
      subCategoryId: Number(categoryId)
    })
  ]);
  if (!categoryData?.data) {
    return notFound();
  }
  const getName = (obj: { en: string; ar: string } | undefined) => {
    return obj?.en || obj?.ar || "N/A";
  };
  return (
    <>
      <CustomHeader></CustomHeader>
      <div className="flex items-center gap-4">
        <Link href={`/stores/${storeId}`}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10 transition-colors"
          >
            <MoveLeft className="w-5 h-5 text-primary" />
          </Button>
        </Link>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {getName(categoryData?.data?.name)}
          </h1>
        </div>
      </div>
      <CategoryServicesView
        storeId={storeId}
        category={categoryData.data}
        services={servicesData || { data: [], total: 0 }}
      />
    </>
  );
}

export default CategoryServicesPage;
