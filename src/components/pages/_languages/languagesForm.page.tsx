import CustomForm from "@/components/common/Form/CustomForm";
import type {  LanguagesType } from "./languages.schema";
import useLanguagesLogic from "./useLanguagesForm.logic";

export default function LanguagesFormPage({ data }: { data?: LanguagesType }) {
	const { inputs, t, control, formSubmit } = useLanguagesLogic({ data });
      
	return (
			<CustomForm
				handleSubmit={formSubmit}
				
				control={control}
				cardConfig={[
					{
						id: "lang",
						title: t("Languages Information"),
						multiLang: true,
						width: 6,
					},
				]}
				inputs={inputs}
			/>
	);
}

  