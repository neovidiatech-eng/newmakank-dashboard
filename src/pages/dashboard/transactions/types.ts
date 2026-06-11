// Auto-generated type definitions

export interface transactionsCustomer {
  name: string;
  image: string;
}

export interface transactions {
  id: string;
  credit: number;
  debit: number;
  balance: number;
  createdAt: string;
  type: string;
  userType: string;
  referenceId: number;
  branchId?: null;
  customerId: number;
  Branch?: null;
  Customer: transactionsCustomer;
}
