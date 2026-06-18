import { useFieldArray, Control } from "react-hook-form";
import { Plus } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import type { StoreTemplatesType } from "./storeTemplates.schema";

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
        {/* <Button type="button" onClick={() => appendCategory({ nameAr: "", nameEn: "", order: 0, services: [] })} variant="outline">
          <Plus className="w-4 h-4 mr-2" /> {t("addCategory")}
        </Button> */}
      </div>

      {/* {categoryFields.map((category, catIndex) => (
        <CategoryItem key={category.id} control={control} catIndex={catIndex} onRemove={() => removeCategory(catIndex)} lang={lang} />
      ))} */}
    </div>
  );
}

