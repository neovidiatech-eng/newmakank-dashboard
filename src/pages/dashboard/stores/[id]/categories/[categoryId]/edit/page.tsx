
import CustomHeader from "@/components/layouts/header/CustomHeader";

import { fetchHelper } from "@/api/fetch";
import SubCategoriesFormPage from "@/components/pages/_subCategories/subCategoriesForm.page";

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['storeCategories', Number((await params).categoryId)],
  });

  return <>
    <CustomHeader />
    <SubCategoriesFormPage
      storeId={Number((await params).id)}
      data={{
        ...data?.data
      }} /></>;
};

export default page;
