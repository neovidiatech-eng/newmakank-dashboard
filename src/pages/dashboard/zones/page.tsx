import { fetchHelper } from "@/api/fetch";
import getPermissions from "@/api/permissions";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { PROJECT_NAME } from "@/utils/config";
import { getTranslations } from "@/lib/i18n";
import ZonesTable from "./ZonesTable";

async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const permissions = await getPermissions();
  const permission = permissions?.["Zones"] ?? permissions?.["zones"];
  const data = await fetchHelper({
    endPoint: ["zones"],
    method: "GET",
    params: await searchParams
  });

  if (!data) return <div>Error...</div>;

  const filteredData = data?.data;

  return (
    <>
      <CustomHeader />
      <ZonesTable data={filteredData} total={data?.total} permission={permission} />
    </>
  );
}

export default page;
