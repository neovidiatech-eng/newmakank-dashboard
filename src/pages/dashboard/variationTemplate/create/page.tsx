
import VariationTemplateFormPage from '@/components/pages/_variationTemplate/variationTemplateForm.page';
import CustomHeader from "@/components/layouts/header/CustomHeader";


export default async function Page() : Promise<JSX.Element>  {
  return <>
  <CustomHeader />
  <VariationTemplateFormPage /></>;
}
