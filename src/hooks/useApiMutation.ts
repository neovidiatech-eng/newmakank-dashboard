import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchHelper } from "@/api/fetch";
import type { endpointType } from "@/utils/endpoints";

type MutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";

export function useApiMutation({
  endPoint,
  method = "POST",
  invalidate = []
}: {
  endPoint: endpointType;
  method?: MutationMethod;
  invalidate?: unknown[][];
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: body => fetchHelper({ endPoint, method, body }),
    onSuccess: () => {
      invalidate.forEach(queryKey => queryClient.invalidateQueries({ queryKey }));
    }
  });
}
