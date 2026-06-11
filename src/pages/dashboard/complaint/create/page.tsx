
import ComplaintFormPage from '@/components/pages/_complaint/complaintForm.page';
import CustomHeader from "@/components/layouts/header/CustomHeader";


export default async function Page() : Promise<JSX.Element>  {
  return <>
  <CustomHeader />
  <ComplaintFormPage /></>;
}
