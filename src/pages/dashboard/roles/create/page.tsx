
import { fetchHelper } from "@/api/fetch";
import CustomHeader from "@/components/layouts/header/CustomHeader";
import RolesFormPage from '@/components/pages/_roles/rolesForm.page';


export default async function Page(): Promise<JSX.Element> {
  const permissions = await fetchHelper({
    endPoint: ['systemPermissions'],
  });
  return <>
    <CustomHeader />
    <RolesFormPage permissions={permissions?.data} /></>;
}
