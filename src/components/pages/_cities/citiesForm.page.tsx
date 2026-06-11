import CustomForm from "@/components/common/Form/CustomForm";
import { testCitiesForm } from "./cities-check-form-validation";
import type { CitiesType } from "./cities.schema";
import useCitiesLogic from "./useCitiesForm.logic";

export default function CitiesFormPage({ data }: { data?: CitiesType }) {
  const { inputs, t, control, formSubmit, lang } = useCitiesLogic({ data });
  testCitiesForm();

  return (
    <CustomForm
      handleSubmit={formSubmit}
      control={control}
      changeLang={lang}
      cardConfig={[
        {
          id: "lang",
          title: t("Cities Information"),
          multiLang: true,
          width: 6
        }
      ]}
      inputs={inputs}
    />
  );
}
