import CustomForm from "@/components/common/Form/CustomForm";
import type {  BanksType } from "./banks.schema";
import useBanksLogic from "./useBanksForm.logic";
import { testBanksForm } from "./banks-check-form-validation";

export default function BanksFormPage({ data }: { data?: BanksType }) {
	const { inputs, t, control, formSubmit } = useBanksLogic({ data });
  testBanksForm();
 
	return (
			<CustomForm
				handleSubmit={formSubmit}
				control={control}
				cardConfig={[
					{
						id: "lang",
						title: t("Banks Information"),
						multiLang: true,
						width: 6,
					},
				]}
				inputs={inputs}
			/>
	);
}

  
