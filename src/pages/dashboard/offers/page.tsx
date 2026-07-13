import CustomHeader from "@/components/layouts/header/CustomHeader";
import getPermissions from "@/api/permissions";
import OffersTable from "./OffersTable";

export default async function page(): Promise<JSX.Element> {
  const permissions = await getPermissions();
  const permission = permissions?.["Service"];

  return (
    <>
      <CustomHeader />
      <OffersTable permission={permission} />
    </>
  );
}
