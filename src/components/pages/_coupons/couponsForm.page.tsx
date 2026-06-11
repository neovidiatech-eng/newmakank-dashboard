import CustomForm from "@/components/common/Form/CustomForm";
import { Calendar, Globe, Info, Percent, Shield, Users } from "lucide-react";
import { testCouponsForm } from "./coupons-check-form-validation";
import type { CouponsType } from "./coupons.schema";
import useCouponsLogic from "./useCouponsForm.logic";

export default function CouponsFormPage({ data }: { data?: CouponsType }) {
	const { inputs, t, control, formSubmit, lang } = useCouponsLogic({ data });
	testCouponsForm();

	return (
		<CustomForm
			handleSubmit={formSubmit}
			changeLang={lang}
			control={control}
			cardConfig={[
				{
					id: "lang",
					title: t("Coupons Information"),
					multiLang: true,
					width: 3,
					icon: <Globe className="w-5 h-5" />,
				},
				{
					id: "basic",
					title: t("Basic Information"),
					width: 3,
					icon: <Info className="w-5 h-5" />,
				},
				{
					id: "discount",
					title: t("Discount Settings"),
					width: 6,
					icon: <Percent className="w-5 h-5" />,
				},
				{
					id: "usage",
					title: t("Usage Limits"),
					width: 6,
					icon: <Users className="w-5 h-5" />,
				},
				{
					id: "dates",
					title: t("Validity Period"),
					width: 6,
					icon: <Calendar className="w-5 h-5" />,
				},
				{
					id: "restrictions",
					title: t("Restrictions"),
					width: 6,
					icon: <Shield className="w-5 h-5" />,
				},
			]}
			inputs={inputs}
		/>
	);
}
