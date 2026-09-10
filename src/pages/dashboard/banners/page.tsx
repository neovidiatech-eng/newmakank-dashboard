import { fetchHelper } from "@/api/fetch";
import getPermissions from "@/api/permissions";
import CustomHeader from "@/components/layouts/header/CustomHeader";
// import GenerateStaticParams from '@/api/metadata';
import type { FormInput } from "@/components/common/Form/CustomFormTypes.types";
import BannersTable from "./BannersTable";
// export const generateStaticParams = GenerateStaticParams;
async function page({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const permissions = await getPermissions();
  const permission = permissions?.["Banners"] ?? permissions?.["banners"];
  const data = await fetchHelper({
    endPoint: ["banners"],
    method: "GET",
    params: await searchParams
  });

  if (!data) return <div>Error...</div>;

  const filteredData = data?.data;

  const filters: FormInput[] = [
    { name: "name", type: "text", width: 3 },
    {
      name: "zoneId",
      key: "zoneId",
      type: "selectPaginated",
      apiUrl: ["zones"],
      endPoint: ["zones"],
      placeholder: "المنطقة",
      labelKey: "name",
      valueKey: "id",
      idKey: "id",
      width: 3
    } as any
  ];

  return (
    <>
      <CustomHeader />
      <BannersTable
        data={filteredData}
        total={data?.total}
        canCreate={permission?.post}
        canEdit={permission?.put || permission?.patch}
        canDelete={permission?.delete}
        filters={filters}
      />
    </>
  );
}

export default page;
