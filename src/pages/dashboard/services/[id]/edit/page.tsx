
import CustomHeader from "@/components/layouts/header/CustomHeader";

import { fetchHelper } from '@/api/fetch';
import ServicesFormPage from '@/components/pages/_services/servicesForm.page';

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['services', Number((await params).id)],
  });
  return <>
    <CustomHeader />
    <ServicesFormPage data={{
      ...data?.data,
      storeId: data?.data?.Store?.id,
      categoryId: data?.data?.Category?.id,
      Sizes: data?.data?.Sizes?.map((item) => ({
        nameAr: item?.name?.ar,
        nameEn: item?.name?.en,
        price: item?.price,
        priceAfterDiscount: item?.priceAfterDiscount,
        isDefault: item?.isDefault
      })),
      Addons: data?.data?.Addons?.map((item) => ({
        nameAr: item?.name?.ar,
        nameEn: item?.name?.en,
        price: item?.price,
        priceAfterDiscount: item?.priceAfterDiscount
      }))
    }} /></>;
};

export default page;
