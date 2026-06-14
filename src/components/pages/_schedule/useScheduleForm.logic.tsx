"use client";

import { fetchHelper } from "@/api/fetch";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ScheduleInputs } from "./schedule.inputs";
import { ScheduleSchema, type ScheduleType } from "./schedule.schema";

type ScheduleFormData = ScheduleType & { id?: number | string };

export default function useScheduleLogic({
  data,
  branchId,
  deliveryId,
  onSuccess
}: {
  data?: ScheduleFormData;
  branchId?: string;
  deliveryId?: string;
  onSuccess?: () => void;
}) {
  const t = useTranslations();
  const formAction = useFormAction();
  //   const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(
  //     branchId ? Number(branchId) : data?.branchId ? Number(data.branchId) : undefined
  //   );
  //   const handleBranchChange = useCallback((value: Option[] | string) => {
  //     const branchValue = Array.isArray(value) ? value?.[0] : value;
  //     setSelectedBranchId(branchValue ? Number(branchValue) : undefined);
  //   }, []);
  const inputs = ScheduleInputs({
    branchId,
    // onBranchChange: handleBranchChange,
    deliveryId
  });
  const defaultValues = extractFormDefaultInputs(inputs, data) as any;
  if (data?.openingTime === "00:00" && data?.closingTime === "23:59") {
    defaultValues.is24Hours = ["true"];
  }

  const {
    control,

    handleSubmit,
    reset,
    watch,
    setValue
  } = useForm<ScheduleType>({
    mode: "onSubmit",
    resolver: zodResolver(ScheduleSchema(t, branchId, deliveryId)),
    defaultValues
  });

  const is24Hours = watch("is24Hours" as any);
  const is24HoursChecked = Array.isArray(is24Hours) && is24Hours.includes("true");

  useEffect(() => {
    if (is24HoursChecked) {
      setValue("openingTime", "00:00");
      setValue("closingTime", "23:59");
    }
  }, [is24HoursChecked, setValue]);

  //   useEffect(() => {
  //     if (branchId) {
  //       setSelectedBranchId(Number(branchId));
  //     }
  //   }, [branchId]);

  // useEffect(() => {
  // 	let isMounted = true;
  // 	const loadScheduleDays = async () => {
  // 		// if neither branch nor delivery are selected, show all days
  // 		if (!selectedBranchId && !deliveryId) {
  // 			if (isMounted) {
  // 				setDayOptions(daysOptions(t));
  // 			}
  // 			return;
  // 		}

  // 		let response: any;
  // 		if (selectedBranchId) {
  // 			response = await fetchHelper({
  // 				endPoint: ["schedule", selectedBranchId],
  // 				method: "GET",
  // 			});
  // 		} else if (deliveryId) {
  // 			response = await fetchHelper({
  // 				endPoint: ["deliverySchedule", Number(deliveryId)],
  // 				method: "GET",
  // 			});
  // 		}

  // 		if (!isMounted) return;
  // 		const scheduledDays = new Set(
  // 			(response?.data || []).map((item: { day?: string }) =>
  // 				String(item.day || "").toUpperCase()
  // 			)
  // 		);
  // 		const currentDay = String(data?.day || "").toUpperCase();
  // 		const filteredDays = daysOptions(t).filter(
  // 			day => {
  // 				const dayValue = String(day.value).toUpperCase();
  // 				return !scheduledDays.has(dayValue) || dayValue === currentDay;
  // 			}
  // 		);
  // 		setDayOptions(filteredDays);
  // 	};
  // 	loadScheduleDays();
  // 	return () => {
  // 		isMounted = false;
  // 	};
  // }, [selectedBranchId, deliveryId, t]);

  const onSubmit = async (formData: ScheduleType) => {
    if (branchId) formData.branchId = Number(branchId);
    if (deliveryId) (formData as any).deliveryId = Number(deliveryId);

    if ((formData as any).is24Hours?.includes("true")) {
      formData.openingTime = "00:00";
      formData.closingTime = "23:59";
    }

    // Remove is24Hours from formData before sending to API
    delete (formData as any).is24Hours;

    if (data?.id) {
      await fetchHelper({
        endPoint: ["schedule", Number(data.id)],
        method: "DELETE"
      });
    }

    const response = await formAction({
      data: undefined,
      formData: extractFormNameInputs({ inputs, data: formData }),
      endpoint: deliveryId ? ["deliverySchedule"] : ["schedule"],
      reset: reset,

      t
    });

    if (response?.success && onSuccess) {
      onSuccess();
    }
  };

  const formSubmit = handleSubmit(onSubmit);

  return {
    control,
    inputs,
    formSubmit,
    t
  };
}
