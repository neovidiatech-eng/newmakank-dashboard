
export const endpoints = {
  adminLogin: "/api/authentication/login/Admin",
  resetPassword: "/api/authentication/reset-password",
  changePassword: "/api/users/me/change-password",
  myPermissions: "/api/users/me/permissions",
  forgetPassword: "/api/authentication/forget-password/ADMIN",
  modules: "/api/modules", // PAGE , FORM
  user: "/api/user",
  "my-profile": "/api/users/me",
  notifications: "/api/notification/notifications",
  readAllNotifications: "/api/notification/notifications/read-all",
  logs: "/api/logs",
  userStatistics: "/api/users/statistics",
  permissions: "/api/permissions",
  systemPermissions: '/api/permissions/system',
  block: "/block",
  customers: "/api/customers", // PAGE , FORM
  banners: "/api/banners",
  bannerStatistics: "/statistics",
  bannerStoreZones: "/zones",
  campaigns: "/api/campaigns",
  campaignStatus: "/status",
  fortuneWheel: "/api/fortune-wheel",
  fortuneWheelSettings: "/settings",
  toggleStatus: "/toggle-status",
  fund: "/api/fund",
  storeStatistics: "/api/statistics/store",
  commission: "/commission",
  userWallet: '/api/users/me/wallet',
  coupons: "/api/coupons",
  subscriptionStatistics: "/api/subscription/statistics",
  studentSubscriptions: "/api/students/my/subscriptions",
  accountingStatistics: "/api/accounting/statistics",
  updatePassword: "/authentication/change-password",
  profile: "/api/users/me",
  users: "/api/users",
  stores: "/api/stores",
  store: "/store",
  deliverySchedule: "/api/deliveryData/schedule",
  rating: '/api/rating',
  roles: "/api/roles/all",
  role: '/api/roles',
  zones: "/api/zones",
  categories: "/api/categories",
  storeTemplatesCategories: "/api/store-templates/categories",
  activateUser: "/api/user/activate",
  schedule: "/api/schedule",
  banks: "/api/banks", // FORM , PAGE
  variationTemplate: '/api/variation-templates',
  bankAccounts: "/api/bankAccounts", // FORM ,
  cities: "/api/cities", // FORM , PAGE
  ordersStatistics: "/api/orders/statistics", // DONE
  withdraw: "/api/withdraw",
  fox: '/PREPARING',
  unassign: '/unassign',
  adminNotifications: "/api/admin-notifications",
  orders: "/api/orders",
  customDelivery: "/custom-delivery",
  customDeliveryImages: "/images",
  advance: "/advance",
  finish: "/finish",
  ordersArchived: "/api/orders/archived",
  archived: "/archived",
  realize: "/realize",
  "admin-note": '/admin-note',
  transactions: "/api/transactions",
  transactionsStatistics: "/api/transactions/statistics",
  refreshToken: "/api/authentication/refresh-token",
  verifyAccount: '/api/authentication/verify',
  verifyResetPassword: "/api/authentication/verify-reset-password",
  logout: "/api/authentication/logout",
  resetAdminPassword: "/api/users/me/change-password", // renamed from "s" to be more descriptive
  //////////////////////////////////////////////
  socialMedia: "/api/social-media",
  allRoles: "/api/roles/all",
  keyvalue: "/api/keyvalue",
  statistics: "/api/statistics",
  services: "/api/services",
  status: "/status",
  deliveryRegister: "/api/delivery/register",
  deliveryAll: "/api/delivery/all",
  delivery: "/api/delivery",
  deliveryDashboard: "/dashboard",
  assign: "/assign",
  reply: "/reply",
  branches: "/api/branches",
  storeCategories: "/api/categories",
  subCategoryStore: "/api/categories",
  languages: "/api/languages",
  complaint: "/api/complaint",
  settings: "/api/settings",
  PENDING: "/PENDING",
  PREPARING: "/PREPARING",
  READY_PICKUP: "/READY_PICKUP",
  ON_THE_WAY: "/ON_THE_WAY",
  DELIVERED: "/DELIVERED",
  CANCELLED: "/CANCELLED",
  REJECTED: "/REJECTED",
  PAYMENT_FAILD: "/PAYMENT_FAILD",
  PENDING_PAYMENT: "/PENDING_PAYMENT",
  customerCategories: "/api/categories",
  customerCategoriesAssign: "/api/customer-categories/assign",
  storeTemplates: "/api/store-templates",
  applyTemplate: "/apply-template",
  appliedTemplates: "/applied-templates",
  approval: "/approval",
  verifyPayment: "/verify-payment",
  resetPeriod: "/api/statistics/reset-period",
  storeResetPeriod: "/api/statistics/store/reset-period",
  employees: "/api/employees",
  deliveryWithdrawals: "/api/delivery/withdrawals",
  deliveryCashSettlements: "/api/delivery/cash-settlements",
  storeZonePricingToggle: "/zone-pricing/toggle",
  storeZonePrices: "/zone-prices",
  onlineDelivery: "/api/orders",
  onlineDeliverySellerProfile: "/api/orders/online-delivery/seller-profile"
};
// addresses
// allPermissions
// banners
// branches
// categories
// complaint
// coupons
// customers
// favourite
// fund
// keyvalue
// languages
// modules
// notification
// orders
// roles
// schedule
// services
// settings
// socialMedia
// assignSpecialist: "/assign-specialist",
// specialists: "/api/specialists",

// sub-categories
// system-notifications
// users
// withdraw
// zones

export type endpointName = keyof typeof endpoints;

export type endpointType = (endpointName | number)[];

export const tags = {
  cart: "cart",
  "cart-items": "cart-items"
};

export type Tags = keyof typeof tags;
