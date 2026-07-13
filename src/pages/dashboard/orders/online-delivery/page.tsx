import CustomHeader from "@/components/layouts/header/CustomHeader";
import OnlineDeliveryTable from "./OnlineDeliveryTable";
import getPermissions from "@/api/permissions";

export default async function page(): Promise<JSX.Element> {
  const permissions = await getPermissions();
  const permission = permissions?.["Orders"] ?? permissions?.["orders"];

  return (
    <>
      <CustomHeader />
      <OnlineDeliveryTable permission={permission} />
    </>
  );
}
