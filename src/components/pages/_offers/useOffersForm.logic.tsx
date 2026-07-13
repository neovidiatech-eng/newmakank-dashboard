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
  const inputs = OffersInputs({ storeId: data?.storeId as number });
  const {
    control,
    handleSubmit,
    reset
  } = useForm<OffersType>({
    mode: "onSubmit",
    resolver: zodResolver(OffersSchema(t)),
    defaultValues: {
      ...extractFormDefaultInputs(inputs, data),
      isActive: data?.isActive !== undefined ? String(data.isActive) : "true"
    } as OffersType
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
