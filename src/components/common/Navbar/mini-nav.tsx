import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";
import Link from "@/lib/Link";
import * as React from "react";

export default function MiniNav({
  navItems
}: {
  navItems: {
    label: string;
    href: string;
    active?: boolean;
    apiUrl?: string;
  }[];
}): JSX.Element {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const locale = useLocale();
  return (
    <div
      className={cn(
        "relative w-full",
        "transition-all duration-300 ease-in-out",
        "border-b border-transparent",
        "hover:border-primary/50",
        "hover:bg-accent/5"
      )}
    >
      <div className="max-w-full mx-auto px-4">
        <div className="relative">
          <div ref={scrollContainerRef} className="flex overflow-x-auto scrollbar-hide gap-1 py-2">
            {navItems.map(item => (
              <Link
                key={item.label}
                href={`/${locale}${item.href}`}
                className={cn(
                  "whitespace-nowrap px-4 py-2 text-sm rounded-md transition-colors",
                  "hover:bg-gray-100",
                  item.active ? "bg-primary text-white hover:bg-primary" : "text-gray-700"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
