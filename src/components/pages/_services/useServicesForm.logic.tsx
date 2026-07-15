import useFormErrorLang from "@/components/common/Form/hooks/useFormErrorLang";
import { extractFormDefaultInputs } from "@/utils/extractFormDefaultInputs";
import { extractFormNameInputs } from "@/utils/extractFormNameInputs";
import { useFormAction } from "@/utils/FormActions";
import { getEnv } from "@/lib/env";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "@/lib/i18n";
import { useFieldArray, useForm } from "react-hook-form";
import { ServicesInputs } from "./services.inputs";
import { ServicesSchema, type ServicesType } from "./services.schema";

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
    await formAction({
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
      }
    });
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
  const importServiceData = async (serviceData: any) => {
    // If there is an image path, resolve it to a binary File object so it can be re-uploaded.
    let resolvedImageFile: File | undefined = undefined;
    if (serviceData?.image && typeof serviceData.image === "string") {
      try {
        const url = serviceData.image.startsWith("http") 
          ? serviceData.image 
          : `${getEnv("VITE_API_IMG_URL")}${serviceData.image}`;
        const imgResponse = await fetch(url);
        if (imgResponse.ok) {
          const blob = await imgResponse.blob();
          const fileName = serviceData.image.split("/").pop() || "product-image.png";
          resolvedImageFile = new File([blob], fileName, { type: blob.type || "image/png" });
        }
      } catch (err) {
        console.error("Failed to resolve imported product image to file:", err);
      }
    }

    const normalizedData = {
      ...serviceData,
      nameAr: serviceData?.name?.ar ?? "",
      nameEn: serviceData?.name?.en ?? "",
      descriptionAr: serviceData?.description?.ar ?? "",
      descriptionEn: serviceData?.description?.en ?? "",
      image: resolvedImageFile ?? serviceData?.image ?? "",
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
    t
  };
}
