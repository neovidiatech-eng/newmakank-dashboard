import { queryClient } from "@/lib/queryClient";
import { fetchHelper } from "@/api/fetch";
import { ORDER_STATUS_OPTIONS, type OrderStatus } from "@/utils/options/orderStatusOptions";

export async function updateOrderStatus(orderId: number, status: OrderStatus) {
  if (!ORDER_STATUS_OPTIONS.includes(status)) {
    throw new Error("Invalid status");
  }

  const response = await fetchHelper({
    endPoint: ["orders", orderId, status],
    method: "PATCH"
  });

  if (!response?.success) {
    throw new Error(response?.message || response?.result?.message || "Something went wrong");
  }

  await queryClient.invalidateQueries({ queryKey: ["orders"] });
  await queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
  return response;
}
