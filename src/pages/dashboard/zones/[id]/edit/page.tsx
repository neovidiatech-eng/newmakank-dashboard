
import CustomHeader from "@/components/layouts/header/CustomHeader";

import { fetchHelper } from '@/api/fetch';
import ZonesFormPage from '@/components/pages/_zones/zonesForm.page';

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['zones', Number((await params).id)],
    method: "GET",
  });
  console.log(data, 'das2es');
  return <>
    <CustomHeader />
    <ZonesFormPage data={{
      ...data?.data,
      cityId: data?.data?.City?.id || data?.data?.cityId || null
    }} /></>;
};

export default page;
