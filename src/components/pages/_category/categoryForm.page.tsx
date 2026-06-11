import CustomForm from "@/components/common/Form/CustomForm";
import { endpointType } from "@/utils/endpoints";
import type { CategoryType } from "./category.schema";
import useCategoryLogic from "./useCategoryForm.logic";

export default function CategoryFormPage({
  data,
  endpoint
}: {
  data?: CategoryType;
  endpoint?: endpointType;
}) {
  const { inputs, t, control, formSubmit } = useCategoryLogic({
    data,
    endpoint
  });

  return (
    <CustomForm
      handleSubmit={formSubmit}
      control={control}
      cardConfig={[
        {
          id: "lang",
          title: t("Category Information"),
          multiLang: true,
          width: 6
        }
      ]}
      inputs={inputs}
    />
  );
}
