import { fetchHelper } from "@/api/fetch";
import getPermissions from "@/api/permissions";
import { SidebarBrandHeader } from "@/components/sidebar-brand-header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail
} from "@/components/ui/sidebar";
import SideBarItems from "./layouts/sidebar/SideBarItems";
import SidebarFooterContent from "./layouts/sidebar/SidebarFooterContent";
import { links } from "./layouts/sidebar/sidebar-data";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const FALLBACK_SIDEBAR_PERMISSIONS = {
  statistics: { get: true },
  Stores: { get: true },
  "customer-categories": { get: true },
  customerCategories: { get: true },
  "store-templates": { get: true },
  storeTemplates: { get: true },
  Schedule: { get: true },
  Branches: { get: true },
  Rating: { get: true },
  Banners: { get: true },
  Categories: { get: true },
  Service: { get: true },
  Coupons: { get: true },
  "Social Media": { get: true },
  Roles: { get: true },
  Permissions: { get: true },
  Users: { get: true },
  Customers: { get: true },
  delivery: { get: true },
  specialists: { get: true },
  Cities: { get: true },
  Zones: { get: true },
  Orders: { get: true },
  Complaints: { get: true },
  withdraw: { get: true },
  banks: { get: true },
  fund: { get: true },
  transactions: { get: true },
  bankAccounts: { get: true },
  wallet: { get: true },
  settings: { get: true }
} as unknown as Permission;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const permissionsQuery = useQuery({
    queryKey: ["myPermissions"],
    queryFn: getPermissions,
    staleTime: 60_000,
    retry: false
  });

  console.log("DEBUG MY PERMISSIONS:", permissionsQuery.data);

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchHelper({ endPoint: ["profile"] }),
    staleTime: 60_000,
    retry: false
  });

  const filterLink = useMemo(() => {
    const generated = links({ permissions: (permissionsQuery.data ?? {}) as Permission });

    if (generated.length > 0) {
      return generated;
    }

    return links({ permissions: FALLBACK_SIDEBAR_PERMISSIONS });
  }, [permissionsQuery.data]);
  const profile = profileQuery.data?.data?.user;

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarBrandHeader />
      </SidebarHeader>
      <SidebarContent>
        <SideBarItems links={filterLink} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterContent
          email={profile?.email ?? ""}
          name={profile?.name ?? ""}
          image={profile?.image ?? ""}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
