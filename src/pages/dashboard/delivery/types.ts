// Auto-generated type definitions

export interface deliveryDeliveryDetailsItem {
  userId: number;
  rating: number;
  review: number;
  bestRated: boolean;
  lat: number;
  lng: number;
  availableNow: boolean;
  Schedule: unknown[];
}

export interface delivery {
  id: number;
  name: string;
  allowNotification: boolean;
  email: string;
  phone: string;
  verified: boolean;
  Branch?: null;
  roleKey: string;
  active: boolean;
  image: string;
  Details?: null;
  createdAt: string;
  deletedAt?: null;
  DeliveryDetails: deliveryDeliveryDetailsItem[];
}
