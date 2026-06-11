import { fetchHelper } from "@/api/fetch";
import getPermissions from "@/api/permissions";
import TableBasic from "@/components/common/table/TableBasic";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import { getTranslations } from "@/lib/i18n";
import PermissionsColumns from "./PermissionsColumns";
// import GenerateStaticParams from '@/api/metadata';
import { PROJECT_NAME } from "@/utils/config";
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations();
  const permissions = await getPermissions();
  const permission = permissions?.["Permissions"] ?? permissions?.["permissions"];
  const data = await fetchHelper({
    endPoint: ["permissions"],
    method: "GET",
    params: await searchParams
  });
  if (!data) return <div>Error...</div>;

  const filteredData = data?.data;

  return (
    <>
      <CustomHeader />
      <TableBasic
        data={filteredData}
        columns={PermissionsColumns}
        hideCreateNew={!permission?.post}
        tableActions={{
          onEdit: permission?.put || permission?.patch
          // onDelete: ["permissions"],
          //onInfo: true,
        }}
        cardHeader={t("Permissions")}
      />
    </>
  );
}

export default page;
