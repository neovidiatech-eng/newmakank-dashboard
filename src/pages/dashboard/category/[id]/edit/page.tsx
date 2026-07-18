
import CustomHeader from "@/components/layouts/header/CustomHeader";

import { fetchHelper } from '@/api/fetch';
import CategoryFormPage from '@/components/pages/_category/categoryForm.page';

const page = async ({ params }: { params: Params }) => {
  const targetId = Number((await params).id);

  // The backend route is GET /store-templates/categories?id=512 (not /categories/512)
  const response = await fetchHelper({
    endPoint: ['storeTemplatesCategories'],
    method: "GET",
    params: { id: targetId },
  });

  // When id filter is used, the backend returns the single item directly (not an array)
  const categoryItem = Array.isArray(response?.data)
    ? response?.data?.find((cat: any) => cat.id === targetId)
    : response?.data;

  return <>
    <CustomHeader />
    <CategoryFormPage data={categoryItem} /></>;
};

export default page;
