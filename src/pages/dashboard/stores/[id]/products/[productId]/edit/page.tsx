
import { fetchHelper } from '@/api/fetch';
import CustomHeader from "@/components/layouts/header/CustomHeader";
import ServicesFormPage from '@/components/pages/_services/servicesForm.page';

export default async function Page({ params }: { params: Promise<{ id: string, productId: string }> }): Promise<JSX.Element> {
    const { id, productId } = await params;
    const data = await fetchHelper({
        endPoint: ['services', Number(productId)],
        method: "GET",
    });

    return <>
        <CustomHeader />
        <ServicesFormPage
            hideStoreInput={true}
            data={{
                ...data?.data,
                storeId: Number(id),
                categoryId: data?.data?.Category?.id,
                Sizes: data?.data?.Sizes?.map((item: any) => ({
                    nameAr: item?.name?.ar,
                    nameEn: item?.name?.en,
                    price: item?.price,
                    priceAfterDiscount: item?.priceAfterDiscount,
                    isDefault: item?.isDefault
                })),
                Addons: data?.data?.Addons?.map((item: any) => ({
                    nameAr: item?.name?.ar,
                    nameEn: item?.name?.en,
                    price: item?.price,
                    priceAfterDiscount: item?.priceAfterDiscount
                }))
            }} /></>;
}
