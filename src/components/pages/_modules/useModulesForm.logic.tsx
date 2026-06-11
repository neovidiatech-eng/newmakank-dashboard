
import useFormErrorLang from "@/components/common/Form/hooks/useFormErrorLang";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { ModulesInputs } from "./modules.inputs";
import { ModulesSchema, type ModulesType } from "./modules.schema";
;

export default function useModulesLogic({ data }: { data?: ModulesType }) {
	const t = useTranslations();
  const formAction = useFormAction();
	const inputs = ModulesInputs();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ModulesType>({
		mode: "onSubmit",
		resolver: zodResolver(ModulesSchema(t)),
		defaultValues: extractFormDefaultInputs(inputs, data) as ModulesType,
	});
	const onSubmit = async (formData: ModulesType) => {
		await formAction({
			data,
			formData: extractFormNameInputs({ inputs, data: formData }),
			endpoint: ['modules'],
			t,
		});
	};

	const formSubmit = handleSubmit(onSubmit);
	const { lang } = useFormErrorLang({
		errors,
		name: ['description']
	})
	return {
		lang,
		control,
		inputs,
		formSubmit,
		t
	};
}

