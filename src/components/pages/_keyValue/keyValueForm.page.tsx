import CustomForm from "@/components/common/Form/CustomForm";
import type { KeyValueFormType, KeyValueType } from "./keyValue.schema";
import useKeyValueLogic from "./useKeyValueForm.logic";
import { testKeyValueForm } from "./keyValue-check-form-validation";

export default function KeyValueFormPage({
  data,
  type
}: {
  type: KeyValueFormType;
  data?: KeyValueType;
}) {
	const { inputs, t, control, formSubmit } = useKeyValueLogic({ data, type });
	testKeyValueForm(type);

	return (
		<CustomForm
			handleSubmit={formSubmit}
			control={control}
			cardConfig={[
				{
					id: "lang",
					title: t("KeyValue Information"),
					multiLang: true,
					width: 6,
				},
			]}
			inputs={inputs}
		/>
	);
}
