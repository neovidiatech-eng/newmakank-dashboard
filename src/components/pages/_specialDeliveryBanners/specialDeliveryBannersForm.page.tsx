import CustomForm from "@/components/common/Form/CustomForm";
import type { SpecialDeliveryBannersType } from "./specialDeliveryBanners.schema";
import useSpecialDeliveryBannersLogic from "./useSpecialDeliveryBannersForm.logic";

export default function SpecialDeliveryBannersFormPage({ data }: { data?: SpecialDeliveryBannersType }) {
  const { inputs, t, control, formSubmit, lang } = useSpecialDeliveryBannersLogic({ data });

  return (
    <CustomForm
      handleSubmit={formSubmit}
      changeLang={lang}
      control={control}
      cardConfig={[
        {
          id: "lang",
          title: t("Special Delivery Banners Information"),
          multiLang: true,
          width: 6,
        },
        {
          id: "targeting",
          title: t("Banner Targeting"),
          width: 6,
        },
        {
          id: "media",
          title: t("Banner Media and Schedule"),
          width: 6,
        },
      ]}
      inputs={inputs}
    />
  );
}
