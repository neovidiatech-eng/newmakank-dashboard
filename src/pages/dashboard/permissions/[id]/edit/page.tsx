import CustomHeader from "@/components/layouts/header/CustomHeader";

import { fetchHelper } from "@/api/fetch";
import AllPermissionsFormPage from "@/components/pages/_allPermissions/allPermissionsForm.page";

const page = async ({ params }: { params: Params }) => {
  const { id } = await params;
  const data = await fetchHelper({
    endPoint: ["permissions"],
    method: "GET"
  });
  console.log(data, "asd2sa");
  const filtterData = data?.data.find((item: any) => item.id === Number(id));
  console.log(filtterData, "asd2sa");
  return (
    <>
      <CustomHeader />
      <AllPermissionsFormPage
        data={{
          id: filtterData?.id,
          nameAr: filtterData?.name.ar,
          nameEn: filtterData?.name.en
        }}
      />
    </>
  );
};

export default page;
