// import CategoryFormPage from '@/components/pages/_category/CategoryForm.page';
import CustomHeader from "@/components/layouts/header/CustomHeader";
import SubCategoriesFormPage from "@/components/pages/_subCategories/subCategoriesForm.page";

export default async function Page({ params }: { params: Params }): Promise<JSX.Element> {
  return (
    <>
      <CustomHeader />
      <SubCategoriesFormPage
        storeId={Number((await params).id)}
      />
    </>
  );
}
