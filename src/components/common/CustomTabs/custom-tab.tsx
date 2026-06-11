import * as Tabs from "@radix-ui/react-tabs";
import { useLocale, useTranslations } from "@/lib/i18n";
import { usePathname, useRouter } from "@/lib/navigation";
import { ReactNode, useMemo } from "react";

export type TabItem = {
  value: string;
  label?: string | ReactNode;
  content: ReactNode;
};

type CustomTabsProps = {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  clearSearchParams?: boolean;
  className?: string;
  tabsListClassName?: string;
  tabTriggerClassName?: string;
  tabContentClassName?: string;
};

export default function CustomTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  clearSearchParams = false,
  className = "w-full",
  tabsListClassName = "",
  tabTriggerClassName = "",
  tabContentClassName = "",
}: CustomTabsProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const activeTabDefault = useMemo(() => {
    if (defaultValue) return defaultValue;
    return tabs?.[0]?.value ?? "";
  }, [defaultValue, tabs]);

  // Base clean UI
  const containerClass = `${className} ${dir === "rtl" ? "rtl" : ""}`;

  const listClass = [
    "inline-flex w-full max-w-[520px] items-center gap-1",
    "rounded-xl bg-muted/60 p-1",
    "border border-border/60",
    "mx-auto",
    dir === "rtl" ? "flex-row-reverse" : "",
    tabsListClassName,
  ].join(" ");

  const triggerClass = [
    "relative flex-1",
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap rounded-lg px-3 py-2",
    "text-sm font-medium",
    "text-muted-foreground",
    "transition",
    "hover:text-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "ring-offset-background",
    "data-[state=active]:bg-background data-[state=active]:text-foreground",
    "data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-border/60",
    "disabled:pointer-events-none disabled:opacity-50",
    tabTriggerClassName,
  ].join(" ");

  const contentClass = [
    "mt-3",
    "rounded-xl border border-border/60 bg-background",
    "p-4",
    "shadow-sm",
    "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    tabContentClassName,
  ].join(" ");

  const handleValueChange = (val: string) => {
    if (onValueChange) {
      onValueChange(val);
    }
    if (clearSearchParams) {
      router.push(pathname, { scroll: false });
    }
  };

  return (
    <Tabs.Root
      defaultValue={activeTabDefault}
      value={value}
      onValueChange={handleValueChange}
      className={containerClass}
      dir={dir}
    >
      <Tabs.List className={listClass} aria-label="tabs">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className={triggerClass}
          >
            <span className="truncate">
              {tab.label ?? t(tab.value)}
            </span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {tabs.map((tab) => (
        <Tabs.Content
          key={tab.value}
          value={tab.value}
          className={contentClass}
        >
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
