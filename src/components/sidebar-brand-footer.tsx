import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { ChevronUp, Sparkles } from "lucide-react";

export function SidebarBrandFooter(): JSX.Element {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild size="lg">
          <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-sidebar-border/70 bg-sidebar-accent/30 px-3 py-2 shadow-sm transition hover:bg-sidebar-accent/50 hover:shadow-md">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-sidebar-accent to-sidebar-primary/40 text-sidebar-accent-foreground shadow-inner">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-sidebar-foreground">Alpha Inc.</span>
                <div className="flex items-center gap-2 text-xs text-sidebar-foreground/70">
                  <span className="rounded-full bg-sidebar-foreground/10 px-2 py-0.5 font-medium uppercase tracking-wide text-sidebar-foreground/80">
                    Free
                  </span>
                  <span className="text-[11px] text-sidebar-foreground/60">Upgrade anytime</span>
                </div>
              </div>
            </div>
            <span className="flex size-7 items-center justify-center rounded-full bg-sidebar-foreground/10 text-sidebar-foreground/70">
              <ChevronUp className="size-4" aria-hidden="true" />
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
