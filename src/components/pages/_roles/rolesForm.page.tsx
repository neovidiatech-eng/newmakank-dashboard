import { useTranslations } from "@/lib/i18n";
import { useState } from "react";
import { Controller } from "react-hook-form";

import CustomForm from "@/components/common/Form/CustomForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { testRolesForm } from "./roles-check-form-validation";
import { PERM_PREFIX } from "./roles.inputs";
import type { RolesType } from "./roles.schema";
import useRolesLogic from "./useRolesForm.logic";

const METHOD_STYLES: Record<string, string> = {
  GET: "bg-blue-100 text-blue-700 ring-blue-400 dark:bg-blue-900/50 dark:text-blue-300",
  POST: "bg-green-100 text-green-700 ring-green-400 dark:bg-green-900/50 dark:text-green-300",
  PUT: "bg-amber-100 text-amber-700 ring-amber-400 dark:bg-amber-900/50 dark:text-amber-300",
  PATCH:
    "bg-orange-100 text-orange-700 ring-orange-400 dark:bg-orange-900/50 dark:text-orange-300",
  DELETE:
    "bg-red-100 text-red-700 ring-red-400 dark:bg-red-900/50 dark:text-red-300"
};
const METHOD_INACTIVE = "bg-muted text-muted-foreground hover:bg-muted/80";

export default function RolesFormPage({
  data,
  permissions
}: {
  permissions?: AppConfig.SystemPermission[];
  data?: RolesType;
}) {
  const { inputs, control, formSubmit } = useRolesLogic({ data, permissions });
  const t = useTranslations();
  const [search, setSearch] = useState("");
  testRolesForm();

  const nameInputs = inputs.filter(i => !i.name.startsWith(PERM_PREFIX));
  const filtered = (permissions ?? []).filter(
    g =>
      g.prefix.toLowerCase().includes(search.toLowerCase()) ||
      g.name?.en?.toLowerCase().includes(search.toLowerCase()) ||
      g.name?.ar?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CustomForm
      handleSubmit={formSubmit}
      control={control}
      cardConfig={[
        {
          id: "lang",
          title: t("Roles Information"),
          multiLang: true,
          width: 6
        }
      ]}
      inputs={nameInputs}
    >
      {permissions && permissions.length > 0 && (
        <div className="flex flex-col gap-4 mt-2">
          <Separator />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">{t("Permissions")}</h3>
              <Badge variant="secondary">
                {permissions.length} {t("groups")}
              </Badge>
            </div>
            <Input
              placeholder={t("Search") + "..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="sm:max-w-xs h-8 text-sm"
            />
          </div>

          {/* Permission group cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(group => {
              const fieldName =
                `${PERM_PREFIX}${group.prefix}` as keyof RolesType;
              return (
                <Controller
                  key={group.prefix}
                  control={control}
                  name={fieldName}
                  render={({ field }) => {
                    const selected: string[] =
                      (field.value as unknown as string[]) ?? [];
                    const allIds = group.methods.map(m => String(m.id));
                    const isAllSelected =
                      allIds.length > 0 &&
                      allIds.every(id => selected.includes(id));
                    const isSomeSelected =
                      selected.length > 0 && !isAllSelected;

                    const toggleAll = () =>
                      field.onChange(isAllSelected ? [] : allIds);

                    const toggleMethod = (id: string) =>
                      field.onChange(
                        selected.includes(id)
                          ? selected.filter(s => s !== id)
                          : [...selected, id]
                      );

                    return (
                      <Card
                        className={`transition-shadow ${
                          selected.length > 0
                            ? "border-primary/40 shadow-sm"
                            : ""
                        }`}
                      >
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Checkbox
                              checked={isAllSelected}
                              data-indeterminate={isSomeSelected}
                              onCheckedChange={toggleAll}
                              className={
                                isSomeSelected
                                  ? "data-[state=unchecked]:bg-primary/20"
                                  : ""
                              }
                            />
                            <CardTitle className="text-sm mb-1 font-medium capitalize truncate">
                              {t(group.prefix)}
                            </CardTitle>
                          </div>
                          {selected.length > 0 && (
                            <Badge
                              variant="secondary"
                              className="shrink-0 text-xs"
                            >
                              {selected.length}/{allIds.length}
                            </Badge>
                          )}
                        </CardHeader>

                        <CardContent className="pt-2">
                          <div className="flex flex-wrap gap-1.5">
                            {group.methods.map(method => {
                              const id = String(method.id);
                              const isChecked = selected.includes(id);
                              const colorStyle =
                                METHOD_STYLES[method.method.toUpperCase()];
                              return (
                                <button
                                  key={id}
                                  type="button"
                                  onClick={() => toggleMethod(id)}
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-all select-none ${
                                    isChecked
                                      ? (colorStyle ??
                                          "bg-primary/20 text-primary") +
                                        " ring-1 ring-current"
                                      : METHOD_INACTIVE
                                  }`}
                                >
                                  {t(method.method)}
                                </button>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }}
                />
              );
            })}
          </div>

          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              {t("No results found")}
            </p>
          )}
        </div>
      )}
    </CustomForm>
  );
}
