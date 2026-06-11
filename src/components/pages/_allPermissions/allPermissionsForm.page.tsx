import CustomForm from "@/components/common/Form/CustomForm";
import type { AllPermissionsType } from "./allPermissions.schema";
import useAllPermissionsLogic from "./useAllPermissionsForm.logic";

export default function AllPermissionsFormPage({ data }: { data?: AllPermissionsType }) {
	const { inputs, t, control, formSubmit } = useAllPermissionsLogic({ data });

	return (
		<CustomForm
			handleSubmit={formSubmit}
			control={control}
			cardConfig={[
				{
					id: "lang",
					title: t("AllPermissions Information"),
					multiLang: true,
					width: 6,
				},
			]}
			inputs={inputs}
		/>
	);
}

