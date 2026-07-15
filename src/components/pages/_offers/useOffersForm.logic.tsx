import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { useFormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { OffersInputs } from "./offers.inputs";
import { OffersSchema, type OffersType } from "./offers.schema";

const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map(item => String((item as any)?.value ?? item));
  if (value === undefined || value === null || value === "") return [];
  return [String(value)];
};

export default function useOffersLogic({ data }: { data?: OffersType }) {
  const t = useTranslations();
  const formAction = useFormAction();

  const {
    control,
    handleSubmit,
    reset,
    watch
  } = useForm<OffersType>({
    mode: "onSubmit",
    resolver: zodResolver(OffersSchema(t)),
    defaultValues: {
      ...extractFormDefaultInputs(OffersInputs({ storeId: data?.storeId as number }), data),
      isActive: data?.isActive !== undefined ? String(data.isActive) : "true",
      paidSizeRule: (data as any)?.paidSizeRule || "ANY",
      paidRequiredSizeName: (data as any)?.paidRequiredSizeName || "",
      freeSizeRule: (data as any)?.freeSizeRule || "ANY",
      freeRequiredSizeName: (data as any)?.freeRequiredSizeName || "",
      freeValueRule: (data as any)?.freeValueRule || "CAP_TO_CHEAPEST_PAID",
      maxFreeItemValue: (data as any)?.maxFreeItemValue !== undefined && (data as any)?.maxFreeItemValue !== null ? String((data as any).maxFreeItemValue) : "",
    } as OffersType
  });

  const paidSizeRule = watch("paidSizeRule");
  const freeSizeRule = watch("freeSizeRule");
  const freeValueRule = watch("freeValueRule");

  const inputs = OffersInputs({
    storeId: data?.storeId as number,
    paidSizeRule,
    freeSizeRule,
    freeValueRule
  });

  const onSubmit = async (formData: OffersType) => {
    let finalImage: unknown = (formData as any).image;
    const hasImage =
      finalImage instanceof File ||
      finalImage instanceof Blob ||
      (typeof finalImage === "string" && finalImage.trim() !== "");

    if (!(data as any)?.id && !hasImage) {
      try {
        const response = await fetch("/logo.png");
        if (response.ok) {
          const blob = await response.blob();
          finalImage = new File([blob], "logo.png", { type: "image/png" });
        }
      } catch {
        // no default image available — backend will reject if truly required and missing
      }
    }

    const body = new FormData();
    body.append("title", JSON.stringify({ ar: (formData as any).titleAr, en: (formData as any).titleEn }));
    body.append(
      "description",
      JSON.stringify({ ar: (formData as any).descriptionAr, en: (formData as any).descriptionEn })
    );
    if (finalImage instanceof File || finalImage instanceof Blob) {
      body.append("image", finalImage);
    }
    body.append("storeId", String(formData.storeId));
    body.append("isActive", String(formData.isActive === "true" || formData.isActive === true));
    body.append("type", "BUY_X_GET_Y_FREE");
    body.append("requiredPaidQuantity", String(formData.requiredPaidQuantity));
    body.append("freeQuantity", String(formData.freeQuantity));

    toArray(formData.paidServiceIds).forEach(id => body.append("paidServiceIds", id));
    toArray(formData.freeServiceIds).forEach(id => body.append("freeServiceIds", id));

    body.append("paidSizeRule", String(formData.paidSizeRule ?? "ANY"));
    if (formData.paidSizeRule === "NAME" && formData.paidRequiredSizeName) {
      body.append("paidRequiredSizeName", formData.paidRequiredSizeName);
    }
    body.append("freeSizeRule", String(formData.freeSizeRule ?? "ANY"));
    if (formData.freeSizeRule === "NAME" && formData.freeRequiredSizeName) {
      body.append("freeRequiredSizeName", formData.freeRequiredSizeName);
    }
    body.append("freeValueRule", String(formData.freeValueRule ?? "CAP_TO_CHEAPEST_PAID"));
    if (formData.freeValueRule === "MAX_FREE_VALUE" && formData.maxFreeItemValue !== undefined && formData.maxFreeItemValue !== null) {
      body.append("maxFreeItemValue", String(formData.maxFreeItemValue));
    }

    if ((formData as any).startDate) {
      body.append("startDate", new Date((formData as any).startDate).toISOString());
    }
    if ((formData as any).endDate) {
      body.append("endDate", new Date((formData as any).endDate).toISOString());
    }

    await formAction({
      data,
      formData: body as any,
      endpoint: ["bundles"],
      t,
      reset
    });
  };

  const formSubmit = handleSubmit(onSubmit);

  return {
    control,
    inputs,
    formSubmit,
    t
  };
}
