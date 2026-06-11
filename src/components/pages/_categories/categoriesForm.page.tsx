import CustomForm from "@/components/common/Form/CustomForm";
import { endpointType } from "@/utils/endpoints";
import { testCategoriesForm } from "./categories-check-form-validation";
import type { CategoriesType } from "./categories.schema";
import useCategoriesLogic from "./useCategoriesForm.logic";

export default function CategoriesFormPage({ data, endpoint }: {
	data?: CategoriesType,
	endpoint?: endpointType
}) {
	const { inputs, t, control, formSubmit, lang } = useCategoriesLogic({ data, endpoint });
	testCategoriesForm();

	return (
		<CustomForm
			handleSubmit={formSubmit}
			changeLang={lang}
			control={control}
			cardConfig={[
				{
					id: "lang",
					title: t("Categories Information"),
					multiLang: true,
					width: 6,
				},
			]}
			inputs={inputs}
		/>
	);
}

