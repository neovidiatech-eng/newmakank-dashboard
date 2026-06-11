import CustomForm from "@/components/common/Form/CustomForm";
import type { ScheduleType } from "./schedule.schema";
import useScheduleLogic from "./useScheduleForm.logic";

type ScheduleFormPageProps = {
  data?: ScheduleType & { id?: number | string };
  branchId?: string;
  deliveryId?: string;
  onSuccess?: () => void;
  redirectOnSuccess?: boolean;
};

export default function ScheduleFormPage({
  data,
  branchId,
  deliveryId,
  onSuccess
}: ScheduleFormPageProps) {
  const { inputs, t, control, formSubmit } = useScheduleLogic({
    data,
    branchId,
    deliveryId,
    onSuccess
  });

  return (
    <CustomForm
      handleSubmit={formSubmit}
      control={control}
      cardConfig={[
        {
          id: "lang",
          title: t("Schedule Information"),
          multiLang: true,
          width: 6
        }
      ]}
      inputs={inputs}
    />
  );
}
