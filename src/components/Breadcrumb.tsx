import { Link } from "@/lib/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import React from "react";
import { mainIcons } from "../utils/icons";

interface BreadcrumbProps {
  items: (
    | undefined
    | {
      label: string;
      href?: string;
    }
  )[];
  children?: React.ReactNode;
}

export function Breadcrumb({ items, children }: BreadcrumbProps) {
  const t = useTranslations();
  return (
    <nav className="flex items-center justify-between gap-4" aria-label="Breadcrumb">
      <ol className="inline-flex  space-x-2 md:space-x-3">
        <li className="inline-flex  items-start">
          <Link
            href="/dashboard"
            className="inline-flex gap-2 items-center text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-200"
          >
            <Home className="w-5 h-5 mr-2 stroke-2" />
            <span className="ms-1">{t("Home")}</span>
          </Link>
        </li>
        {items?.map(item => {
          if (!item) return;
          if (!isNaN(Number(item.label))) return;
          const icon = mainIcons[item.label];

          return (
            <li key={item.label}>
              <div className="flex items-center">
                <ChevronRight className="w-5 h-5 text-gray-400 mx-2 stroke-2" />
                {icon &&
                  React.createElement(icon, {
                    className: "mx-2",
                    size: 17
                  })}
                {item.href ? (
                  <Link
                    href={`#`}
                    // href={`/${locale}${item.href}`}
                    className="text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                  >
                    <span className="">{t(item.label)}</span>
                  </Link>
                ) : (
                  <span className="text-lg font-semibold text-gray-500">{t(item.label)}</span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="flex items-center gap-2">
        {children}
      </div>
      {/* <BackButton /> */}
    </nav>
  );
}
