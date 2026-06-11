
import CustomHeader from "@/components/layouts/header/CustomHeader";

import CitiesFormPage from "@/components/pages/_cities/citiesForm.page";
import { fetchHelper } from "@/api/fetch";

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['cities',Number((await params).id)],
    method: "GET",
  });

  return<>
  <CustomHeader />
   <CitiesFormPage data={data?.data} /></>;
};

export default page;
