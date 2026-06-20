
import CustomHeader from "@/components/layouts/header/CustomHeader";

import { fetchHelper } from '@/api/fetch';
import CategoryFormPage from '@/components/pages/_category/categoryForm.page';

const page = async ({ params }: { params: Params }) => {
  const targetId = Number((await params).id);
  const response = await fetchHelper({
    endPoint: ['storeTemplatesCategories'],
    method: "GET",
    params: { limit: 1000 }
  });

  const categoryItem = response?.data?.find((cat: any) => cat.id === targetId);

  return <>
    <CustomHeader />
    <CategoryFormPage data={categoryItem} /></>;
};

export default page;
