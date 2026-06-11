
import CustomersFormPage from "@/components/pages/_customers/customersForm.page";
import CustomHeader from "@/components/layouts/header/CustomHeader";


export default async function Page(): Promise<JSX.Element> {
  return (
    <>
      <CustomHeader />
      <CustomersFormPage />
    </>
  );
}
