import { fetchHelper } from "@/api/fetch";
import SelectPaginatedInput from "@/components/common/Inputs/select/SelectPaginatedInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "@/lib/i18n";
import { ListChecks, Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, type Control, type UseFormWatch } from "react-hook-form";

// Product choice groups ("اختيارات"), e.g. "نوع العيش" → سوري / فينو.
// Each group: required or optional, up to maxSelect picks. Options are free
// unless they get a price. Ids are kept so the backend updates rows in place.

export type ChoiceOptionForm = {
  id?: number;
  nameAr: string;
  nameEn: string;
  price: string | number;
  isDefault: boolean;
};

export type ChoiceGroupForm = {
  id?: number;
  nameAr: string;
  nameEn: string;
  isRequired: boolean;
  maxSelect: string | number;
  Options: ChoiceOptionForm[];
};

export const emptyChoiceOption = (): ChoiceOptionForm => ({ nameAr: "", nameEn: "", price: "", isDefault: false });
export const emptyChoiceGroup = (): ChoiceGroupForm => ({
  nameAr: "",
  nameEn: "",
  isRequired: true,
  maxSelect: 1,
  Options: [emptyChoiceOption(), emptyChoiceOption()]
});

/** API shape (name: {ar, en}) → form rows. */
export function choiceGroupsToForm(groups: any[] | undefined): ChoiceGroupForm[] {
  if (!Array.isArray(groups)) return [];
  return groups.map(group => ({
    id: group.id,
    nameAr: group.name?.ar ?? group.nameAr ?? "",
    nameEn: group.name?.en ?? group.nameEn ?? "",
    isRequired: group.isRequired !== false,
    maxSelect: group.maxSelect ?? 1,
    Options: (Array.isArray(group.Options) ? group.Options : []).map((option: any) => ({
      id: option.id,
      nameAr: option.name?.ar ?? option.nameAr ?? "",
      nameEn: option.name?.en ?? option.nameEn ?? "",
      price: Number(option.price) > 0 ? option.price : "",
      isDefault: !!option.isDefault
    }))
  }));
}

/** Form rows → API payload. `keepIds` false when copying from another product. */
export function choiceGroupsToPayload(groups: ChoiceGroupForm[] | undefined, keepIds = true) {
  return (groups ?? []).map((group, groupIndex) => ({
    ...(keepIds && group.id ? { id: group.id } : {}),
    name: { ar: group.nameAr.trim(), en: group.nameEn.trim() },
    isRequired: !!group.isRequired,
    maxSelect: Math.max(1, Math.floor(Number(group.maxSelect) || 1)),
    sortOrder: groupIndex,
    Options: (group.Options ?? []).map((option, optionIndex) => ({
      ...(keepIds && option.id ? { id: option.id } : {}),
      name: { ar: option.nameAr.trim(), en: option.nameEn.trim() },
      price: Math.max(0, Number(option.price) || 0),
      isDefault: !!option.isDefault,
      sortOrder: optionIndex
    }))
  }));
}

/** Same rules as the backend, so the admin sees the problem before saving. */
export function validateChoiceGroupsForm(groups: ChoiceGroupForm[] | undefined, t: (k: string) => string): string | null {
  for (const group of groups ?? []) {
    const label = group.nameAr || group.nameEn || "—";
    if (!group.nameAr.trim() || !group.nameEn.trim()) return t("choiceGroupNameRequired");
    const options = group.Options ?? [];
    if (!options.length) return t("choiceGroupNeedsOption").replace("{group}", label);
    if (options.some(o => !o.nameAr.trim() || !o.nameEn.trim())) {
      return t("choiceOptionNameRequired").replace("{group}", label);
    }
    const max = Math.floor(Number(group.maxSelect) || 0);
    if (max < 1 || max > options.length) return t("choiceGroupMaxInvalid").replace("{group}", label);
    if (options.filter(o => o.isDefault).length > max) return t("choiceGroupTooManyDefaults").replace("{group}", label);
  }
  return null;
}

