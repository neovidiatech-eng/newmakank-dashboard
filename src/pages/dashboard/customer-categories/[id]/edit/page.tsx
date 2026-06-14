import { fetchData } from "@/api/global/fetchData";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import CustomerCategoriesForm from "@/components/pages/_customerCategories/CustomerCategoriesForm";
import AssignedStoresManager from "@/components/pages/_customerCategories/AssignedStoresManager";
import { getTranslations } from "@/lib/i18n";
import { notFound } from "@/lib/navigation";

export default async function page({ params }: { params: Params }): Promise<JSX.Element> {
  const { id } = await params;
  const t = await getTranslations();
  const data = await fetchData(["customerCategories", Number(id)]);

  if (!data?.data) {
    return notFound();
  }

  return (
    <>
      <CustomHeader
        items={[
          { label: t("customerCategories"), href: "/customer-categories" },
          { label: t("edit"), href: `/customer-categories/${id}/edit` }
        ]}
      />
      <div className="md:p-10 p-5 mt-10 rounded-2xl border bg-background">
        <CustomerCategoriesForm data={data.data} />
      </div>
      <AssignedStoresManager customerCategoryId={Number(id)} />
    </>
  );
}
