import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n";
import { usePathname, useRouter, useSearchParams } from "@/lib/navigation";
import { useEffect } from "react";
import { TablePaginationType } from "../table.types";

interface PaginationProps {
  pagination: TablePaginationType;
}

export function TablePagination({ pagination }: PaginationProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current page and limit from URL, fallback to defaults
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentLimit = Number(searchParams.get("limit")) || 10;
  const totalPages = Math.max(1, Math.ceil(pagination.total / currentLimit));

  // Correct page if it exceeds total pages or is invalid
  useEffect(() => {
    const validPage = Math.max(1, Math.min(currentPage, totalPages));
    if (currentPage !== validPage) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", validPage.toString());
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [currentPage, totalPages, pathname, router, searchParams]);

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handleLimitChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", value);
    params.set("page", "1"); // Reset to first page on limit change
    router.push(`${pathname}?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | "ellipsis-1" | "ellipsis-2")[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      } else if (i === currentPage - delta - 1) {
        range.push("ellipsis-1");
      } else if (i === currentPage + delta + 1) {
        range.push("ellipsis-2");
      }
    }

    return range;
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>{t("show")}</span>
          <Select value={currentLimit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="h-9 w-[70px] bg-background border-border/60 rounded-lg">
              <SelectValue placeholder={currentLimit.toString()} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 40].map(val => (
                <SelectItem key={val} value={val.toString()}>
                  {val}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="whitespace-nowrap">
          {t("showing")}{" "}
          {pagination.total === 0
            ? 0
            : Math.min((currentPage - 1) * currentLimit + 1, pagination.total)}{" "}
          {t("to")} {Math.min(currentPage * currentLimit, pagination.total)} {t("of")}{" "}
          {pagination.total} {t("entries")}
        </p>
      </div>

      <Pagination className="mx-0 w-auto">
        <PaginationContent className="gap-1 sm:gap-2">
          <PaginationItem>
            <PaginationPrevious
              href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
              className={cn(
                "hover:bg-accent hover:text-accent-foreground transition-colors h-9 px-3",
                currentPage <= 1 && "pointer-events-none opacity-40"
              )}
            />
          </PaginationItem>

          {getPageNumbers().map((page, i) => {
            if (page === "ellipsis-1" || page === "ellipsis-2") {
              return (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href={createPageUrl(pageNum)}
                  isActive={isActive}
                  className={cn(
                    "h-9 w-9 p-0 transition-all duration-200 rounded-lg border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-sm font-bold scale-105"
                      : "bg-background hover:bg-accent hover:text-accent-foreground border-border/60"
                  )}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
              className={cn(
                "hover:bg-accent hover:text-accent-foreground transition-colors h-9 px-3",
                currentPage >= totalPages && "pointer-events-none opacity-40"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
