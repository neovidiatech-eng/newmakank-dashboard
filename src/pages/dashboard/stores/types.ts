// Auto-generated type definitions

export interface storesName {
  en: string;
  ar: string;
}

export interface storesModuleName {
  en: string;
  ar: string;
}

export interface storesModule {
  id: number;
  name: storesModuleName;
}

export interface storesStoreCouponsItemCouponTitle {
  en: string;
  ar: string;
}

export interface storesStoreCouponsItemCoupon {
  id: number;
  title: storesStoreCouponsItemCouponTitle;
  code: string;
  type: string;
  discountType: string;
  discountValue: number;
  maxUsage: number;
  usageCount: number;
  minOrderAmount: number;
  active: boolean;
  startDate: string;
  endDate: string;
  minDiscountValue: number;
  maxDiscountValue: number;
  createdAt: string;
  deletedAt?: null;
  expired: boolean;
}

export interface storesStoreCouponsItem {
  Coupon: storesStoreCouponsItemCoupon;
}

export interface storesCouponTitle {
  en: string;
  ar: string;
}

export interface storesCoupon {
  id: number;
  title: storesCouponTitle;
  code: string;
  type: string;
  discountType: string;
  discountValue: number;
  maxUsage: number;
  usageCount: number;
  minOrderAmount: number;
  active: boolean;
  startDate: string;
  endDate: string;
  minDiscountValue: number;
  maxDiscountValue: number;
  createdAt: string;
  deletedAt?: null;
  expired: boolean;
}

export interface stores {
  id: number;
  name: storesName;
  logo: string;
  cover: string;
  createdAt: string;
  freeDelivery: boolean;
  status:string;
  isVerified: boolean;
  Module: storesModule;
  StoreCoupons: storesStoreCouponsItem[];
  branchId: number;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  review: number;
  closed: boolean;
  temporarilyClosed: boolean;
  phone: string;
  distance: number;
  deliveryTime: number;
  deliveryPrice: number;
  Coupon: storesCoupon;
  isFavourite: boolean;
}
