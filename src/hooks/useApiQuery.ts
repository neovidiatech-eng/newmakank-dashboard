import { useQuery } from "@tanstack/react-query";
import { fetchHelper } from "@/api/fetch";

export function useApiQuery({ queryKey, endPoint, params = {}, enabled = true, staleTime = 60_000 }) {
  return useQuery({
    queryKey: queryKey ?? [endPoint.join(""), params],
    queryFn: () => fetchHelper({ endPoint, params }),
    enabled,
    staleTime
  });
}
