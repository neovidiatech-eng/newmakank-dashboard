import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { VariationTemplateInputs } from "./variationTemplate.inputs";
import { VariationTemplateSchema, type VariationTemplateType } from "./variationTemplate.schema";

export default function useVariationTemplateLogic({ data }: { data?: VariationTemplateType }) {
  const t = useTranslations();
  const inputs = VariationTemplateInputs();
  const formAction = useFormAction();
  const {
    control,
    handleSubmit
  } = useForm<VariationTemplateType>({
    mode: "onSubmit",
    resolver: zodResolver(VariationTemplateSchema(t)),
    defaultValues: {
      ...extractFormDefaultInputs(inputs, data),
      values: (data as any)?.values ?? []
    } as VariationTemplateType
  });
  const onSubmit = async (formData: VariationTemplateType) => {
    await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formData }),
      endpoint: ["variationTemplate"],
      t
    });
  };

  const formSubmit = handleSubmit(onSubmit);

  return {
    control,
    inputs,
    formSubmit,
    t
  };
}