function OptionsEditor({ control, groupIndex }: { control: Control<any>; groupIndex: number }) {
  const t = useTranslations();
  const { fields, append, remove } = useFieldArray({ control, name: `ChoiceGroups.${groupIndex}.Options` });

  return (
    <div className="grid gap-3">
      <div className="flex flex-col gap-2 rounded-lg border border-dashed border-slate-200 p-3 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">{t("choiceImportFromTemplate")}</p>
        <div className="w-full md:w-72">
          <SelectPaginatedInput
            name={`choiceTemplate-${groupIndex}`}
            apiUrl={["variationTemplate"]}
            value=""
            placeholder={t("SelectTemplatePlaceholder")}
            onLabelAction={res => {
              const filtered = res?.data?.filter((item: any) =>
                item.values?.some((val: any) => {
                  if (typeof val === "string") return val === "choices";
                  const nameVal = val?.name;
                  if (typeof nameVal === "string") return nameVal === "choices";
                  return nameVal?.en === "choices" || nameVal?.ar === "choices";
                })
              );
              return { ...res, data: filtered };
            }}
            onChange={async val => {
              if (!val) return;
              const response = await fetchHelper({
                endPoint: ["variationTemplate", Number(val)],
                method: "GET",
                isLocalized: false
              });
              const template = response?.data;
              if (template) {
                append({ nameAr: template.name?.ar ?? "", nameEn: template.name?.en ?? "", price: "", isDefault: false });
              }
            }}
          />
        </div>
      </div>

      {fields.map((field, optionIndex) => (
        <div key={field.id} className="grid items-end gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-900/40 md:grid-cols-[1fr_1fr_140px_auto_auto]">
          <div className="grid gap-1">
            <Label className="text-xs">{t("choiceOptionNameAr")}</Label>
            <Controller
              control={control}
              name={`ChoiceGroups.${groupIndex}.Options.${optionIndex}.nameAr`}
              render={({ field: f }) => <Input {...f} value={f.value ?? ""} placeholder="عيش سوري" />}
            />
          </div>
          <div className="grid gap-1">
            <Label className="text-xs">{t("choiceOptionNameEn")}</Label>
            <Controller
              control={control}
              name={`ChoiceGroups.${groupIndex}.Options.${optionIndex}.nameEn`}
              render={({ field: f }) => <Input {...f} value={f.value ?? ""} placeholder="Syrian bread" />}
            />
          </div>
          <div className="grid gap-1">
            <Label className="text-xs">{t("choiceOptionPrice")}</Label>
            <Controller
              control={control}
              name={`ChoiceGroups.${groupIndex}.Options.${optionIndex}.price`}
              render={({ field: f }) => (
                <Input {...f} type="number" min={0} value={f.value ?? ""} placeholder={t("choiceOptionFree")} />
              )}
            />
          </div>
          <div className="flex items-center gap-2 pb-2">
            <Controller
              control={control}
              name={`ChoiceGroups.${groupIndex}.Options.${optionIndex}.isDefault`}
              render={({ field: f }) => <Switch checked={!!f.value} onCheckedChange={f.onChange} />}
            />
            <span className="text-xs">{t("choiceOptionDefault")}</span>
          </div>
          <Button type="button" size="icon" variant="ghost" onClick={() => remove(optionIndex)} title={t("Delete")}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}

      <div>
        <Button type="button" variant="outline" size="sm" onClick={() => append(emptyChoiceOption())}>
          <Plus className="h-4 w-4" />
          {t("choiceAddOption")}
        </Button>
      </div>
    </div>
  );
}

export default function ChoiceGroupsEditor({
  control,
  watch
}: {
  control: Control<any>;
  watch: UseFormWatch<any>;
}) {
  const t = useTranslations();
  const { fields, append, remove } = useFieldArray({ control, name: "ChoiceGroups" });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">{t("choiceGroupsHint")}</p>

      {fields.map((field, groupIndex) => {
        const isRequired = watch(`ChoiceGroups.${groupIndex}.isRequired`);
        const maxSelect = Math.max(1, Number(watch(`ChoiceGroups.${groupIndex}.maxSelect`)) || 1);
        return (
          <div key={field.id} className="grid gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                <ListChecks className="h-4 w-4 text-primary" />
                {t("choiceGroup")} {groupIndex + 1}
              </div>
              <Button type="button" size="sm" variant="ghost" onClick={() => remove(groupIndex)}>
                <Trash2 className="h-4 w-4 text-destructive" />
                {t("choiceRemoveGroup")}
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_1fr_140px_auto]">
              <div className="grid gap-1">
                <Label className="text-xs">{t("choiceGroupNameAr")}</Label>
                <Controller
                  control={control}
                  name={`ChoiceGroups.${groupIndex}.nameAr`}
                  render={({ field: f }) => <Input {...f} value={f.value ?? ""} placeholder="نوع العيش" />}
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">{t("choiceGroupNameEn")}</Label>
                <Controller
                  control={control}
                  name={`ChoiceGroups.${groupIndex}.nameEn`}
                  render={({ field: f }) => <Input {...f} value={f.value ?? ""} placeholder="Bread type" />}
                />
              </div>
              <div className="grid gap-1">
                <Label className="text-xs">{t("choiceGroupMaxSelect")}</Label>
                <Controller
                  control={control}
                  name={`ChoiceGroups.${groupIndex}.maxSelect`}
                  render={({ field: f }) => <Input {...f} type="number" min={1} value={f.value ?? ""} />}
                />
              </div>
              <div className="flex items-center gap-2 pb-2 md:self-end">
                <Controller
                  control={control}
                  name={`ChoiceGroups.${groupIndex}.isRequired`}
                  render={({ field: f }) => <Switch checked={!!f.value} onCheckedChange={f.onChange} />}
                />
                <span className="text-xs">{t("choiceGroupRequired")}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              {(isRequired ? t("choiceGroupRuleRequired") : t("choiceGroupRuleOptional")).replace("{max}", String(maxSelect))}
            </p>

            <OptionsEditor control={control} groupIndex={groupIndex} />
          </div>
        );
      })}

      <div>
        <Button type="button" onClick={() => append(emptyChoiceGroup())}>
          <Plus className="h-4 w-4" />
          {t("choiceAddGroup")}
        </Button>
      </div>
    </div>
  );
}
