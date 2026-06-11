import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Image from "@/lib/Image";
import { Notifications } from "./layouts/notification/notifiactions";

export function SidebarBrandHeader(): JSX.Element {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild size="lg">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-10 items-center justify-center rounded-md ">
                <Image src={"/logo.png"} width={20} height={20} alt="Logo" />
              </span>
            </div>
            <div className="flex items-center gap-2 text-sidebar-foreground/70">
              <Notifications />
              {/* <LayoutGrid className="size-4" aria-hidden="true" /> */}
            </div>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
