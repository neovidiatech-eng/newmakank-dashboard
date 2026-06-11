
import DeliveryFormPage from '@/components/pages/_delivery/deliveryForm.page';
import CustomHeader from "@/components/layouts/header/CustomHeader";


export default async function Page() : Promise<JSX.Element>  {
  return <>
  <CustomHeader />
  <DeliveryFormPage /></>;
}
