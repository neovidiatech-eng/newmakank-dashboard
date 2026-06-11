
import CustomHeader from "@/components/layouts/header/CustomHeader";

import VariationTemplateFormPage from '@/components/pages/_variationTemplate/variationTemplateForm.page';
 import { fetchHelper } from '@/api/fetch';

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['variationTemplate',Number((await params).id)],
    method: "GET",
  });

  return<>
  <CustomHeader />
   <VariationTemplateFormPage data={data?.data} /></>;
};

export default page;
