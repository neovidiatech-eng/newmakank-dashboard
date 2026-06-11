import { Loader2 } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { usePathname, useRouter, useSearchParams } from "@/lib/navigation";
import React, { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import type { FormInput } from "../../Form/CustomFormTypes.types";
import FormCardContainer from "../../Form/FormCardContainer";
import FormInputContainer from "../../Form/FormInputContainer";
import { renderInputComponent } from "../../Form/inputs-render";

function TableFilters({
  filters,
  isFiltersOpen,
  setIsFiltersOpen
}: {
  setIsFiltersOpen?: (value: boolean) => void;
  isFiltersOpen?: boolean;
  filters: FormInput[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const [isPending, startTransition] = useTransition();
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});

  const t = useTranslations();

  const onFilterSubmit = () => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filterValues)) {
      if (value === null || value === undefined || value === "") continue;
      if (Array.isArray(value) && value.length === 0) continue;

      const normalizedValue = value instanceof Date ? value.toISOString() : (value as unknown);

      if (Array.isArray(normalizedValue)) {
        for (const item of normalizedValue) params.append(key, String(item));
        continue;
      }

      params.set(key, String(normalizedValue));
    }

    startTransition(() => {
      router.push(`?${params.toString()}`, {
        scroll: false
      });
    });
  };

  const filterReset = () => {
    setFilterValues({});
    startTransition(() => {
      router.replace(pathName);
    });
    setIsFiltersOpen?.(false);
  };

  if (isFiltersOpen === undefined) {
    isFiltersOpen = true;
  }

  useEffect(() => {
    const newFilterValues: Record<string, unknown> = {};
    for (const filter of filters) {
      const isMulti = (filter as { isMulti?: boolean }).isMulti;
      if (isMulti) {
        const values = searchParams.getAll(filter.name);
        if (values.length > 0) {
          if (filter.type === "date") {
            newFilterValues[filter.name] = values
              .map(v => new Date(v))
              .filter(d => !Number.isNaN(d.getTime()));
          } else {
            newFilterValues[filter.name] = values;
          }
        }
        continue;
      }

      const value = searchParams.get(filter.name);
      if (value !== null) {
        if (filter.type === "date") {
          const date = new Date(value);
          if (!Number.isNaN(date.getTime())) {
            newFilterValues[filter.name] = date;
          }
        } else {
          newFilterValues[filter.name] = value;
        }
      }
    }
    setFilterValues(newFilterValues);
  }, [filters, searchParams]);

  const effectiveIsFiltersOpen = isFiltersOpen ?? true;

  return (
    effectiveIsFiltersOpen && (
      <div className="flex flex-col gap-4">
        <FormCardContainer index={filters?.length} width={6}>
          {filters?.map((filter, index) => {
            return (
              <React.Fragment key={index.toString()}>
                {filter.isHidden !== true && (
                  <FormInputContainer index={index} width={filter.width || 3}>
                    {renderInputComponent({
                      item: filter,
                      field: {
                        value: filterValues[filter.name] ?? "",
                        onChange: (e: unknown) => {
                          let value: unknown;

                          // Handle direct string or number values
                          if (typeof e === "string" || typeof e === "number") {
                            value = e;
                          }
                          // Handle arrays (multi-select)
                          else if (Array.isArray(e)) {
                            value = e.map(item =>
                              typeof item === "object" && item !== null && "value" in item
                                ? item.value
                                : item
                            );
                          }
                          // Handle objects with value property (select inputs)
                          else if (e && typeof e === "object" && "value" in e) {
                            value = (e as { value: unknown }).value;
                          }
                          // Handle event objects
                          else if (e && typeof e === "object" && "target" in e) {
                            value = (e as { target: { value: unknown } }).target.value;
                          }
                          // Fallback
                          else {
                            value = e;
                          }

                          if (filter.type === "date") {
                            if (typeof value === "string") {
                              const date = new Date(value);
                              if (!Number.isNaN(date.getTime())) {
                                value = date;
                              }
                            } else if (Array.isArray(value)) {
                              value = value
                                .map(v => (typeof v === "string" ? new Date(v) : v))
                                .filter(v => v instanceof Date && !Number.isNaN(v.getTime()));
                            }
                          }

                          setFilterValues(prev => ({
                            ...prev,
                            [filter.name]: value
                          }));
                        }
                      },
                      errors: {}
                    })}
                  </FormInputContainer>
                )}
              </React.Fragment>
            );
          })}
        </FormCardContainer>

        <div className="flex justify-end w-full gap-4 sm:w-auto sm:ml-auto">
          <Button
            type="button"
            onClick={onFilterSubmit}
            disabled={isPending}
            className="flex-1 sm:flex-none sm:min-w-[120px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700 font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("Loading")}...
              </>
            ) : (
              t("Apply")
            )}
          </Button>
          <Button
            type="button"
            onClick={filterReset}
            variant="outline"
            disabled={isPending}
            className="flex-1 sm:flex-none sm:min-w-[120px] bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500 dark:text-gray-200 font-medium py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 transition-colors duration-200 flex items-center justify-center"
          >
            {t("reset")}
          </Button>
        </div>
      </div>
    )
  );
}

export default TableFilters;
