import { useFieldArray, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        </>
      )}
    </div>
  );
}
