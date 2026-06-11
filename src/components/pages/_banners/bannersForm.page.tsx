import CustomForm from "@/components/common/Form/CustomForm";
import { testBannersForm } from "./banners-check-form-validation";
import type { BannersType } from "./banners.schema";
import useBannersLogic from "./useBannersForm.logic";

export default function BannersFormPage({ data }: { data?: BannersType }) {
	const { inputs, t, control, formSubmit, lang } = useBannersLogic({ data });
	testBannersForm();

	return (
		<CustomForm
			handleSubmit={formSubmit}
			changeLang={lang}
			control={control}
			cardConfig={[
				{
					id: "lang",
					title: t("Banners Information"),
					multiLang: true,
					width: 6,
				},
				{
					id: "targeting",
					title: t("Banner Targeting"),
					width: 6,
				},
				{
					id: "media",
					title: t("Banner Media and Schedule"),
					width: 6,
				},
			]}
			inputs={inputs}
		/>
	);
}
