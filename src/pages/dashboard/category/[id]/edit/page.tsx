
import CustomHeader from "@/components/layouts/header/CustomHeader";

import { fetchHelper } from '@/api/fetch';
import CategoryFormPage from '@/components/pages/_category/categoryForm.page';

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['categories', Number((await params).id)],
    method: "GET",
  });

  return <>
    <CustomHeader />
    <CategoryFormPage data={data?.data} /></>;
};

export default page;
