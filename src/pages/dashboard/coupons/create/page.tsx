
import CouponsFormPage from "@/components/pages/_coupons/couponsForm.page";
import CustomHeader from "@/components/layouts/header/CustomHeader";


export default async function Page(): Promise<JSX.Element> {
  return (
    <>
      <CustomHeader />
      <CouponsFormPage />
    </>
  );
}
