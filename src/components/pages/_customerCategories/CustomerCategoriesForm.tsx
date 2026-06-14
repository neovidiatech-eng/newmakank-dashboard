import CustomForm from "@/components/common/Form/CustomForm";
import useCustomerCategoriesLogic from "./useCustomerCategoriesForm.logic";
import type { CustomerCategoriesType } from "./customerCategories.schema";

export default function CustomerCategoriesForm({
  data
}: {
  data?: CustomerCategoriesType;
}) {
  const { control, formSubmit, inputs, lang, t } = useCustomerCategoriesLogic({ data });

  return (
    <CustomForm
      btnName={t(data ? "edit" : "save")}
      control={control}
      handleSubmit={formSubmit}
      inputs={inputs}
      changeLang={lang}
      cardConfig={[
        {
          id: "info",
          title: t("customerCategoryInfo"),
          multiLang: true,
          width: 6
        }
      ]}
    />
  );
}
