
import CustomHeader from "@/components/layouts/header/CustomHeader";

import { fetchHelper } from '@/api/fetch';
import UsersFormPage from '@/components/pages/_users/usersForm.page';

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['users', Number((await params).id)],
    method: "GET",
  });

  return <>
    <CustomHeader />
    <UsersFormPage data={data?.data} /></>;
};

export default page;
