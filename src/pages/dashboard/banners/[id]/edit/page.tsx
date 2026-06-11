
import CustomHeader from "@/components/layouts/header/CustomHeader";

import { fetchHelper } from '@/api/fetch';
import BannersFormPage from '@/components/pages/_banners/bannersForm.page';

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['banners', Number((await params).id)],
  });
  const banner = data?.data;
  const targetType =
    banner?.targetType ||
    (banner?.isSpecialDriverBanner || banner?.specialDelivery ? "SPECIAL_DRIVER" : "GENERAL");

  return <>
    <CustomHeader />
    <BannersFormPage data={{
      ...banner,
      targetType,
      storeId: banner?.Store?.id || banner?.storeId || null,
      categoryId: banner?.Category?.id || banner?.categoryId || null,
      serviceId: banner?.Service?.id || banner?.serviceId || null,
      zoneIds: banner?.Zones?.map((zone: { id: number }) => zone.id) || banner?.zoneIds || [],
      specialDelivery: targetType === "SPECIAL_DRIVER" ? ["true"] : []
    }} />
  </>;
};

export default page;
