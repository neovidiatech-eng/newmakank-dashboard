
import CustomHeader from "@/components/layouts/header/CustomHeader";

import ComplaintFormPage from '@/components/pages/_complaint/complaintForm.page';
 import { fetchHelper } from '@/api/fetch';

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['complaint',Number((await params).id)],
    method: "GET",
  });

  return<>
  <CustomHeader />
   <ComplaintFormPage data={data?.data} /></>;
};

export default page;
