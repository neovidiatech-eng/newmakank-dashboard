import useFormErrorLang from "@/components/common/Form/hooks/useFormErrorLang";
import { fetchHelper } from "@/api/fetch";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { getEnv } from "@/lib/env";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { ServicesInputs } from "./services.inputs";
import { ServicesSchema, type ServicesType } from "./services.schema";
import { EMPTY_OFFER_VALUE, type OfferSectionValue } from "./OfferSection";

// Bundles are a separate backend entity (no offer field lives on Service itself) — find
// whichever bundle (if any) already references this product, regardless of whether it's
// in the paid or free scope, so editing a product that's already an offer shows it as such.
function extractScopeServiceIds(bundle: any): number[] {
  const scope = bundle?.ScopeServices;
  if (!scope) return [];
  const list = Array.isArray(scope) ? scope : [scope];
  return list
    .map((entry: any) => Number(entry?.serviceId ?? entry?.Service?.id))
    .filter((id: number) => Number.isFinite(id) && id > 0);
}

function toDateInputValue(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

async function resolveBundleImage(image: unknown): Promise<File | undefined> {
  if (image instanceof File) return image;
  if (typeof image === "string" && image.trim() !== "") {
    try {
      const url = image.startsWith("http") ? image : `${getEnv("VITE_API_IMG_URL")}${image}`;
      const response = await fetch(url);
      if (!response.ok) return undefined;
      const blob = await response.blob();
      return new File([blob], "offer-image.png", { type: blob.type || "image/png" });
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export default function useServicesLogic({ data, hideStoreInput }: { data?: ServicesType; hideStoreInput?: boolean }) {
  const t = useTranslations();
  const formAction = useFormAction();
  const inputs = ServicesInputs({
    storeId: data?.storeId as number ?? null,
    hideStore: hideStoreInput
  });
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServicesType>({
    mode: "onSubmit",
    resolver: zodResolver(ServicesSchema(t)),
    defaultValues: {
      ...extractFormDefaultInputs(inputs, data),
      priceBeforeDiscount: data ? (data.priceAfterDiscount ? data.price : "") : undefined,
      priceAfterDiscount: data ? (data.priceAfterDiscount ? data.priceAfterDiscount : data.price) : undefined,
      available: data?.available !== undefined ? String(data.available) : "true",
      Sizes: data?.Sizes?.map((item: any) => {
        const hasDiscount = Boolean(item?.priceAfterDiscount);
        return {
          nameAr: item.nameAr,
          nameEn: item.nameEn,
          priceBeforeDiscount: hasDiscount ? item.price : "",
          priceAfterDiscount: hasDiscount ? item.priceAfterDiscount : item.price,
          isDefault: item.isDefault !== undefined ? String(item.isDefault) : "false"
        };
      }),
      Addons: data?.Addons?.map((item: any) => {
        const hasDiscount = Boolean(item?.priceAfterDiscount);
        return {
          nameAr: item.nameAr,
          nameEn: item.nameEn,
          priceBeforeDiscount: hasDiscount ? item.price : "",
          priceAfterDiscount: hasDiscount ? item.priceAfterDiscount : item.price
        };
      }),
      storeId: (data?.Store as any)?.id
    } as ServicesType
  });

  const [offer, setOffer] = useState<OfferSectionValue>(EMPTY_OFFER_VALUE);
  const [existingBundleId, setExistingBundleId] = useState<number | null>(null);

  // Edit mode: a Bundle is a separate entity, so we have to look it up — fetch this
  // store's bundles and check whether any of them already reference this product.
  useEffect(() => {
    const serviceId = (data as any)?.id;
    const storeId = (data?.Store as any)?.id ?? data?.storeId;
    if (!serviceId || !storeId) return;

    let cancelled = false;
    (async () => {
      const response = await fetchHelper({
        endPoint: ["bundles"],
        method: "GET",
        params: { storeId, limit: 200 }
      });
      if (cancelled) return;
      const bundles = Array.isArray((response as any)?.data) ? (response as any).data : [];
      const match = bundles.find((bundle: any) =>
        extractScopeServiceIds(bundle).includes(Number(serviceId))
      );
      if (match) {
        setExistingBundleId(match.id);
        setOffer({
          isOffer: true,
          requiredPaidQuantity: String(match.requiredPaidQuantity ?? 2),
          freeQuantity: String(match.freeQuantity ?? 1),
          freeServiceIds: extractScopeServiceIds(match).map(String),
          startDate: toDateInputValue(match.startDate),
          endDate: toDateInputValue(match.endDate)
        });
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(data as any)?.id]);

  // Bundles live behind a separate endpoint (`/api/bundles`) — this creates/updates/deletes
  // the linked bundle after the product itself has been saved, since a new product's id is
  // only known once that save succeeds.
  const syncOffer = async (serviceId: number, formattedData: any) => {
    if (!offer.isOffer) {
      if (existingBundleId) {
        await fetchHelper({ endPoint: ["bundles", existingBundleId], method: "DELETE" });
        setExistingBundleId(null);
      }
      return;
    }

    const nameAr = formattedData.nameAr || formattedData.name?.ar || "";
    const nameEn = formattedData.nameEn || formattedData.name?.en || "";
    const bundleImage = await resolveBundleImage(formattedData.image);
    const freeServiceIds =
      offer.freeServiceIds.length > 0 ? offer.freeServiceIds : [String(serviceId)];

    const body = new FormData();
    body.append("title", JSON.stringify({ ar: `عرض على ${nameAr}`, en: `Offer on ${nameEn}` }));
    body.append(
      "description",
      JSON.stringify({
        ar: `اشتري ${offer.requiredPaidQuantity} واخد ${offer.freeQuantity} ببلاش`,
        en: `Buy ${offer.requiredPaidQuantity} get ${offer.freeQuantity} free`
      })
    );
    if (bundleImage) body.append("image", bundleImage);
    body.append("storeId", String(formattedData.storeId));
    body.append("requiredPaidQuantity", offer.requiredPaidQuantity);
    body.append("freeQuantity", offer.freeQuantity);
    body.append("isActive", "true");
    body.append("type", "BUY_X_GET_Y_FREE");
    body.append("paidServiceIds", String(serviceId));
    freeServiceIds.forEach(id => body.append("freeServiceIds", id));
    if (offer.startDate) body.append("startDate", new Date(offer.startDate).toISOString());
    if (offer.endDate) body.append("endDate", new Date(offer.endDate).toISOString());

    await fetchHelper({
      endPoint: existingBundleId ? ["bundles", existingBundleId] : ["bundles"],
      method: existingBundleId ? "PATCH" : "POST",
      body
    });
  };

  const onSubmit = async (formData: ServicesType) => {
    let finalImage = formData.image;
    if (formData.storeId == null) {
      formData.storeId = data?.storeId as number;
    }
    delete formData.Store;
    
    if (!(data as any)?.id) {
      const hasImage =
        formData.image &&
        (formData.image instanceof File ||
          formData.image instanceof Blob ||
          (Array.isArray(formData.image) && formData.image.length > 0) ||
          (typeof formData.image === "string" && formData.image.trim() !== ""));

      if (!hasImage) {
        try {
          const response = await fetch("/logo.png");
          if (response.ok) {
            const blob = await response.blob();
            finalImage = new File([blob], "logo.png", { type: "image/png" });
          }
        } catch (error) {
          console.error("Failed to fetch default logo.png:", error);
        }
      }
    }

    const hasGlobalDiscount = Boolean(formData.priceBeforeDiscount && Number(formData.priceBeforeDiscount) > 0);

    const formattedData = {
      ...formData,
      image: finalImage,
      price: hasGlobalDiscount ? Number(formData.priceBeforeDiscount) : Number(formData.priceAfterDiscount),
      priceAfterDiscount: hasGlobalDiscount ? Number(formData.priceAfterDiscount) : undefined,
      available: formData.available === "true" || formData.available === true,
      Sizes: JSON.stringify(
        formData.Sizes?.map(item => {
          const hasDiscount = Boolean(item.priceBeforeDiscount && Number(item.priceBeforeDiscount) > 0);
          const finalPrice = hasDiscount ? Number(item.priceBeforeDiscount) : Number(item.priceAfterDiscount);
          const finalDiscount = hasDiscount ? Number(item.priceAfterDiscount) : undefined;
          return {
            name: {
              ar: item.nameAr,
              en: item.nameEn
            },
            price: finalPrice,
            priceAfterDiscount: finalDiscount,
            isDefault: item.isDefault === "true" || item.isDefault === true
          };
        })
      ),
      Addons: JSON.stringify(
        formData.Addons?.map(item => {
          const hasDiscount = Boolean(item.priceBeforeDiscount && Number(item.priceBeforeDiscount) > 0);
          const finalPrice = hasDiscount ? Number(item.priceBeforeDiscount) : Number(item.priceAfterDiscount);
          const finalDiscount = hasDiscount ? Number(item.priceAfterDiscount) : undefined;
          return {
            name: {
              ar: item.nameAr,
              en: item.nameEn
            },
            price: finalPrice,
            priceAfterDiscount: finalDiscount
          };
        })
      )
    };

    delete (formattedData as any).priceBeforeDiscount;
    const res = await formAction({
      data,
      formData: extractFormNameInputs({ inputs, data: formattedData }),
      endpoint: ["services"],
      t,
      customReset: () => {
        reset({
          nameAr: "",
          nameEn: "",
          descriptionAr: "",
          descriptionEn: "",
          image: undefined,
          durationMinutes: "",
          priceBeforeDiscount: "",
          priceAfterDiscount: "",
          status: "",
          available: "true",
          storeId: hideStoreInput ? data?.storeId : undefined,
          categoryId: undefined,
          Sizes: [],
          Addons: []
        } as any);
        sizesReplace([]);
        addonsReplace([]);
        setOffer(EMPTY_OFFER_VALUE);
        setExistingBundleId(null);
      }
    });

    const serviceId = (data as any)?.id ?? (res as any)?.data?.id;
    if (res?.success && serviceId) {
      await syncOffer(Number(serviceId), formattedData);
    }
  };

  const formSubmit = handleSubmit(onSubmit);
  const { lang } = useFormErrorLang({
    errors,
    name: ["name", "description"]
  });
  const {
    fields: sizesFields,
    append: sizesAppend,
    remove: sizesRemove,
    replace: sizesReplace
  } = useFieldArray({
    control,
    name: "Sizes"
  });
  const {
    fields: addonsFields,
    append: addonsAppend,
    remove: addonsRemove,
    replace: addonsReplace
  } = useFieldArray({
    control,
    name: "Addons"
  });
  const importServiceData = (serviceData: any) => {
    const normalizedData = {
      ...serviceData,
      nameAr: serviceData?.name?.ar ?? "",
      nameEn: serviceData?.name?.en ?? "",
      descriptionAr: serviceData?.description?.ar ?? "",
      descriptionEn: serviceData?.description?.en ?? "",
      image: serviceData?.image ?? "",
      durationMinutes: serviceData?.durationMinutes ?? 0,
      price: serviceData?.price ?? 0,
      priceBeforeDiscount:
        serviceData?.priceAfterDiscount || serviceData?.salePrice || serviceData?.offerPrice
          ? (serviceData?.price ?? "")
          : "",
      priceAfterDiscount:
        serviceData?.priceAfterDiscount ??
        serviceData?.salePrice ??
        serviceData?.offerPrice ??
        serviceData?.price ??
        "",
      status: serviceData?.status,
      available:
        serviceData?.available !== undefined
          ? String(serviceData.available)
          : serviceData?.isAvailable !== undefined
            ? String(serviceData.isAvailable)
            : "true",
      storeId: hideStoreInput ? (data?.storeId as number) : (serviceData?.Store?.id ?? serviceData?.storeId),
      categoryId: serviceData?.Category?.id ?? serviceData?.categoryId,
      Sizes: serviceData?.Sizes?.map((item: any) => {
        const hasDiscount = Boolean(item?.priceAfterDiscount || item?.salePrice || item?.offerPrice);
        return {
          nameAr: item?.name?.ar ?? "",
          nameEn: item?.name?.en ?? "",
          priceBeforeDiscount: hasDiscount ? (item?.price ?? "") : "",
          priceAfterDiscount: item?.priceAfterDiscount ?? item?.salePrice ?? item?.offerPrice ?? item?.price ?? "",
          isDefault: item?.isDefault !== undefined ? String(item.isDefault) : "false"
        };
      }) ?? [],
      Addons: serviceData?.Addons?.map((item: any) => {
        const hasDiscount = Boolean(item?.priceAfterDiscount || item?.salePrice || item?.offerPrice);
        return {
          nameAr: item?.name?.ar ?? "",
          nameEn: item?.name?.en ?? "",
          priceBeforeDiscount: hasDiscount ? (item?.price ?? "") : "",
          priceAfterDiscount: item?.priceAfterDiscount ?? item?.salePrice ?? item?.offerPrice ?? item?.price ?? ""
        };
      }) ?? []
    };

    reset(normalizedData as ServicesType);
    sizesReplace(normalizedData.Sizes);
    addonsReplace(normalizedData.Addons);
  };

  return {
    lang,
    control,
    inputs,
    formSubmit,
    sizesFields,
    sizesAppend,
    sizesRemove,
    sizesReplace,
    setValue,
    watch,
    addonsFields,
    addonsAppend,
    addonsRemove,
    importServiceData,
    offer,
    setOffer,
    t
  };
}
