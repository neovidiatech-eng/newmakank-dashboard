
import useFormErrorLang from "@/components/common/Form/hooks/useFormErrorLang";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ZonesInputs } from "./zones.inputs";
import { ZonesSchema, type ZonesType } from "./zones.schema";

export default function useZonesLogic({ data }: { data?: ZonesType }) {
	const t = useTranslations();
  const formAction = useFormAction();
	const inputs = ZonesInputs();
	const {
		control,
		formState: { errors },
		handleSubmit,
	} = useForm<ZonesType>({
		mode: "onSubmit",
		resolver: zodResolver(ZonesSchema(t)),
		defaultValues: {
			...extractFormDefaultInputs(inputs, data),
			coordinates: data?.coordinates ?? []
		} as ZonesType,
	});

	const onSubmit = async (formData: ZonesType) => {
		if (formData.coordinates.length <= 2) {
			toast.error(t("Please add at least one coordinate"));
			return;
		}
		await formAction({
			data,
			formData: extractFormNameInputs({ inputs, data: formData }),
			endpoint: ['zones'],
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

