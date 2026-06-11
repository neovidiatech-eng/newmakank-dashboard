/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "@/lib/i18n";
import Link from "@/lib/Link";
import { usePathname } from "@/lib/navigation";
import { useMemo, useState } from "react";
import { mainIcons } from "../../../utils/icons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import SidebarTitleIcon from "./sidebar-title-icon";

function SideBarItems({ links }: { links: NavItem[] }): JSX.Element {
  const locale = useLocale();
  const pathname = usePathname();
  const currentPath = pathname;
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");
  const matchesSearchTerm = (text: string | React.ReactNode | undefined): boolean => {
    if (!text || typeof text !== "string") return false;
    const textString = text.toString().toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    // Try direct text match first (supports Arabic and other languages)
    if (textString.includes(searchLower)) {
      return true;
    }

    // Then try translation if available
    try {
      const localizedText = textString.toLowerCase();
      return localizedText.includes(searchLower);
    } catch (e: unknown) {
      // If translation fails, fall back to direct text matching
      return textString.includes(searchLower);
    }
  };

  const { open } = useSidebar();
  // Memoized filtered links for better performance
  const filteredLinks = useMemo(() => {
    return links
      .map(item => {
        if (!item) return null;

        const parentMatches = matchesSearchTerm(t(item.title));

        if (parentMatches) return item;

        if (item.items && Array.isArray(item.items)) {
          const matchingChildren = item.items.filter(child => {
            return child && child.title && matchesSearchTerm(t(child.title));
          });

          if (matchingChildren.length > 0) {
            return {
              ...item,
              items: matchingChildren
            };
          }
        }

        return null;
      })
      .filter((item): item is (typeof links)[number] => !!item);
  }, [links, searchTerm]);

  // Helper function to check if a path is active
  const normalizePath = (path: string) => {
    if (!path) return "/";
    const trimmed = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
    return trimmed || "/";
  };

  const isLinkActive = (targetPath: string) => {
    const normalizedTarget = normalizePath(targetPath);
    const normalizedCurrent = normalizePath(currentPath);
    if (normalizedCurrent === normalizedTarget) return true;
    return normalizedCurrent.startsWith(`${normalizedTarget}/`);
  };
  return (
    <>
      <div className={cn("px-2 pt-3", !open && "hidden")}>
        <input
          type="text"
          placeholder={t("Search")}
          className="w-full rounded-md border border-sidebar-border bg-background/60 px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <SidebarMenu>
        {filteredLinks.map(item => {
          if (!item) return null;

          const parentFullPath = `/${locale}${item.url}`;
          const isParentActive = isLinkActive(parentFullPath);
          const isAnyChildActive = item.items?.some(child => {
            if (!child) return false;
            const childFullPath = `/${locale}${child.url}`;
            return isLinkActive(childFullPath);
          });
          const defaultOpen = isParentActive || isAnyChildActive;

          return (
            <div key={item.title}>
              {item?.items && item?.items.length ? (
                <Collapsible defaultOpen={defaultOpen || item?.isDefaultOpen} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        className={cn(
                          "flex justify-between font-medium",
                          isParentActive || isAnyChildActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-foreground/80 hover:text-foreground"
                        )}
                        isActive={isParentActive || isAnyChildActive}
                      >
                        <div className="flex items-baseline gap-2">
                          {typeof item.title === "string" && item.title in mainIcons && (
                            <span
                              className={cn(
                                "text-[18px]",
                                isParentActive || isAnyChildActive
                                  ? "text-sidebar-accent-foreground"
                                  : "text-foreground/80 group-hover:text-foreground"
                              )}
                            >
                              <SidebarTitleIcon item={item} />
                            </span>
                          )}
                          {open && (
                            <h1
                              className={cn(
                                "text-[15px]",
                                isParentActive || isAnyChildActive
                                  ? "text-sidebar-accent-foreground"
                                  : "text-foreground/80 group-hover:text-foreground"
                              )}
                            >
                              {open && t(item.title)}
                            </h1>
                          )}
                        </div>
                        <span
                          className={cn(
                            "transition-colors",
                            isParentActive || isAnyChildActive
                              ? "text-sidebar-accent-foreground"
                              : "text-foreground/70 group-hover:text-foreground"
                          )}
                        >
                          {item?.info}
                          <ChevronDown size={18} />
                        </span>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-1">
                      <SidebarMenuSub>
                        {item.items?.map(child => {
                          if (!child) return null;
                          const childFullPath = `/${locale}${child.url}`;
                          const isChildActive = isLinkActive(childFullPath);
                          return (
                            <SidebarMenuSubItem className="ms-1" key={child.title}>
                              <Link
                                href={child.url ? childFullPath : "#"}
                                className={cn(
                                  "inline-flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm",
                                  isChildActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-foreground/80 hover:bg-sidebar-accent/50 hover:text-foreground"
                                )}
                              >
                                {child.title && (
                                  <span
                                    className={cn(
                                      isChildActive
                                        ? "text-sidebar-accent-foreground"
                                        : "text-foreground/70 group-hover:text-foreground"
                                    )}
                                  >
                                    <SidebarTitleIcon item={child as NavItem} />
                                  </span>
                                )}
                                <div className="flex justify-between w-full">
                                  <div>{open && child?.title && t(child?.title?.toString())}</div>
                                  {(child?.info || child?.info === 0) && <span>{child?.info}</span>}
                                </div>
                              </Link>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isParentActive} className="font-medium">
                    <Link
                      href={item.url ? `/${locale}${item.url}` : "#"}
                      className={cn(
                        "inline-flex w-full items-center gap-3",
                        isParentActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-foreground/80 hover:text-foreground"
                      )}
                    >
                      <SidebarTitleIcon isParentActive={isParentActive} item={item} />
                      {open && t(item.title)}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </div>
          );
        })}
      </SidebarMenu>
    </>
  );
}

export default SideBarItems;
