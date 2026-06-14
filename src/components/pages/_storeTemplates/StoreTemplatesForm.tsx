import CustomForm from "@/components/common/Form/CustomForm";
import useStoreTemplatesLogic from "./useStoreTemplatesForm.logic";
import { StoreTemplateBuilder } from "./StoreTemplateBuilder";

export default function StoreTemplatesForm({
  data
}: {
  data?: any;
}) {
  const { control, formSubmit, inputs, lang, t } = useStoreTemplatesLogic({ data });

  return (
    <CustomForm
      btnName={t(data ? "edit" : "save")}
      control={control as any}
      handleSubmit={formSubmit}
      inputs={inputs}
      changeLang={lang}
      cardConfig={[
        {
          id: "info",
          title: t("storeTemplateInfo"),
          multiLang: true,
          width: 6
        }
      ]}
    >
      <StoreTemplateBuilder control={control as any} lang={lang as string} />
    </CustomForm>
  );
}
