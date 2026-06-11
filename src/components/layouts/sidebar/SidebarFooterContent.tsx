import UserDropdown from "@/components/UserDropdown";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const SidebarFooterContent = ({
  name,
  image, email
}: {
  name: string;
  image: string;
  email: string;
}) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-sidebar-border pt-3",
        isCollapsed ? "items-center" : "items-stretch"
      )}
    >
      <div
        className={cn(
          "rounded-xl border border-sidebar-border/60  p-2 shadow-sm transition ",
          isCollapsed ? "w-full border-0 max-w-[56px]" : "w-full"
        )}
      >
        <UserDropdown
          compact={isCollapsed}
          user={{
            email,
            name,
            image
          }}
        />
      </div>
    </div>
  );
};

export default SidebarFooterContent;
