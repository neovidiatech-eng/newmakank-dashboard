export const ORDER_STATUS_OPTIONS = [
  "PENDING",
  "PREPARING",
  "READY_PICKUP",
  "ON_THE_WAY",
  "DELIVERED",
  "CANCELLED",
  "REJECTED",
  "PAYMENT_FAILD",
  "PENDING_PAYMENT"
] as const;

export type OrderStatus = (typeof ORDER_STATUS_OPTIONS)[number];
