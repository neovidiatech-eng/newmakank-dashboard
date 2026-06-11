
import CustomHeader from "@/components/layouts/header/CustomHeader";

import FundFormPage from '@/components/pages/_fund/fundForm.page';
 import { fetchHelper } from '@/api/fetch';

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['fund',Number((await params).id)],
    method: "GET",
  });

  return<>
  <CustomHeader />
   <FundFormPage data={data?.data} /></>;
};

export default page;
