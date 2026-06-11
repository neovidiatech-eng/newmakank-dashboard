// Auto-generated type definitions

export interface bankAccountsBankName {
  en: string;
  ar: string;
}

export interface bankAccountsBank {
  id: number;
  name: bankAccountsBankName;
  deletedAt?: null;
}

export interface bankAccounts {
  id: number;
  bankId: number;
  phone: string;
  storeId: number;
  ibn: string;
  Bank: bankAccountsBank;
}
