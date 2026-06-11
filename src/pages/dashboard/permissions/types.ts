// Auto-generated type definitions

export interface permissionsName {
  en: string;
  ar: string;
}

export interface permissions {
  id: number;
  name: permissionsName;
  prefix: string;
  method: ('get'|'patch'|'post'|'delete')[];
}
