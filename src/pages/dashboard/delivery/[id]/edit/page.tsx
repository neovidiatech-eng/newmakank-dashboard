
import CustomHeader from "@/components/layouts/header/CustomHeader";

import { fetchHelper } from '@/api/fetch';
import DeliveryFormPage from '@/components/pages/_delivery/deliveryForm.page';

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['delivery', Number((await params).id)],
    method: "GET",
  });
  return <>
    <CustomHeader />
    <DeliveryFormPage data={data as any} /></>;
};

export default page;
