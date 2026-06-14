import { useFieldArray, Control, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import type { StoreTemplatesType } from "./storeTemplates.schema";
import { useState } from "react";

export function StoreTemplateBuilder({ control, lang }: { control: Control<StoreTemplatesType>, lang: string }) {
  const t = useTranslations();
  const { fields: categoryFields, append: appendCategory, remove: removeCategory } = useFieldArray({
    control,
    name: "categories"
  });

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("templateCategoriesAndServices")}</h3>
        <Button type="button" onClick={() => appendCategory({ nameAr: "", nameEn: "", order: 0, services: [] })} variant="outline">
          <Plus className="w-4 h-4 mr-2" /> {t("addCategory")}
        </Button>
      </div>

      {categoryFields.map((category, catIndex) => (
        <CategoryItem key={category.id} control={control} catIndex={catIndex} onRemove={() => removeCategory(catIndex)} lang={lang} />
      ))}
    </div>
  );
}

function CategoryItem({ control, catIndex, onRemove, lang }: { control: Control<StoreTemplatesType>, catIndex: number, onRemove: () => void, lang: string }) {
  const t = useTranslations();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-2 font-medium hover:text-primary transition-colors">
          {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          {t("category")} {catIndex + 1}
        </button>
        <Button type="button" onClick={onRemove} variant="destructive" size="sm">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {!collapsed && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Name")} (AR)</label>
              <Input {...control.register(`categories.${catIndex}.nameAr` as const)} placeholder={t("Name") + " AR"} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Name")} (EN)</label>
              <Input {...control.register(`categories.${catIndex}.nameEn` as const)} placeholder={t("Name") + " EN"} />
            </div>
          </div>
          <div className="w-32 space-y-2">
            <label className="text-sm font-medium">{t("sorting Order")}</label>
            <Input type="number" {...control.register(`categories.${catIndex}.order` as const)} placeholder="0" />
          </div>

          <ServicesBuilder control={control} catIndex={catIndex} lang={lang} />
        </>
      )}
    </div>
  );
}

function ServicesBuilder({ control, catIndex, lang }: { control: Control<StoreTemplatesType>, catIndex: number, lang: string }) {
  const t = useTranslations();
  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control,
    name: `categories.${catIndex}.services` as const
  });

  return (
    <div className="ml-4 pl-4 border-l-2 space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-semibold text-muted-foreground">{t("services")}</h5>
        <Button type="button" onClick={() => appendService({ nameAr: "", nameEn: "", descriptionAr: "", descriptionEn: "", image: "", durationMinutes: 5, price: 0, available: true, sizes: [{ nameAr: "", nameEn: "", price: 0, isDefault: true }], addons: [] })} variant="outline" size="sm">
          <Plus className="w-3 h-3 mr-2" /> {t("addService")}
        </Button>
      </div>

      {serviceFields.map((service, srvIndex) => (
        <ServiceItem key={service.id} control={control} catIndex={catIndex} srvIndex={srvIndex} onRemove={() => removeService(srvIndex)} lang={lang} />
      ))}
    </div>
  );
}

function ServiceItem({ control, catIndex, srvIndex, onRemove, lang }: { control: Control<StoreTemplatesType>, catIndex: number, srvIndex: number, onRemove: () => void, lang: string }) {
  const t = useTranslations();
  const [collapsed, setCollapsed] = useState(false);
  const prefix = `categories.${catIndex}.services.${srvIndex}` as const;

  return (
    <div className="p-4 border rounded-md bg-background space-y-4">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
          {collapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          {t("service")} {srvIndex + 1}
        </button>
        <Button type="button" onClick={onRemove} variant="ghost" size="sm" className="text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {!collapsed && (
        <>
          {/* Name fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">{t("Name")} (AR)</label>
              <Input {...control.register(`${prefix}.nameAr` as const)} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">{t("Name")} (EN)</label>
              <Input {...control.register(`${prefix}.nameEn` as const)} />
            </div>
          </div>

          {/* Description fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">{t("Description")} (AR)</label>
              <Input {...control.register(`${prefix}.descriptionAr` as const)} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">{t("Description")} (EN)</label>
              <Input {...control.register(`${prefix}.descriptionEn` as const)} />
            </div>
          </div>

          {/* Image URL (required by API) */}
          <div className="space-y-2">
            <label className="text-xs font-medium">{t("Image")} URL <span className="text-destructive">*</span></label>
            <Input {...control.register(`${prefix}.image` as const)} placeholder="https://..." />
          </div>

          {/* Price, Duration, Available */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">{t("Price")}</label>
              <Input type="number" step="0.01" {...control.register(`${prefix}.price` as const)} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">{t("DurationMinutes")}</label>
              <Input type="number" {...control.register(`${prefix}.durationMinutes` as const)} />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <Controller
                control={control}
                name={`${prefix}.available` as const}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`available-${catIndex}-${srvIndex}`}
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                    />
                    <label htmlFor={`available-${catIndex}-${srvIndex}`} className="text-xs font-medium">{t("available")}</label>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Sizes & Addons */}
          <div className="grid grid-cols-2 gap-4">
            <SizesBuilder control={control} catIndex={catIndex} srvIndex={srvIndex} />
            <AddonsBuilder control={control} catIndex={catIndex} srvIndex={srvIndex} />
          </div>
        </>
      )}
    </div>
  );
}

