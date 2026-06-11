
import ServicesFormPage from '@/components/pages/_services/servicesForm.page';
import CustomHeader from "@/components/layouts/header/CustomHeader";


export default async function Page(): Promise<JSX.Element> {
  return <>
    <CustomHeader />
    <ServicesFormPage /></>;
}
