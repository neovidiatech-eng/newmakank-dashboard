
import CustomHeader from "@/components/layouts/header/CustomHeader";
import ScheduleFormPage from '@/components/pages/_schedule/scheduleForm.page';


export default async function Page({ searchParams }: {
  searchParams: SearchParams
}): Promise<JSX.Element> {
  return <>
    <CustomHeader />
    <ScheduleFormPage branchId={(await searchParams).branchId as string} /></>;
}
