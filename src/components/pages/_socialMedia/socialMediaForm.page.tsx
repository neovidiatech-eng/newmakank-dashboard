import CustomForm from "@/components/common/Form/CustomForm";
import type {  SocialMediaType } from "./socialMedia.schema";
import useSocialMediaLogic from "./useSocialMediaForm.logic";
import { testSocialMediaForm } from "./socialMedia-check-form-validation";

export default function SocialMediaFormPage({ data }: { data?: SocialMediaType }) {
	const { inputs, t, control, formSubmit } = useSocialMediaLogic({ data });
  testSocialMediaForm();
 
	return (
			<CustomForm
				handleSubmit={formSubmit}
				
				control={control}
				cardConfig={[
					{
						id: "lang",
						title: t("SocialMedia Information"),
						multiLang: true,
						width: 6,
					},
				]}
				inputs={inputs}
			/>
	);
}

  