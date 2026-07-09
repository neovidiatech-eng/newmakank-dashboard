import CustomHeader from "@/components/layouts/header/CustomHeader";
import { fetchHelper } from '@/api/fetch';
import EmployeesFormPage from '@/components/pages/_employees/employeesForm.page';

const page = async ({ params }: { params: Params }) => {
  const data = await fetchHelper({
    endPoint: ['employees', Number((await params).id)],
    method: "GET",
  });

  return <>
    <CustomHeader />
    <EmployeesFormPage data={data?.data} /></>;
};

export default page;
