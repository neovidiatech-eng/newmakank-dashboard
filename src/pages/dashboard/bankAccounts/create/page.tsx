
import BankAccountsFormPage from '@/components/pages/_bankAccounts/bankAccountsForm.page';
import CustomHeader from "@/components/layouts/header/CustomHeader";


export default async function Page() : Promise<JSX.Element>  {
  return <>
  <CustomHeader />
  <BankAccountsFormPage /></>;
}
