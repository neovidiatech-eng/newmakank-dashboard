
import BranchesFormPage from '@/components/pages/_branches/branchesForm.page';
import CustomHeader from "@/components/layouts/header/CustomHeader";


export default async function Page() : Promise<JSX.Element>  {
  return <>
  <CustomHeader />
  <BranchesFormPage /></>;
}
