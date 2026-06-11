import CustomForm from "@/components/common/Form/CustomForm";
import type { DeliveryType } from "./delivery.schema";
import useDeliveryLogic from "./useDeliveryForm.logic";

export default function DeliveryFormPage({ data }: { data?: DeliveryType }) {
	const { inputs, t, control, formSubmit } = useDeliveryLogic({ data });

	return (
		<CustomForm
			handleSubmit={formSubmit}

			control={control}
			cardConfig={[
				{
					id: "lang",
					title: t("Delivery Information"),
					multiLang: true,
					width: 6,
				},
			]}
			inputs={inputs}
		/>
	);
}

