import CustomForm from "@/components/common/Form/CustomForm";
import type { ModulesType } from "./modules.schema";
import useModulesLogic from "./useModulesForm.logic";

export default function ModulesFormPage({ data }: { data?: ModulesType }) {
	const { inputs, t, control, formSubmit, lang } = useModulesLogic({ data });

	return (
		<CustomForm
			handleSubmit={formSubmit}
			changeLang={lang}
			control={control}
			cardConfig={[
				{
					id: "lang",
					title: t("Modules Information"),
					multiLang: true,
					width: 6,
				},
			]}
			inputs={inputs}
		/>
	);
}

