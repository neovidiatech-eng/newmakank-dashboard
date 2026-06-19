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
  const appliedTemplates = await fetchHelper({
    endPoint: ["stores", Number((await params).id), "appliedTemplates"]
  });

  return (
    <>
      <CustomHeader />
      <StoresFormPage
        data={{
          ...data?.data,
          moduleId: data?.data?.Module?.id || "",
          categoryId: categories?.data?.map((category: { id: number }) => category.id) || [],
          templateId: Array.isArray(appliedTemplates?.data) 
            ? appliedTemplates?.data[0]?.StoreTemplate?.id || appliedTemplates?.data[0]?.templateId || appliedTemplates?.data[0]?.template?.id || appliedTemplates?.data[0]?.id
            : appliedTemplates?.data?.StoreTemplate?.id || appliedTemplates?.data?.templateId || appliedTemplates?.data?.template?.id || appliedTemplates?.data?.id
        }}
      />
    </>
  );
};

export default page;
