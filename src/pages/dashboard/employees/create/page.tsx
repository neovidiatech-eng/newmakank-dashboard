import CustomHeader from "@/components/layouts/header/CustomHeader";
import EmployeesFormPage from "@/components/pages/_employees/employeesForm.page";

export default async function Page(): Promise<JSX.Element> {
  return <>
    <CustomHeader />
    <EmployeesFormPage />
  </>;
}
