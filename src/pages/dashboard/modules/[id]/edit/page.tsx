
import CustomHeader from "@/components/layouts/header/CustomHeader";

import ModulesFormPage from "@/components/pages/_modules/modulesForm.page";
import { fetchHelper } from "@/api/fetch";

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['modules',Number((await params).id)],
    method: "GET",
  });

  return<>
  <CustomHeader />
   <ModulesFormPage data={data?.data} /></>;
};

export default page;
