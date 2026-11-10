import CustomHeader from "@/components/layouts/header/CustomHeader";
import DriverPointsDetail from "../DriverPointsDetail";

const page = async ({ params }: { params: Params }) => {
  const id = Number((await params).id);
  return (
    <>
      <CustomHeader />
      <DriverPointsDetail deliveryId={id} />
    </>
  );
};

export default page;
