
import CitiesFormPage from "@/components/pages/_cities/citiesForm.page";
import CustomHeader from "@/components/layouts/header/CustomHeader";


export default async function Page(): Promise<JSX.Element> {
  return (
    <>
      <CustomHeader />
      <CitiesFormPage />
    </>
  );
}
