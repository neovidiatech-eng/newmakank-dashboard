
import CustomHeader from "@/components/layouts/header/CustomHeader";
import UsersFormPage from "@/components/pages/_users/usersForm.page";


export default async function Page(): Promise<JSX.Element> {
  return <>
    <CustomHeader />
    <UsersFormPage />
  </>;
}
