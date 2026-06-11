import CustomForm from "@/components/common/Form/CustomForm";
import useDeliveryScheduleLogic from "./useDeliveryScheduleForm.logic";

type DeliveryScheduleFormPageProps = {
  deliveryId: string;
  onSuccess?: () => void;
  redirectOnSuccess?: boolean;
};

export default function DeliveryScheduleFormPage({
  deliveryId,
  onSuccess
}: DeliveryScheduleFormPageProps) {
  const { control, formSubmit, inputs, t } = useDeliveryScheduleLogic({
    deliveryId,
    onSuccess
  });

  return (
    <CustomForm
      handleSubmit={formSubmit}
      control={control}
      cardConfig={[
        {
          id: "schedule",
          title: t("Schedule Information"),
          width: 6
        },
        {
          id: "location",
          title: t("Required Location"),
          width: 6
        }
      ]}
      inputs={inputs}
    />
  );
}
