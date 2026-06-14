
import useFormErrorLang from "@/components/common/Form/hooks/useFormErrorLang";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm, useWatch } from "react-hook-form";
import { CouponsInputs } from "./coupons.inputs";
import { CouponsSchema, type CouponsType } from "./coupons.schema";
;

export default function useCouponsLogic({ data }: { data?: CouponsType }) {
	const t = useTranslations();
  const formAction = useFormAction();
	const defaultInputs = CouponsInputs(data?.type as any);
	const {
		control,
		formState: { errors },
		handleSubmit,
	} = useForm<CouponsType>({
		mode: "onSubmit",
		resolver: zodResolver(CouponsSchema(t)),
		defaultValues: extractFormDefaultInputs(defaultInputs, {
			...data,
			specialDelivery: data?.type === "SPECIAL_DRIVER" ? ["true"] : undefined,
			type: data?.type === "SPECIAL_DRIVER" ? "ALL_USERS" : data?.type // fallback type for the UI
		}) as CouponsType,
	});

	const couponType = useWatch({ control, name: "type" });
	const inputs = CouponsInputs(couponType as any);

	const onSubmit = async (formData: CouponsType) => {
		const isSpecialDelivery = Array.isArray(formData.specialDelivery)
			? formData.specialDelivery.includes("true")
			: Boolean(formData.specialDelivery);

		const normalizedData = {
			usageCount: 0,
			...formData,
			type: isSpecialDelivery ? "SPECIAL_DRIVER" : formData.type,
			specialDelivery: undefined,
			userIds: formData.type === "USER_WISE" ? formData.userIds : undefined,
			storeIds: formData.type === "STORE_WISE" ? formData.storeIds : undefined,
			zoneIds: formData.type === "ZONE_WISE" ? formData.zoneIds : undefined,
			customerCategoryIds: formData.type === "CUSTOMER_CATEGORY_WISE" ? formData.customerCategoryIds : undefined,
		}

		Object.keys(normalizedData).forEach(key => {
			const value = normalizedData[key as keyof typeof normalizedData];
			if (value === undefined || value === null || value === "") {
				delete normalizedData[key as keyof typeof normalizedData];
			}
			if (Array.isArray(value) && value.length === 0 && (key !== "zoneIds" || !(data as any)?.id)) {
				delete normalizedData[key as keyof typeof normalizedData];
			}
		});

		await formAction({
			data,
			formData: extractFormNameInputs({ inputs, data: normalizedData }),
			endpoint: ['coupons'],
			t,
		});
	};

	const formSubmit = handleSubmit(onSubmit);
	const { lang } = useFormErrorLang({
		errors,
		name: ['name']
	})
	return {
		lang,
		control,
		inputs,
		formSubmit,
		t
	};
}
