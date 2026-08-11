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
        canCreate={permission?.post}
        canEdit={permission?.put || permission?.patch}
        canDelete={permission?.delete}
      />
    </>
  );
}

export default page;
