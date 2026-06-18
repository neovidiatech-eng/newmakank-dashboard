import { fetchHelper } from "@/api/fetch";
import getPermissions from "@/api/permissions";
import CustomHeader from "@/components/layouts/header/CustomHeader";
// import GenerateStaticParams from '@/api/metadata';
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

  return (
    <>
      <CustomHeader />
      <BannersTable
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
