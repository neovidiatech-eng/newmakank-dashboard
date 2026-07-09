// Auto-generated type definitions

export interface employeesEntity {
  id: number;
  name: string;
  allowNotification: boolean;
  email: string;
  phone: string;
  verified: boolean;
  roleId: number;
  Role?: { id: number; name: { ar: string; en: string } };
  active: boolean;
  image: string;
  createdAt: string;
  deletedAt?: null;
}
