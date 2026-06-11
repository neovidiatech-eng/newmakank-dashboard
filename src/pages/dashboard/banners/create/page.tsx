
import BannersFormPage from '@/components/pages/_banners/bannersForm.page';
import CustomHeader from "@/components/layouts/header/CustomHeader";


export default async function Page(): Promise<JSX.Element> {
  return <>
    <CustomHeader />
    <BannersFormPage /></>;
}
