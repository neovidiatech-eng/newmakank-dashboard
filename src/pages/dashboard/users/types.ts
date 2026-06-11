// Auto-generated type definitions

export interface usersBranchName {
  ar: string;
  en: string;
}

export interface usersBranchStoreName {
  ar: string;
  en: string;
}

export interface usersBranchStore {
  id: number;
  name: usersBranchStoreName;
  cover: string;
  logo: string;
  moduleId: number;
}

export interface usersBranch {
  id: number;
  name: usersBranchName;
  address: string;
  rating: number;
  review: number;
  temporarilyClosed: boolean;
  closed: boolean;
  Store: usersBranchStore;
}

export interface usersEntity {
  id: number;
  name: string;
  allowNotification: boolean;
  email: string;
  phone: string;
  verified: boolean;
  Branch: usersBranch;
  roleKey: string;
  active: boolean;
  image: string;
  Details?: null;
  DeliveryDetails: unknown[];
  createdAt: string;
  deletedAt?: null;
}
