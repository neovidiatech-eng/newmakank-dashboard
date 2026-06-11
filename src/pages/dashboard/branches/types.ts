// Auto-generated type definitions

export interface branchesName {
  ar: string;
  en: string;
}

export interface branchesStoreName {
  ar: string;
  en: string;
}

export interface branchesStore {
  id: number;
  name: branchesStoreName;
  logo: string;
}

export interface branches {
  id: number;
  storeId: number;
  name: branchesName;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  isActive: boolean;
  closed: boolean;
  rating: number;
  review: number;
  bestRated: boolean;
  temporarilyClosed: boolean;
  storeSchedule: unknown[];
  Store: branchesStore;
  isOpen: boolean;
}
