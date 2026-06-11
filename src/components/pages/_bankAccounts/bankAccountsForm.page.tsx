import CustomForm from "@/components/common/Form/CustomForm";
import type {  BankAccountsType } from "./bankAccounts.schema";
import useBankAccountsLogic from "./useBankAccountsForm.logic";
import { testBankAccountsForm } from "./bankAccounts-check-form-validation";

export default function BankAccountsFormPage({ data }: { data?: BankAccountsType }) {
	const { inputs, t, control, formSubmit } = useBankAccountsLogic({ data });
  testBankAccountsForm();
 
	return (
			<CustomForm
				handleSubmit={formSubmit}
				control={control}
				cardConfig={[
					{
						id: "lang",
						title: t("BankAccounts Information"),
						multiLang: true,
						width: 6,
					},
				]}
				inputs={inputs}
			/>
	);
}

  
