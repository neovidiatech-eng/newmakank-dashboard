import CustomHeader from "@/components/layouts/header/CustomHeader";
import getPermissions from "@/api/permissions";
import ZonesTable from "./ZonesTable";

export default async function page(): Promise<JSX.Element> {
  const permissions = await getPermissions();
  const permission = permissions?.["Zones"] ?? permissions?.["zones"];

  return (
    <>
      <CustomHeader />
      <ZonesTable permission={permission} />
    </>
  );
}
