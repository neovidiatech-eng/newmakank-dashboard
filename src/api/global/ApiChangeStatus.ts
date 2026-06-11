import { queryClient } from "@/lib/queryClient";
import { endpointType } from "@/utils/endpoints";
import { redirect } from "@/lib/navigation";
import { fetchHelper } from "../fetch";

export async function APIChangeStatus(
  endPoint: endpointType,
  pathname: string,
  id?: string,
  body?: unknown
) {
  const data = await fetchHelper({
    endPoint: [...endPoint, ...(id ? [Number(id)] : [])],
    method: "PATCH",
    body
  });

  if (data?.code === 401) {
    redirect("/removeToken");
  }

  await queryClient.invalidateQueries({ queryKey: [pathname] });
  await queryClient.invalidateQueries({ queryKey: [endPoint.join("")] });
  return data;
}
