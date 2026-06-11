
import CustomHeader from "@/components/layouts/header/CustomHeader";

import BankAccountsFormPage from '@/components/pages/_bankAccounts/bankAccountsForm.page';
 import { fetchHelper } from '@/api/fetch';

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['bankAccounts',Number((await params).id)],
    method: "GET",
  });

  return<>
  <CustomHeader />
   <BankAccountsFormPage data={data?.data} /></>;
};

export default page;
