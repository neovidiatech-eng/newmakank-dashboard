
import CustomHeader from "@/components/layouts/header/CustomHeader";
import ServicesFormPage from '@/components/pages/_services/servicesForm.page';

export default async function Page({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element> {
    const { id } = await params;
    return <>
        <CustomHeader />
        <ServicesFormPage hideStoreInput={true} data={{ storeId: Number(id) } as any} /></>;
}
