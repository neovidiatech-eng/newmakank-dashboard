
import StoresFormPage from "@/components/pages/_stores/storesForm.page";
import CustomHeader from "@/components/layouts/header/CustomHeader";


export default async function Page(): Promise<JSX.Element> {
  return (
    <>
      <CustomHeader />
      <StoresFormPage />
    </>
  );
}
