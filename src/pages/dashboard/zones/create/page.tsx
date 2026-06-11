
import ZonesFormPage from '@/components/pages/_zones/zonesForm.page';
import CustomHeader from "@/components/layouts/header/CustomHeader";


export default async function Page() : Promise<JSX.Element>  {
  return <>
  <CustomHeader />
  <ZonesFormPage /></>;
}
