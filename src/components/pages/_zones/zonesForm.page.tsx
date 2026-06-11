import CustomForm from "@/components/common/Form/CustomForm";
import type {  ZonesType } from "./zones.schema";
import useZonesLogic from "./useZonesForm.logic";
import { testZonesForm } from "./zones-check-form-validation";

export default function ZonesFormPage({ data }: { data?: ZonesType }) {
	const { inputs, t, control, formSubmit ,lang} = useZonesLogic({ data });
  testZonesForm();
 
	return (
			<CustomForm
				handleSubmit={formSubmit}
				changeLang={lang}
				control={control}
				cardConfig={[
					{
						id: "lang",
						title: t("Zones Information"),
						multiLang: true,
						width: 6,
					},
				]}
				inputs={inputs}
			/>
	);
}

  