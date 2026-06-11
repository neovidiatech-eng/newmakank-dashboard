
import CustomHeader from "@/components/layouts/header/CustomHeader";

import BranchesFormPage from '@/components/pages/_branches/branchesForm.page';
 import { fetchHelper } from '@/api/fetch';

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['branches',Number((await params).id)],
    method: "GET",
  });

  return<>
  <CustomHeader />
   <BranchesFormPage data={data?.data} /></>;
};

export default page;
