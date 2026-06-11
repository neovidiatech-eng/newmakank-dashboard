
import CustomHeader from "@/components/layouts/header/CustomHeader";
import SocialMediaFormPage from "@/components/pages/_socialMedia/socialMediaForm.page";


export default async function Page(): Promise<JSX.Element> {
  return <>
    <CustomHeader />
    <SocialMediaFormPage /></>;
}
