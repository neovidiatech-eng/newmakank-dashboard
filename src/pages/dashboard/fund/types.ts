// Auto-generated type definitions

export interface fundCustomer {
  id: number;
  name: string;
  phone: string;
  email: string;
  image: string;
}

export interface fund {
  id: number;
  price: number;
  Customer: fundCustomer;
  createdAt: string;
  deletedAt?: null;
}
