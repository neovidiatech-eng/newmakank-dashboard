import { usePathname } from "@/lib/navigation";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function PageType(): {
  pageType: string;
  pageName: string;
  id?: string;
} {
  const pathName = usePathname();
  const [...links] = pathName.split("/");

  const pageType = links[links.length - 1];
  if (pageType == "edit") {
    return {
      pageName: links[links.length - 3],
      id: links[links.length - 2],
      pageType
    };
  }

  return {
    pageType,
    pageName:
      links[links.length - 1] != "edit" || links[links.length - 1] != "create"
        ? links[links.length - 2]
        : links[links.length - 1]
  };
}
