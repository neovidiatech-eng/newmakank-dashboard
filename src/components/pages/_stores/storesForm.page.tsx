import CustomForm from "@/components/common/Form/CustomForm";
import { Clock, Info, MapPin, Store, User } from "lucide-react";
import type { StoresType } from "./stores.schema";
import useStoresLogic from "./useStoresForm.logic";

export default function StoresFormPage({ data }: { data?: StoresType }) {
	const { inputs, t, control, formSubmit, lang } = useStoresLogic({ data });
	console.log(!!data);
	return (
		<CustomForm
			handleSubmit={formSubmit}
			changeLang={lang}
			control={control}
			cardConfig={[
				{
					id: "lang",
					title: t("Stores Information"),
					multiLang: true,
					width: 6,
					icon: <Store className="size-4" />,
				},
				{
					id: "info",
					title: t("Store Details"),
					width: 6,
					icon: <Info className="size-4" />,
				},
				{
					id: "operations",
					title: t("Operations & Orders Settings") || "إعدادات التشغيل والطلبات",
					width: 6,
					icon: <Clock className="size-4" />,
				},
				{
					id: "location",
					title: t("Map Information"),
					width: 6,
					icon: <MapPin className="size-4" />,
				},
				{
					id: "user",
					title: t("Store Owner"),
					width: 6,
					icon: <User className="size-4" />,
				},
			]}
			inputs={inputs}
		/>
	);
}

