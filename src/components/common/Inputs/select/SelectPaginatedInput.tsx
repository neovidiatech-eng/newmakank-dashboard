import { fetchHelper } from "@/api/fetch";
import { useLocale, useTranslations } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useSearchParams } from "@/lib/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Select, { type MultiValue, type SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";
import { toast } from "sonner";
import {
  type ApiResponseItem,
  type Option,
  type SelectPaginatedProps,
  customStyles,
} from "./select.config";

// Define the Option type for clarity

export default function SelectPaginated({
  isMulti = false,
  value,
  placeholder,
  onChange,
  onControlChange,
  name,
  idKey = "id",
  onLabelAction,
  labelKey = "name",
  labelFormat,
  apiUrl,
  searchTermKey = "search",
  searchParamsFilter,
  searchFilters,
  disabled = false,
  allowNew = false,
  groupBy,
}: // formatCreateLabel,
  Readonly<SelectPaginatedProps>) {
  const t = useTranslations();
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const [apiOptions, setApiOptions] = useState<Option[]>([]);
  const [customOptions, setCustomOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    setApiOptions([]);
  }, [searchFilters]);
  // Combine API options with custom options
  const allOptions: any = [...apiOptions, ...customOptions];
  const getLocalizedText = useCallback(
    (value: unknown) => {
      if (typeof value === "string") return value;
      if (value && typeof value === "object") {
        const localizedValue = value as Record<string, unknown>;
        const currentLocaleValue = localizedValue[locale];
        if (typeof currentLocaleValue === "string") return currentLocaleValue;
        if (typeof localizedValue.ar === "string") return localizedValue.ar;
        if (typeof localizedValue.en === "string") return localizedValue.en;
      }

      return "";
    },
    [locale]
  );
  const getOptionLabel = useCallback(
    (item: ApiResponseItem) => {
      if (labelFormat === "storeBranch") {
        const store = item.Store || item.store;
        const storeName = getLocalizedText(store?.name);
        const branchName = getLocalizedText(item.name);

        if (storeName && branchName) return `${storeName} (${branchName})`;
        return storeName || branchName || "Unknown";
      }

      if (labelFormat === "serviceStore") {
        const serviceName = getLocalizedText(item.name);
        const store = item.Store || item.store;
        const storeName = getLocalizedText(store?.name);

        if (serviceName && storeName) return `${serviceName} (${storeName})`;
        return serviceName || storeName || "Unknown";
      }

      return item[labelKey] || "Unknown";
    },
    [getLocalizedText, labelFormat, labelKey]
  );

  const displayedOptions = useMemo(() => {
    if (!groupBy) return allOptions;

    const groups: Record<string, Option[]> = {};
    allOptions.forEach(opt => {
      const groupName = opt?.group || "Other";
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(opt);
    });

    return Object.keys(groups).map(group => ({
      label: group,
      options: groups[group],
    }));
  }, [allOptions, groupBy]);

  // Fetch options from the API
  const searchParams = useSearchParams();
  const fetchOptions = useCallback(
    async (isNewSearch = false) => {
      if (!hasMore && !isNewSearch) return;

      try {
        setIsLoading(true);
        const currentPage = isNewSearch ? 1 : page;

        let data = await fetchHelper({
          endPoint: apiUrl,
          revalidate: 120,
          isLocalized: true,
          tags: apiUrl,
          params: {
            ...searchParamsFilter?.reduce(
              (acc, curr) => ({ ...acc, [curr]: searchParams.get(curr) }),
              {},
            ),
            ...(searchTerm ? { locate: searchTerm } : {}),
            ...searchFilters?.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}),
            limit: (currentPage * 15).toString(), // Adjust the number of items per page as needed
          },
        });
        data = onLabelAction ? onLabelAction(data) : data;
        console.log(data, 'datasad2', name);
        const formattedData = Array.isArray(data?.data) ? data.data : data;
        const newOptions = Array.isArray(formattedData)
          ? formattedData?.map((item: ApiResponseItem) => ({
            label: getOptionLabel(item),
            value: item[idKey] || "",
            icon: item.icon ?? "",
            group: groupBy ? item[groupBy] : undefined,
          }))
          : [];

        // If we're doing a new search, replace options, otherwise append
        if (isNewSearch) {
          setApiOptions(prevOptions => {
            const combined = [...prevOptions];
            newOptions.forEach(newOption => {
              if (!combined.some(existing => existing.value === newOption.value)) {
                combined.push(newOption);
              }
            });
            return combined;
          });
          setPage(2); // Reset to page 2 for next fetch
        } else {
          // Combine old and new options, avoiding duplicates
          setApiOptions(prevOptions => {
            const combined = [...prevOptions];
            newOptions.forEach(newOption => {
              if (!combined.some(existing => existing.value === newOption.value)) {
                combined.push(newOption);
              }
            });
            return combined;
          });
          setPage(currentPage + 1);
        }

        // Check if we have more data to load
        setHasMore(newOptions.length > 0);
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : String(error));
        if (isNewSearch) {
          setApiOptions([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      apiUrl,
      searchTerm,
      searchParams,
      searchParamsFilter,
      searchFilters,
      idKey,
      labelKey,
      getOptionLabel,
      searchTermKey,
      page,
      hasMore,
    ],
  );

  // Fetch options when component mounts
  useEffect(() => {
    fetchOptions(true);
  }, [apiUrl, searchParamsFilter, searchFilters]);

  // Handle search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOptions(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle change event for single and multi-select
  const handleChange = (selected: SingleValue<Option> | MultiValue<Option>) => {
    const selectedOptions = Array.isArray(selected) ? selected : selected ? [selected] : [];
    if (selectedOptions.length == 1 && isMulti == false) {
      const v = selectedOptions[0].value;
      onChange?.(v);
      onControlChange?.(v);
    } else if (isMulti == true && selectedOptions.length > 0) {
      const v = selectedOptions.map(item => item.value);
      onChange?.(v);
      onControlChange?.(v);
    } else if (selectedOptions.length == 0 && isMulti == true) {
      onChange?.([]);
      onControlChange?.([]);
    } else if (selectedOptions.length == 0 && isMulti == false) {
      onChange?.("");
      onControlChange?.("");
    } else {
      onChange?.(selectedOptions);
      onControlChange?.(selectedOptions);
    }
  };

  // Handle creating a new option
  const handleCreateOption = (inputValue: string) => {
    const newOption = {
      label: inputValue,
      value: `${inputValue}`,
      __isNew__: true,
    };

    setCustomOptions(prevCustomOptions => [...prevCustomOptions, newOption]);

    if (isMulti) {
      const newValue = [...(Array.isArray(value) ? value : []), newOption.value];
      // Convert string array to Option array to match the expected type
      const newOptions = newValue.map(val => ({
        label: typeof val === "string" ? val : String(val),
        value: val,
      }));
      onChange?.(newOptions);
      onControlChange?.(newOptions);
    } else {
      onChange?.(newOption.value);
      onControlChange?.(newOption.value);
    }
  };

  const SelectComponent = (allowNew ? CreatableSelect : Select) as any;

  const formatOptionLabel = (option: Option) => {
    return (
      <div className="flex items-center justify-between gap-2">
        <span>{option.label}</span>
        {option.__isNew__ && <span className="text-xs italic">(New)</span>}
        {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
      </div>
    );
  };

  // Find the selected value in the combined options list
  const selectedValue = (() => {
    if (!value) return undefined;

    // For single select
    if (!isMulti) {
      const exiest = allOptions.find(opt => opt.value === value);
      return exiest;
    }

    // For multi select
    if (Array.isArray(value)) {
      return value.map(v => allOptions.find(opt => opt.value === v)).filter(Boolean);
    }

    return undefined;
  })();

  // Fetch missing selected value only on first mount
  useEffect(() => {
    if (!isMulti && value && !allOptions.find(opt => opt.value === value)) {
      (async () => {
        const data = await fetchHelper({
          endPoint: apiUrl,
          revalidate: 60, isLocalized: true,

          params: {
            id: value
          },
          tags: apiUrl,
        });
        if (data?.data?.length == 1) {
          const formattedData = Array.isArray(data?.data) ? data.data : data;
          setApiOptions(prev => [
            ...prev,
            {
              label: getOptionLabel(formattedData[0]),
              value: formattedData[0][idKey] || "",
              group: groupBy ? formattedData[0][groupBy] : undefined,
            },
          ]);
        }
      })();
    }
    // Only run on mount
  }, []);

  return (
    <div className="flex flex-col w-full gap-3">
      <SelectComponent
        isClearable
        isDisabled={disabled}
        isMulti={isMulti}
        onChange={handleChange}
        onCreateOption={allowNew ? handleCreateOption : undefined}
        options={displayedOptions}
        value={selectedValue as unknown as SingleValue<Option> | MultiValue<Option>}
        placeholder={placeholder ?? t("select")}
        name={name}
        styles={customStyles(resolvedTheme === "dark")}
        className="w-full"
        formatOptionLabel={formatOptionLabel}
        formatCreateLabel={inputValue => `Create "${inputValue}"`}
        onMenuScrollToBottom={() => {
          if (!isLoading) {
            fetchOptions(false);
          }
        }}
        isLoading={isLoading}
        onInputChange={inputValue => setSearchTerm(inputValue)}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
        menuPosition="fixed"
      />
    </div>
  );
}
