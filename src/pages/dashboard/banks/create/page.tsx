
import BanksFormPage from "@/components/pages/_banks/banksForm.page";
import CustomHeader from "@/components/layouts/header/CustomHeader";


export default async function Page(): Promise<JSX.Element> {
  return (
    <>
      <CustomHeader />
      <BanksFormPage />
    </>
  );
}
