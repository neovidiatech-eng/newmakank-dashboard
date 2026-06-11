import { queryClient } from "@/lib/queryClient";
import { endpointType } from "@/utils/endpoints";
import { fetchHelper } from "../fetch";

export async function APIDelete(
  endPoint: endpointType,
  pathname: string,
  id: string
): Promise<ApiResponse<any>> {
  const data = await fetchHelper({
    endPoint: [...endPoint, Number(id)],
    method: "DELETE"
  });

  await queryClient.invalidateQueries({ queryKey: [pathname] });
  await queryClient.invalidateQueries({ queryKey: [endPoint.join("")] });
  return data;
}
