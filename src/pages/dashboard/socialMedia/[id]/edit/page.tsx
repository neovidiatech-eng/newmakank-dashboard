
import CustomHeader from "@/components/layouts/header/CustomHeader";

import { fetchHelper } from '@/api/fetch';
import SocialMediaFormPage from '@/components/pages/_socialMedia/socialMediaForm.page';

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['socialMedia', Number((await params).id)],
    method: "GET",
  });

  return <>
    <CustomHeader />
    <SocialMediaFormPage data={data?.data} /></>;
};

export default page;
