"use client";

import CustomForm from "@/components/common/Form/CustomForm";
import { OffersInputs } from "@/components/pages/_offers/offers.inputs";
import { OffersSchema, type OffersType } from "@/components/pages/_offers/offers.schema";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { FormAction } from "@/utils/FormActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { useRouter } from "@/lib/navigation";
import { toast } from "sonner";
import { endLoading, startLoading } from "@/lib/global-loading";

interface StoreOfferCreatePageProps {
  storeId: number;
}

export default function StoreOfferCreatePage({ storeId }: StoreOfferCreatePageProps) {
  const t = useTranslations();
  const router = useRouter();

  const allInputs = OffersInputs({ storeId });

  // Hide the storeId select — it's fixed to this store's context
  const inputs = allInputs.filter(input => input.name !== "storeId");

  const { control, handleSubmit, reset } = useForm<OffersType>({
    mode: "onSubmit",
    resolver: zodResolver(OffersSchema(t)),
    defaultValues: {
      ...extractFormDefaultInputs(inputs, undefined),
      storeId: storeId as any,
      isActive: "true"
    } as OffersType
  });

  const toArray = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.map(item => String((item as any)?.value ?? item));
    if (value === undefined || value === null || value === "") return [];
    return [String(value)];
  };

  const onSubmit = async (formData: OffersType) => {
    let finalImage: unknown = (formData as any).image;
    const hasImage =
      finalImage instanceof File ||
      finalImage instanceof Blob ||
      (typeof finalImage === "string" && finalImage.trim() !== "");

    if (!hasImage) {
      try {
        const response = await fetch("/logo.png");
        if (response.ok) {
          const blob = await response.blob();
          finalImage = new File([blob], "logo.png", { type: "image/png" });
        }
      } catch {
        // fallback — backend will validate
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
    body.append("storeId", String(storeId));
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

    startLoading();
    const res = await FormAction({
      data: undefined,
      formData: body as any,
      endpoint: ["bundles"],
      t,
      reset
    });
    endLoading();

    if (res?.success) {
      toast.success(t("Success"), { id: "success-toast" });
      const { queryClient } = await import("@/lib/queryClient");
      queryClient.clear();
      // Stay within the store the offer was created for; only fall back to the
      // general offers list if this page is ever reached without a valid store.
      if (Number.isFinite(storeId) && storeId > 0) {
        router.push(`/stores/${storeId}?tab=offers`);
      } else {
        router.push(`/offers`);
      }
    }
  };

  return (
    <CustomForm
      handleSubmit={handleSubmit(onSubmit)}
      control={control}
      cardConfig={[
        { id: "lang", title: t("Offers Information"), multiLang: true, width: 6 },
        { id: "basic", title: t("Basic Details"), width: 6 },
        { id: "associations", title: t("Associations"), width: 12 }
      ]}
      inputs={inputs}
    />
  );
}
