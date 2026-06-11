import CustomHeader from "@/components/layouts/header/CustomHeader";

import { fetchHelper } from "@/api/fetch";
import StoresFormPage from "@/components/pages/_stores/storesForm.page";

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ["stores", Number((await params).id)]
  });
  const categories = await fetchHelper({
    endPoint: ["categories"],
    params: {
      storeId: Number((await params).id)
    }
  });
  console.log(categories, "dsa2eds");
  return (
    <>
      <CustomHeader />
      <StoresFormPage
        data={{
          ...data?.data,
          moduleId: data?.data?.Module?.id || "",
          categoryId: categories?.data?.map((category: { id: number }) => category.id) || []
        }}
      />
    </>
  );
};

export default page;
