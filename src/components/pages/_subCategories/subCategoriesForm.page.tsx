import CustomForm from "@/components/common/Form/CustomForm";
import type { SubCategoriesType } from "./subCategories.schema";
import useSubCategoriesLogic from "./useSubCategoriesForm.logic";

export default function SubCategoriesFormPage({ data, storeId }: { data?: SubCategoriesType, storeId: number }) {
	const { inputs, t, control, formSubmit } = useSubCategoriesLogic({ data, storeId });

	return (
		<CustomForm
			handleSubmit={formSubmit}

			control={control}
			cardConfig={[
				{
					id: "lang",
					title: t("SubCategories Information"),
					multiLang: true,
					width: 6,
				},
				{
					id: "basic",
					title: t("Image"),
					width: 6,
				},
			]}
			inputs={inputs}
		/>
	);
}
