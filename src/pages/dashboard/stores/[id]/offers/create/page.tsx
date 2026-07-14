import CustomHeader from "@/components/layouts/header/CustomHeader";
import StoreOfferCreatePage from "@/components/pages/_stores/details/StoreOfferCreatePage";

const page = async ({ params }: { params: Params }) => {
  const storeId = Number((await params).id);

  return (
    <>
      <CustomHeader />
      <StoreOfferCreatePage storeId={storeId} />
    </>
  );
};

export default page;
