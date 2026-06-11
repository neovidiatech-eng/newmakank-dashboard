import CustomForm from "@/components/common/Form/CustomForm";
import type {  CustomersType } from "./customers.schema";
import useCustomersLogic from "./useCustomersForm.logic";
import { testCustomersForm } from "./customers-check-form-validation";

export default function CustomersFormPage({ data }: { data?: CustomersType }) {
	const { inputs, t, control, formSubmit } = useCustomersLogic({ data });
  testCustomersForm();
 
	return (
			<CustomForm
				handleSubmit={formSubmit}
				
				control={control}
				cardConfig={[
					{
						id: "lang",
						title: t("Customers Information"),
						multiLang: true,
						width: 6,
					},
				]}
				inputs={inputs}
			/>
	);
}

  