function SizesBuilder({ control, catIndex, srvIndex }: { control: Control<StoreTemplatesType>, catIndex: number, srvIndex: number }) {
  const t = useTranslations();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `categories.${catIndex}.services.${srvIndex}.sizes` as const
  });

  return (
    <div className="space-y-2 border p-3 rounded bg-muted/10">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">{t("sizes")} <span className="text-destructive">*</span></span>
        <Button type="button" onClick={() => append({ nameAr: "", nameEn: "", price: 0, isDefault: false })} variant="ghost" size="sm" className="h-6 px-2 text-xs">
          <Plus className="w-3 h-3" /> {t("Add")}
        </Button>
      </div>
      {fields.map((field, idx) => (
        <div key={field.id} className="flex gap-2 items-start flex-wrap">
          <Input className="h-8 text-xs flex-1 min-w-[80px]" placeholder="AR" {...control.register(`categories.${catIndex}.services.${srvIndex}.sizes.${idx}.nameAr` as const)} />
          <Input className="h-8 text-xs flex-1 min-w-[80px]" placeholder="EN" {...control.register(`categories.${catIndex}.services.${srvIndex}.sizes.${idx}.nameEn` as const)} />
          <Input className="h-8 text-xs w-20" type="number" step="0.01" placeholder={t("Price")} {...control.register(`categories.${catIndex}.services.${srvIndex}.sizes.${idx}.price` as const)} />
          <Controller
            control={control}
            name={`categories.${catIndex}.services.${srvIndex}.sizes.${idx}.isDefault` as const}
            render={({ field: f }) => (
              <div className="flex items-center gap-1 h-8">
                <Checkbox
                  id={`default-${catIndex}-${srvIndex}-${idx}`}
                  checked={f.value ?? false}
                  onCheckedChange={f.onChange}
                />
                <label htmlFor={`default-${catIndex}-${srvIndex}-${idx}`} className="text-xs whitespace-nowrap">{t("Default")}</label>
              </div>
            )}
          />
          <Button type="button" onClick={() => remove(idx)} variant="ghost" size="sm" className="h-8 px-2 text-destructive">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}

function AddonsBuilder({ control, catIndex, srvIndex }: { control: Control<StoreTemplatesType>, catIndex: number, srvIndex: number }) {
  const t = useTranslations();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `categories.${catIndex}.services.${srvIndex}.addons` as const
  });

  return (
    <div className="space-y-2 border p-3 rounded bg-muted/10">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">{t("Addons")}</span>
        <Button type="button" onClick={() => append({ nameAr: "", nameEn: "", price: 0 })} variant="ghost" size="sm" className="h-6 px-2 text-xs">
          <Plus className="w-3 h-3" /> {t("Add")}
        </Button>
      </div>
      {fields.map((field, idx) => (
        <div key={field.id} className="flex gap-2 items-start">
          <Input className="h-8 text-xs" placeholder="AR" {...control.register(`categories.${catIndex}.services.${srvIndex}.addons.${idx}.nameAr` as const)} />
          <Input className="h-8 text-xs" placeholder="EN" {...control.register(`categories.${catIndex}.services.${srvIndex}.addons.${idx}.nameEn` as const)} />
          <Input className="h-8 text-xs w-20" type="number" step="0.01" placeholder={t("Price")} {...control.register(`categories.${catIndex}.services.${srvIndex}.addons.${idx}.price` as const)} />
          <Button type="button" onClick={() => remove(idx)} variant="ghost" size="sm" className="h-8 px-2 text-destructive">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}
