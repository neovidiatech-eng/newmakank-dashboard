
import CustomHeader from "@/components/layouts/header/CustomHeader";

import { fetchHelper } from '@/api/fetch';
import CouponsFormPage from '@/components/pages/_coupons/couponsForm.page';

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['coupons', Number((await params).id)],
    method: "GET",
  });

  return <>
    <CustomHeader />
    <CouponsFormPage data={{
      ...data?.data,
      userIds: data?.data?.UserCoupons?.map((item: { userId?: number; User?: { id?: number } }) => item.userId || item.User?.id).filter(Boolean) || data?.data?.userIds || [],
      storeIds: data?.data?.StoreCoupons?.map((item: { storeId?: number; Store?: { id?: number } }) => item.storeId || item.Store?.id).filter(Boolean) || data?.data?.storeIds || [],
      zoneIds: data?.data?.ZoneCoupons?.map((item: { zoneId?: number; Zone?: { id?: number } }) => item.zoneId || item.Zone?.id).filter(Boolean) || data?.data?.zoneIds || [],
      moduleIds: data?.data?.ModuleCoupons?.map((item: { moduleId?: number; Module?: { id?: number } }) => item.moduleId || item.Module?.id).filter(Boolean) || data?.data?.moduleIds || []
    }} /></>;
};

export default page;
