import { ExpandableButton } from "@/components/ui/ExpandableButton";
import { Button } from "@/components/ui/button"; // force ts refresh
import { FilterBar } from "@/components/ui/dashboard-primitives";
import { Link, usePathname } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Filter, Plus, X } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import { useRouter, useSearchParams } from "@/lib/navigation";
import { useState } from "react";
import { FormInput } from "../../Form/CustomFormTypes.types";
import { TableHeaders } from "../table.types";
import TableFilters from "../tableFilters/TableFilters";
import TableSearch from "../tableFilters/TableSearch";
import CSVExportButton from "./CSVExportButton";

export default function BasicTableHeader({
  hideCreateNew,
  cardHeader,
  filters,
  createNewLink,
  data,
  headers
}: {
  headers: TableHeaders[];
  data: Record<string, unknown>[];
  hideCreateNew?: boolean;
  cardHeader?: string;
  filters?: FormInput[];
  createNewLink?: string;
}): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const searchParams = useSearchParams();

  const formattedFilters =
    filters && filters?.length > 0
      ? filters
        ?.map(filter => {
          return {
            ...filter,
            name: filter.name,
            label: filter?.label || t(`${filter?.name.replace("Id", "")}`),
            id: filter?.name,
            type: filter?.type,
            defaultValue: filter?.defaultValue || t(`${filter?.name.replace("Id", "")}`),
            placeholder: filter?.placeholder
              ? t(filter?.placeholder)
              : t(`${filter?.name.replace("Id", "")}`)
          };
        })
        .filter(filter => !filter.isHidden) // Filter out hidden filters
      : [];

  const getFilterSplit = () => {
    if (!formattedFilters.length) return { quick: [], advanced: [] };

    const quickFilters = formattedFilters.filter(f => (f as any).isQuick);
    if (quickFilters.length > 0) {
      const advancedFilters = formattedFilters.filter(f => !(f as any).isQuick);
      return { quick: quickFilters, advanced: advancedFilters };
    }

    if (formattedFilters.length <= 2) {
      return { quick: formattedFilters, advanced: [] };
    }

    return {
      quick: [formattedFilters[0]],
      advanced: formattedFilters.slice(1)
    };
  };

  const { quick: quickSearchFilters, advanced: advancedFilters } = getFilterSplit();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const appliedFilterBadges = Array.from(searchParams.entries())

    .filter(([key, value]) => key !== "page" && value)
    .map(([key, value]) => {
      const matchingFilter = formattedFilters.find(filter => filter.name === key);
      const label = matchingFilter?.label || t(key);
      return {
        key,
        label,
        value
      };
    });

  const removeSearchParam = (key: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete(key);
    newSearchParams.delete("page");
    router.push(`${pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`);
  };

  const clearAllSearchParams = () => {
    router.push(pathname);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          {cardHeader && (
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{cardHeader}</h2>
          )}
          {appliedFilterBadges.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {appliedFilterBadges.map(badge => (
                <button
                  key={`${badge.key}-${badge.value}`}
                  type="button"
                  onClick={() => removeSearchParam(badge.key)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary transition-colors hover:border-primary/40 hover:bg-primary/10"
                  )}
                >
                  <span className="font-medium">{badge.label}:</span>
                  <span className="max-w-[180px] truncate text-foreground">{badge.value}</span>
                  <X className="h-3.5 w-3.5" />
                </button>
              ))}

              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={clearAllSearchParams}>
                {t("reset")}
              </Button>
            </div>
          )}
        </div>
        <FilterBar className="w-full sm:w-auto sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
          {/* Download CSV Button */}
          {data?.length > 0 ? (
            <CSVExportButton headers={headers} data={data} filename={cardHeader || "table"} />
          ) : null}

          {quickSearchFilters.map(searchFilter => (
            <TableSearch key={searchFilter.name} searchFilter={searchFilter} />
          ))}

          {advancedFilters.length > 0 && (
            <ExpandableButton
              type="button"
              icon={<Filter className="h-4 w-4" />}
              label={t("filters")}
              variant={isFiltersOpen ? "secondary" : "outline"}
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="border-primary/20 hover:border-primary/50"
            />
          )}

          {!hideCreateNew && (
            <Link
              href={`${createNewLink ? createNewLink : `${pathname}/create`}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
            >
              <ExpandableButton
                icon={<Plus className="h-4 w-4" />}
                label={t("Create New")}
                variant="default"
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              />
            </Link>
          )}
        </FilterBar>
      </div>

      {filters && advancedFilters.length > 0 && (
        <div
          className={`transition-all duration-300 ease-in-out ${isFiltersOpen ? "opacity-100 max-h-[500px] overflow-visible" : "opacity-0 max-h-0 overflow-hidden"}`}
        >
          <TableFilters
            setIsFiltersOpen={setIsFiltersOpen}
            filters={advancedFilters as FormInput[]}
            isFiltersOpen={isFiltersOpen}
          />
        </div>
      )}
    </div>
  );
}
