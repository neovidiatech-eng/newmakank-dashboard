import SpecialDeliveryBannersFormPage from '@/components/pages/_specialDeliveryBanners/specialDeliveryBannersForm.page';
import CustomHeader from "@/components/layouts/header/CustomHeader";

export default async function Page(): Promise<JSX.Element> {
  return (
    <>
      <CustomHeader />
      <SpecialDeliveryBannersFormPage />
    </>
  );
}
