
import FundFormPage from '@/components/pages/_fund/fundForm.page';
import CustomHeader from "@/components/layouts/header/CustomHeader";


export default async function Page() : Promise<JSX.Element>  {
  return <>
  <CustomHeader />
  <FundFormPage /></>;
}
