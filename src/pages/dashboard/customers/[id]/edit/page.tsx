
import CustomHeader from "@/components/layouts/header/CustomHeader";

import CustomersFormPage from "@/components/pages/_customers/customersForm.page";
import { fetchHelper } from "@/api/fetch";

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['customers',Number((await params).id)],
    method: "GET",
  });

  return<>
  <CustomHeader />
   <CustomersFormPage data={data?.data} /></>;
};

export default page;
