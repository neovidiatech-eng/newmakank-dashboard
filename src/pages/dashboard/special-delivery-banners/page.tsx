import { fetchHelper } from "@/api/fetch";
import getPermissions from "@/api/permissions";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import SpecialDeliveryBannersTable from "./SpecialDeliveryBannersTable";

async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const permissions = await getPermissions();
  const permission = permissions?.["special-delivery-banners"];
  const data = await fetchHelper({
    endPoint: ["specialDeliveryBanners"],
    method: "GET",
    params: await searchParams
  });

  if (!data) return <div>Error...</div>;

  const filteredData = data?.data;

  return (
    <>
      <CustomHeader />
      <SpecialDeliveryBannersTable
        data={filteredData}
        total={data?.total}
        canCreate={permission?.post ?? true}
        canEdit={permission?.put || permission?.patch || !permission ? true : false}
        canDelete={permission?.delete ?? true}
      />
    </>
  );
}

export default page;
