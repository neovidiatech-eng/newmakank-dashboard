
import CustomHeader from "@/components/layouts/header/CustomHeader";

import { fetchHelper } from '@/api/fetch';
import BanksFormPage from '@/components/pages/_banks/banksForm.page';

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['banks', Number((await params).id)],
    method: "GET",
  });

  return <>
    <CustomHeader />
    <BanksFormPage data={data?.data} /></>;
};

export default page;
