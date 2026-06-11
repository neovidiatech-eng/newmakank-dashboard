import { routesKey } from "@/utils/routes";
import { handleLinkClient } from "@/utils/routing/handleLinkClient";
import { useLocale } from "@/lib/i18n";
import Link from "@/lib/Link";
import { usePathname, useSearchParams } from "@/lib/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export default function SideBarItem({
  item
}: {
  item:
  | {
    title: string;
    icon?: React.JSX.Element | string;
    url: routesKey;
    items: {
      title: React.JSX.Element;
      url: routesKey;
      icon?: React.JSX.Element | string;
    };
  }
  | {
    title: React.JSX.Element;
    icon?: React.JSX.Element | string;
    url: routesKey;
    items: {
      title: React.JSX.Element;
      icon?: React.JSX.Element | string;
      url: routesKey;
    };
  };
}) {
  const locale = useLocale();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const isActive =
    `${pathname}${searchParams.toString().length > 0 ? `?${searchParams.toString()}` : ""}` ==
    `/${locale}${item.url}`;
  return (
    <SidebarMenuItem className="hover:bg-primary/15 rounded" key={item.url}>
      <SidebarMenuButton
        className={`rounded hover:bg-primary/15 ${isActive ? "bg-primary/80 text-primary-foreground" : ""}`}
        asChild
        isActive={isActive}
      >
        <Link
          className={`rounded hover:bg-primary/15 text-foreground ${isActive ? "bg-primary/80 text-primary-foreground" : ""
            }`}
          href={handleLinkClient(item.url, locale)}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.title}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
