import { fetchHelper } from "@/api/fetch";
import { TabItem } from "@/components/common/CustomTabs/custom-tab";
import CustomForm from "@/components/common/Form/CustomForm";
import CustomGeneratedInputs from "@/components/common/Form/CustomGeneratedInputs";
import SelectPaginatedInput from "@/components/common/Inputs/select/SelectPaginatedInput";
import { Button } from "@/components/ui/button";
import { Copy, Globe, Info, Link, Scale } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { ServicesAddonsInputs, ServicesSizesInputs } from "./services.inputs";
import type { ServicesType } from "./services.schema";
import useServicesLogic from "./useServicesForm.logic";

export default function ServicesFormPage({ data, hideStoreInput }: { data?: ServicesType; hideStoreInput?: boolean }) {
  const {
    inputs,
    t,
    control,
    formSubmit,
    lang,
    sizesFields,
    sizesAppend,
    sizesRemove,
    sizesReplace,
    setValue,
    watch,
    addonsFields,
    addonsAppend,
    addonsRemove,
    importServiceData
  } = useServicesLogic({ data, hideStoreInput });
  const sizesInputs = ServicesSizesInputs();
  const addonsInputs = ServicesAddonsInputs();
  const watchedSizes = watch("Sizes");
  const kiloPrice = watch("Sizes.0.priceAfterDiscount");
  const previousKiloPriceRef = useRef<string | number | undefined>(undefined);
  const isWeightedSizesTemplate =
    (watchedSizes?.length ?? 0) >= 5 &&
    watchedSizes?.[0]?.nameAr === "كيلو" &&
    watchedSizes?.[1]?.nameAr === "كيلو الأربع";

  const buildWeightedSizes = (basePrice: number | string = 0) => {
    const price = Number(basePrice) || 0;
    return [
      { nameAr: "كيلو", nameEn: "Kilo", priceAfterDiscount: price, isDefault: true },
      { nameAr: "كيلو الأربع", nameEn: "Kilo Three Quarters", priceAfterDiscount: price * 0.75, isDefault: false },
      { nameAr: "نص كيلو", nameEn: "Half Kilo", priceAfterDiscount: price / 2, isDefault: false },
      { nameAr: "ربع كيلو", nameEn: "Quarter Kilo", priceAfterDiscount: price / 4, isDefault: false },
      { nameAr: "ثمن كيلو", nameEn: "Eighth Kilo", priceAfterDiscount: price / 8, isDefault: false }
    ];
  };

  const applyWeightedSizes = () => {
    sizesReplace(buildWeightedSizes(kiloPrice));
    previousKiloPriceRef.current = kiloPrice;
  };

  useEffect(() => {
    if (!isWeightedSizesTemplate) {
      previousKiloPriceRef.current = kiloPrice;
      return;
    }

    if (previousKiloPriceRef.current === undefined) {
      previousKiloPriceRef.current = kiloPrice;
      return;
    }

    if (previousKiloPriceRef.current === kiloPrice) return;

    const price = Number(kiloPrice) || 0;
    setValue("Sizes.1.priceAfterDiscount", price * 0.75, { shouldDirty: true });
    setValue("Sizes.2.priceAfterDiscount", price / 2, { shouldDirty: true });
    setValue("Sizes.3.priceAfterDiscount", price / 4, { shouldDirty: true });
    setValue("Sizes.4.priceAfterDiscount", price / 8, { shouldDirty: true });
    previousKiloPriceRef.current = kiloPrice;
  }, [isWeightedSizesTemplate, kiloPrice, setValue]);
  const tabs: TabItem[] = [
    {
      label: t("sizes"),
      value: "sizes",
      content: (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 transition-all duration-200">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {t("Import from Variation Template")}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t(
                  "Select a pre-configured template to automatically add it as a new size option"
                )}
              </p>
            </div>
            <div className="w-full md:w-80">
              <SelectPaginatedInput
                name="variationTemplateImportSizes"
                apiUrl={["variationTemplate"]}
                value=""
                placeholder={t("SelectTemplatePlaceholder")}
                onLabelAction={res => {
                  console.log(res, 'dsa2eds');
                  const filtered = res?.data?.filter((item: any) =>
                    item.values?.some((val: any) => {
                      if (typeof val === "string") return val === "sizes";
                      const nameVal = val?.name;
                      if (typeof nameVal === "string") return nameVal === "sizes";
                      if (nameVal && typeof nameVal === "object") {
                        return nameVal.en === "sizes" || nameVal.ar === "sizes";
                      }
                      return false;
                    })
                  );
                  return { ...res, data: filtered };
                }}
                onChange={async val => {
                  if (!val) return;
                  try {
                    const response = await fetchHelper({
                      endPoint: ["variationTemplate", Number(val)],
                      method: "GET",
                      isLocalized: false
                    });
                    if (response?.data) {
                      const template = response.data;
                      sizesAppend({
                        price: 0,
                        priceAfterDiscount: 0,
                        nameAr: template.name?.ar ?? "",
                        nameEn: template.name?.en ?? ""
                      });
                    }
                  } catch (error) {
                    console.error("Error fetching variation template:", error);
                  }
                }}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Scale className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {t("Add weighted sizes")}
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t("Weighted sizes helper description")}
                </p>
              </div>
            </div>
            <Button type="button" variant="outline" onClick={applyWeightedSizes}>
              <Scale className="h-4 w-4" />
              {t("Add weighted sizes")}
            </Button>
          </div>
          <CustomGeneratedInputs
            control={control}
            generatedInputs={sizesInputs}
            fields={sizesFields}
            append={() => {
              sizesAppend({
                price: 0,
                priceAfterDiscount: 0,
                nameAr: "",
                nameEn: ""
              });
            }}
            remove={sizesRemove}
            name="Sizes"
          />
        </div>
      )
    },
    {
      label: t("addons"),
      value: "addons",
      content: (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 transition-all duration-200">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {t("Import from Variation Template")}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t(
                  "Select a pre-configured template to automatically add it as a new addon option"
                )}
              </p>
            </div>
            <div className="w-full md:w-80">
              <SelectPaginatedInput
                name="variationTemplateImportAddons"
                apiUrl={["variationTemplate"]}
                value=""
                placeholder={t("SelectTemplatePlaceholder")}
                onLabelAction={res => {
                  const filtered = res?.data?.filter((item: any) =>
                    item.values?.some((val: any) => {
                      if (typeof val === "string") return val === "addons";
                      const nameVal = val?.name;
                      if (typeof nameVal === "string") return nameVal === "addons";
                      if (nameVal && typeof nameVal === "object") {
                        return nameVal.en === "addons" || nameVal.ar === "addons";
                      }
                      return false;
                    })
                  );
                  return { ...res, data: filtered };
                }}
                onChange={async val => {
                  if (!val) return;
                  try {
                    const response = await fetchHelper({
                      endPoint: ["variationTemplate", Number(val)],
                      method: "GET",
                      isLocalized: false
                    });
                    if (response?.data) {
                      const template = response.data;
                      addonsAppend({
                        price: 0,
                        priceAfterDiscount: 0,
                        nameAr: template.name?.ar ?? "",
                        nameEn: template.name?.en ?? ""
                      });
                    }
                  } catch (error) {
                    console.error("Error fetching variation template:", error);
                  }
                }}
              />
            </div>
          </div>
          <CustomGeneratedInputs
            control={control}
            generatedInputs={addonsInputs}
            fields={addonsFields}
            append={() => {
              addonsAppend({
                price: 0,
                priceAfterDiscount: 0,
                nameAr: "",
                nameEn: ""
              });
            }}
            remove={addonsRemove}
            name="Addons"
          />
        </div>
      )
    }
  ];
  const importExistingProductSection = !(data as any)?.id ? (
    <div className="flex flex-col gap-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-5 transition-all duration-200 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Copy className="h-5 w-5" />
        </span>
        <div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {t("Import from existing product")}
          </h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {t("SearchProductToCopyDescription")}
          </p>
        </div>
      </div>
      <div className="w-full md:w-96">
        <SelectPaginatedInput
          name="productImport"
          apiUrl={["services"]}
          value=""
          labelFormat="serviceStore"
          placeholder={t("SearchProductToCopy")}
          onChange={async val => {
            if (!val) return;
            try {
              const response = await fetchHelper({
                endPoint: ["services", Number(val)],
                method: "GET",
                isLocalized: false
              });

              if (response?.data) {
                importServiceData(response.data);
                toast.success(t("Product data imported"));
              }
            } catch (error) {
              console.error("Error importing service:", error);
              toast.error(t("Failed to import product data"));
            }
          }}
        />
      </div>
    </div>
  ) : null;

  return (
    <div className="flex flex-col gap-6">
      {importExistingProductSection}
      <CustomForm
        handleSubmit={formSubmit}
        changeLang={lang}
        control={control}
        cardConfig={[
          {
            id: "lang",
            title: t("Services Information"),
            multiLang: true,
            width: 6,
            icon: <Globe className="w-5 h-5" />
          },
          {
            id: "basic",
            title: t("Basic Details"),
            width: 3,
            icon: <Info className="w-5 h-5" />
          },
          {
            id: "associations",
            title: t("Associations"),
            width: 3,
            icon: <Link className="w-5 h-5" />
          }
        ]}
        inputs={inputs}
      >
        <div className="mt-6 flex flex-col gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {t("addons")}
            </h3>
          </div>
          {tabs[1]?.content}
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              {t("sizes")}
            </h3>
          </div>
          {tabs[0]?.content}
        </div>
        </div>
      </CustomForm>
    </div>
  );
}
