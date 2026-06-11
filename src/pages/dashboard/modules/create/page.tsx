
import ModulesFormPage from "@/components/pages/_modules/modulesForm.page";
import CustomHeader from "@/components/layouts/header/CustomHeader";


export default async function Page(): Promise<JSX.Element> {
  return (
    <>
      <CustomHeader />
      <ModulesFormPage />
    </>
  );
}
