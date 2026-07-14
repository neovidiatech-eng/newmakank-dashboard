import CustomForm from "@/components/common/Form/CustomForm";
import type { OffersType } from "./offers.schema";
import useOffersLogic from "./useOffersForm.logic";

export default function OffersFormPage({ data }: { data?: OffersType }) {
  const { inputs, t, control, formSubmit } = useOffersLogic({ data });

  return (
    <CustomForm
      handleSubmit={formSubmit}
      control={control}
      cardConfig={[
        { id: "lang", title: t("Offers Information"), multiLang: true, width: 6 },
        { id: "basic", title: t("Basic Details"), width: 6 },
        { id: "associations", title: t("Associations"), width: 12 },
        { id: "rules", title: t("Bundle Rules"), width: 12 }
      ]}
      inputs={inputs}
    />
  );
}
