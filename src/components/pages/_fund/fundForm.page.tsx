import CustomForm from "@/components/common/Form/CustomForm";
import { testFundForm } from "./fund-check-form-validation";
import type { FundType } from "./fund.schema";
import useFundLogic from "./useFundForm.logic";

export default function FundFormPage({ data }: { data?: FundType }) {
	const { inputs, t, control, formSubmit } = useFundLogic({ data });
	testFundForm();

	return (
		<CustomForm
			handleSubmit={formSubmit}

			control={control}
			cardConfig={[
				{
					id: "lang",
					title: t("Fund Information"),
					multiLang: true,
					width: 6,
				},
			]}
			inputs={inputs}
		/>
	);
}

