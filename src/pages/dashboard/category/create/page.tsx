
// import CategoryFormPage from '@/components/pages/_category/CategoryForm.page';
import CustomHeader from "@/components/layouts/header/CustomHeader";
import CategoryFormPage from "@/components/pages/_category/categoryForm.page";


export default async function Page(): Promise<JSX.Element> {
  return <>
    <CustomHeader />
    <CategoryFormPage /></>;
}
