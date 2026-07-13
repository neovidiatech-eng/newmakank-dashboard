// Auto-generated type definitions

export interface ApiResponseBranch {
  lat: number;
  lng: number;
}

export interface ApiResponseCustomer {
  name: string;
  phone: string;
  image: string;
}

export interface ApiResponseInvoiceStore {
  id: number;
  name: { ar: string; en: string };
  logo: string;
  address: string;
}

export interface ApiResponseInvoiceSummary {
  subtotal?: number;
  estimatedItemsCost?: number;
  tax: number;
  shipping: number;
  discount?: number;
  commission?: number;
  total: number;
}

export interface ApiResponseInvoiceCustomDeliveryLocation {
  lat: number;
  lng: number;
}

export interface ApiResponseInvoiceCustomDelivery {
  pickupLocation: ApiResponseInvoiceCustomDeliveryLocation;
  deliveryLocation: ApiResponseInvoiceCustomDeliveryLocation;
  itemsDescription: string;
  estimatedItemsCost: number;
  driverInstructions: string;
}

export interface ApiResponseComplaintsItem {
  id: number;
  orderId: number;
  userId: number;
  description: string;
  status: string;
  createdAt: string;
}

export interface ApiResponseInvoice {
  orderId: number;
  customer: number;
  branchId?: number;
  store?: ApiResponseInvoiceStore;
  items?: any[];
  summary: ApiResponseInvoiceSummary;
  estimatedArrivalMinutes?: number;
  paymentMethod: string;
  orderType: string;
  customDelivery?: ApiResponseInvoiceCustomDelivery;
  date: string;
}

export interface ApiResponseDeliveryRatingItem {
  id: number;
  userId: number;
  deliveryId: number;
  orderId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: null;
  deletedAt?: null;
}

export interface ApiResponseDeliveryUserDeliveryDetailsItem {
  userId: number;
  rating: number;
  review: number;
  bestRated: boolean;
}

export interface ApiResponseDeliveryUser {
  id: number;
  name: string;
  image: string;
  phone: string;
  email: string;
  DeliveryDetails: ApiResponseDeliveryUserDeliveryDetailsItem[];
}

export interface ApiResponseDelivery {
  User: ApiResponseDeliveryUser;
}

export interface ApiResponseOrderItemsItemServiceName {
  en: string;
  ar: string;
}

export interface ApiResponseOrderItemsItemServiceStoreStoreRatingsItem {
  id: number;
  userId: number;
  orderId: number;
  rating: number;
  createdAt: string;
  updatedAt?: null;
  deletedAt?: null;
  branchId: number;
  storeId: number;
  comment: string;
}

export interface ApiResponseOrderItemsItemServiceStoreName {
  en: string;
  ar: string;
}

export interface ApiResponseOrderItemsItemServiceStore {
  storeRatings: ApiResponseOrderItemsItemServiceStoreStoreRatingsItem[];
  logo: string;
  cover: string;
  name: ApiResponseOrderItemsItemServiceStoreName;
  id: number;
}

export interface ApiResponseOrderItemsItemService {
  id: number;
  durationMinutes: number;
  name: ApiResponseOrderItemsItemServiceName;
  image: string;
  storeId: number;
  Store: ApiResponseOrderItemsItemServiceStore;
}

export interface ApiResponseOrderItemsItemSizeName {
  en: string;
  ar: string;
}

export interface ApiResponseOrderItemsItemSize {
  id: number;
  name: ApiResponseOrderItemsItemSizeName;
  price: number;
  isDefault: boolean;
  serviceId: number;
  deletedAt?: null;
}

export interface ApiResponseOrderItemsItemOrderItemAddonsItemAddonName {
  en: string;
  ar: string;
}

export interface ApiResponseOrderItemsItemOrderItemAddonsItemAddon {
  id: number;
  name: ApiResponseOrderItemsItemOrderItemAddonsItemAddonName;
  price: number;
  serviceId: number;
  deletedAt?: null;
}

export interface ApiResponseOrderItemsItemOrderItemAddonsItem {
  id: number;
  orderItemId: number;
  addonId: number;
  Addon: ApiResponseOrderItemsItemOrderItemAddonsItemAddon;
}

export interface ApiResponseOrderItemsItem {
  id: number;
  orderId: number;
  serviceId: number;
  sizeId: number;
  quantity: number;
  price: number;
  Service: ApiResponseOrderItemsItemService;
  Size: ApiResponseOrderItemsItemSize;
  OrderItemAddons: ApiResponseOrderItemsItemOrderItemAddonsItem[];
}

export interface ApiResponseStoreRatingItem {
  id: number;
  userId: number;
  orderId: number;
  rating: number;
  createdAt: string;
  updatedAt?: null;
  deletedAt?: null;
  branchId: number;
  storeId: number;
  comment: string;
}

export interface ApiResponseAddress {
  lat: number;
  adress: string;
  lng: number;
  title: string;
  default: boolean;
  id: number;
}

export interface ApiResponse {
  id: number;
  price: number;
  note?: string | null;
  adminNote?: string | null;
  noteForDelivery?: string | null;
  couponId?: number | null;
  date: string;
  createdAt: string;
  addressId?: number | null;
  userId: number;
  totalPriceAfterDiscount: number;
  discountAmount: number;
  paidWithWallet: boolean;
  adminCommission: number;
  globalCommission?: number;
  storeCommission?: number;
  shipping: number;
  tax: number;
  paymentStatus: string;
  paymentMethod: string;
  status: string;
  type: string;
  branchId?: number | null;
  Branch?: ApiResponseBranch | null;
  Customer: ApiResponseCustomer;
  invoice: ApiResponseInvoice;
  rated: boolean;
  DeliveryRating: ApiResponseDeliveryRatingItem[];
  Delivery?: ApiResponseDelivery | null;
  OrderItems: ApiResponseOrderItemsItem[];
  StoreRating: ApiResponseStoreRatingItem[];
  Address?: ApiResponseAddress | null;
  Complaints: ApiResponseComplaintsItem[];
  estimatedArrivalMinutes: number;
  canDeliver: boolean;
  transferNumer?: string | number | null;
  transferImage?: string | null;
  transferType?: "VODAFONE_CASH" | "INSTAPAY" | "BANK_TRANSFER" | null;
  transferAccountNumber?: string | null;
  customDeliveryKind?: "PURCHASE" | "RESTAURANT" | "ONLINE" | null;
  customerSelectedZoneId?: number | null;
}
