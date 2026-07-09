import CustomForm from "@/components/common/Form/CustomForm";
import type { EmployeesType } from "./employees.schema";
import useEmployeesLogic from "./useEmployeesForm.logic";

export default function EmployeesFormPage({ data }: { data?: EmployeesType }) {
	const { inputs, t, control, formSubmit } = useEmployeesLogic({ data });

	return (
		<CustomForm
			handleSubmit={formSubmit}
			control={control}
			cardConfig={[
				{
					id: "lang",
					title: t("Employees Information"),
					multiLang: true,
					width: 6,
				},
			]}
			inputs={inputs}
		/>
	);
}
