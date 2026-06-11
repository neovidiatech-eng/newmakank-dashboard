import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "@/lib/Link";
import { usePathname } from "@/lib/navigation";

export default function SideBarItem({
  item
}: {
  item: {
    title: React.JSX.Element;
    url: string;
  };
}) {
  const pathname = usePathname();
  const isActive = item.url === pathname;

  return (<SidebarMenuItem className="hover:bg-primary/20 rounded">
    <SidebarMenuButton className="rounded hover:bg-primary/20" asChild isActive={isActive}>
      <Link className="rounded hover:bg-primary/20" href={item.url}>
        {item.title}
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
  );
}
