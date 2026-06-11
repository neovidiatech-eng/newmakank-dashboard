import { fetchHelper } from "@/api/fetch";
import type { Option } from "../../Form/CustomFormTypes.types";
import type { endpointType } from "@/utils/endpoints";
import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_PAGE_SIZE = 20;

interface UsePaginatedSelectOptions {
  apiUrl: endpointType;
  idKey?: string;
  labelKey?: string;
  searchFilters?: { key: string; value: string | number }[];
  pageSize?: number;
}

export default function usePaginatedSelect({
  apiUrl,
  idKey = "id",
  labelKey = "name",
  searchFilters,
  pageSize = DEFAULT_PAGE_SIZE
}: UsePaginatedSelectOptions) {
  const [displayedOptions, setDisplayedOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const searchParams = useMemo(() => {
    return (
      searchFilters
        ?.map(item => ({ [item.key]: item.value }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {}) ?? {}
    );
  }, [searchFilters]);

  const fetchOptions = useCallback(
    async (limit: number) => {
      setIsLoading(true);

      const data = await fetchHelper({
        endPoint: apiUrl,
        method: "GET",
        isLocalized: true,
        params: {
          ...searchParams,
          limit
        }
      });

      const selectData = data?.data;
      setDisplayedOptions(
        selectData?.map((item: any) => ({
          label: item[labelKey],
          value: item[idKey]
        }))
      );
      setIsLoading(false);
    },
    [apiUrl, idKey, labelKey, searchParams]
  );

  const fetchInitial = useCallback(() => {
    fetchOptions(pageSize);
  }, [fetchOptions, pageSize]);

  const fetchMore = useCallback(() => {
    fetchOptions(Number(displayedOptions?.length ?? 0) + pageSize);
  }, [displayedOptions?.length, fetchOptions, pageSize]);

  useEffect(() => {
    fetchInitial();
  }, [fetchInitial, searchTerm]);

  return {
    displayedOptions,
    isLoading,
    searchTerm,
    setSearchTerm,
    fetchMore,
    fetchInitial
  };
}
