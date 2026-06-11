type ID = number;
declare namespace API {
  interface Response<T> {
    data: T;
    success: boolean;
    message: string;
    code?: number;
    total: number;
    limit?: number;
    result?: {
      message: string;
    };
  }
}

declare namespace Auth {
  type RoleKey = "Admin" | "Teacher" | "Student" | "Parent";
  type PermissionsType = {
    patch: boolean;
    put: boolean;
    delete: boolean;
    get: boolean;
    post: boolean;
    manage: boolean;
  };
  type Permissions = Record<string, PermissionsType> & {
    // Core modules (PascalCase from permissions endpoint)
    Languages: PermissionsType;
    Employees: PermissionsType;
    Users: PermissionsType;
    Roles: PermissionsType;
    Profile: PermissionsType;
    Permissions: PermissionsType;
    Customers: PermissionsType;
    Modules: PermissionsType;
    Addresses: PermissionsType;
    Banners: PermissionsType;
    Categories: PermissionsType;
    SubCategories: PermissionsType;
    Stores: PermissionsType;
    Service: PermissionsType;
    settings: PermissionsType;
    "Social Media": PermissionsType;
    "System Notifications": PermissionsType;
    fund: PermissionsType;
    Coupons: PermissionsType;
    Schedule: PermissionsType;
    Orders: PermissionsType;
    Cities: PermissionsType;
    "Service Rating": PermissionsType;
    "Store Rating": PermissionsType;
    banks: PermissionsType;
    bankAccounts: PermissionsType;
    statistics: PermissionsType;
    notification: PermissionsType;
    specialists: PermissionsType;
    wallet: PermissionsType;
    withdraw: PermissionsType;
    transactions: PermissionsType;
    Complaints: PermissionsType;
    "store-categories": PermissionsType;
    "block store": PermissionsType;
    "Sub Categories": PermissionsType;
    Zones: PermissionsType;
    Branches: PermissionsType;
    "Store Commission": PermissionsType;
    Rating: PermissionsType;

    // Route/endpoint aliases used across pages/actions
    users: PermissionsType;
    banners: PermissionsType;
    branches: PermissionsType;
    categories: PermissionsType;
    cities: PermissionsType;
    complaint: PermissionsType;
    coupons: PermissionsType;
    deliveryAll: PermissionsType;
    keyvalue: PermissionsType;
    modules: PermissionsType;
    orders: PermissionsType;
    permissions: PermissionsType;
    roles: PermissionsType;
    schedule: PermissionsType;
    services: PermissionsType;
    socialMedia: PermissionsType;
    zones: PermissionsType;
    customers: PermissionsType;
    storeCategories: PermissionsType;
    languages: PermissionsType;
  };

  type Roles = {
    id: ID;
    name: RoleKey;
    default: boolean;
  };
  interface User {
    id: number;
    name: string;
    email: string;
    type: Role;
    status: Status;
    verified: boolean;
    phone: string;
    active: boolean;
    image?: string | null;
    createdAt: string;
    updatedAt: string | null;
  }

  interface AuthData {
    user: User;
    accessToken: string;
  }
}

declare namespace AppConfig {
  type Locale = "ar" | "en" | "admin";
  interface MiniNavItem {
    label: string;
    href: string;
    active?: boolean;
    apiUrl?: string;
  }
  type SearchParams = Promise<{
    page?: number;
    limit?: number;
    branchId?: string | number;
    type?: string;
    domain?: string;
    search?: string;
    sort?: string;

    [key: string]: string | number | boolean | undefined;
  }>;
  interface NavItemChild {
    title?: string;
    url: RoutesKey;
    icon?: MainIconsType;
    info?: React.ReactNode;
    isActive?: boolean;
  }

  interface NavItem {
    title: string;
    isDefaultOpen?: boolean;
    url: RoutesKey;
    info?: React.ReactNode;
    items?: (false | NavItemChild)[];
    icon?: MainIconsType;
  }

  interface Sidebar {
    navMain: NavItem[];
  }
  type ContextParams = Promise<{
    id: string;
    moduleId: string;
    locale: Locale;
    categoryId: string;
  }>;

  interface Context {
    params: ContextParams;
    searchParams: SearchParams;
  }

  interface SystemPermissionMethod {
    id: number;
    method: string;
  }

  interface SystemPermission {
    name: { en: string; ar: string };
    prefix: string;
    methods: SystemPermissionMethod[];
  }
}

declare namespace Entities {
  type TeacherEntity = {
    id: number;
    name: string;
    email: string;
    phone: string;
    verified: boolean;
    active: boolean;
    image: string;
    TeacherDetails: {
      id: number;
      zoomLink: string;
      male: boolean;
      numberOfLessons: number;
      rate: number;
      languageId: string;
      rateCount: number;
      hourPrice: number;
      salary: number;
    };
  };

  type Student = {
    id: number;
    name: string;
    image: string;
  };
  type Lesson = {
    id: number;
    name: string;
    report: string | null; // URL to the report file
    Teacher: TeacherEntity;
    description: string;
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    ended: boolean;
    teacherSalary: number;
    teacherLate: boolean;
    teacherLink: string | null;
    teacherAttend: boolean;
    teacherId: number;
    StudentLessons: {
      link: string | null;
      studentRate: number;
      teacherRate: number;
      report: string | null; // URL to the report file
      studentLate: boolean;
      studentAttend: boolean;
    }[]; // Replace `any` with the correct type if known
  };
  type Homework = {
    id: number;
    name: string;
    homeWorkFile: string;
    corrected: boolean;
    comment: string | null;
    studentHomeWork: unknown; // Change to correct type if known
    studentId: number;
    teacherId: number;
    Teacher: TeacherEntity;
    Student: Student;
  };
}
interface StudentStatistics {
  Plan: {
    id: string | null;
    name: string | null;
    numberOfSubscriptions: number;
  };
  Details: {
    lessonsAttended: number;
    lessonsNotAttended: number;
    lessonsLate: number;
    rate: number;
    reviews: number;
  };
  Graph: {
    x: string;
    y: number;
  }[];
}
interface TeacherStatistics {
  lessonsAttended: number;
  lessonsNotAttended: number;
  lessonsLate: number;
  salary: number;
  hourPrice: number;
  rate: number;
  Language: { name: string };
  Subject: { Subject: { id: number; name: string } }[];
  reviews: number;
}
// Legacy type aliases for backward compatibility
type UrlSearchParamsInterface = Awaited<AppConfig.SearchParams>;
type TFunction = (string) => string;
type NavItemChild = AppConfig.NavItemChild;
type NavItem = AppConfig.NavItem;
type SidebarData = AppConfig.Sidebar;
type SearchParams = AppConfig.SearchParams;
type locales = AppConfig.Locale;
type ApiResponse<T> = API.Response<T>;
type Params = AppConfig.ContextParams;
type Roles = Auth.Roles;
type RoleKey = Auth.RoleKey;
type Permission = Auth.Permissions;
type Homework = Entities.Homework;
type Lesson = Entities.Lesson;
type TeacherEntity = Entities.TeacherEntity;
