
import CustomHeader from "@/components/layouts/header/CustomHeader";
import BranchesFormPage from '@/components/pages/_branches/branchesForm.page';


export default async function Page({ params }: { params: Params }): Promise<JSX.Element> {
  return <>
    <CustomHeader />
    <BranchesFormPage storeId={Number((await params).id)} /></>;
}
