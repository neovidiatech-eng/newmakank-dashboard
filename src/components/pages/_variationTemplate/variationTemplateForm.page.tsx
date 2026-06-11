import CustomForm from "@/components/common/Form/CustomForm";
import useVariationTemplateLogic from "./useVariationTemplateForm.logic";
import { testVariationTemplateForm } from "./variationTemplate-check-form-validation";
import type { VariationTemplateType } from "./variationTemplate.schema";

export default function VariationTemplateFormPage({
  data
}: {
  data?: VariationTemplateType;
}) {
  const { inputs, t, control, formSubmit } = useVariationTemplateLogic({
    data
  });
  testVariationTemplateForm();

  return (
    <CustomForm
      handleSubmit={formSubmit}
      control={control}
      cardConfig={[
        {
          id: "lang",
          title: t("VariationTemplate Information"),
          multiLang: true,
          width: 6
        }
      ]}
      inputs={inputs}
    />
  );
}
