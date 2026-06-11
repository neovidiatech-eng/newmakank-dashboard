import { ExpandableButton } from "@/components/ui/ExpandableButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Download, FileDown } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { TableHeaders } from "../table.types";

interface CSVExportButtonProps {
  headers: TableHeaders[];
  data: Record<string, unknown>[];
  filename?: string;
  className?: string;
}

export default function CSVExportButton({
  headers,
  data,
  filename = "table",
  className = "p-2 bg-primary hover:text-primary text-white"
}: CSVExportButtonProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const exportableHeaders = useMemo(
    () => headers.filter(header => !header.hide && !isIdKey(header.name)),
    [headers]
  );
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    exportableHeaders.map(header => header.name)
  );
  const t = useTranslations()
  useEffect(() => {
    const exportableNames = exportableHeaders.map(header => header.name);
    setSelectedColumns(current => {
      if (current.length === 0) {
        return exportableNames;
      }
      const filtered = current.filter(name => exportableNames.includes(name));
      return filtered.length > 0 ? filtered : exportableNames;
    });
  }, [exportableHeaders]);

  const allSelected = selectedColumns.length === exportableHeaders.length;
  const hasSelection = selectedColumns.length > 0;
  const indeterminate = hasSelection && !allSelected;

  const columnsForExport = exportableHeaders.filter(header =>
    selectedColumns.includes(header.name)
  );

  function toggleAllColumns(checked: boolean) {
    setSelectedColumns(checked ? exportableHeaders.map(header => header.name) : []);
  }

  function toggleColumn(name: string) {
    setSelectedColumns(current =>
      current.includes(name) ? current.filter(item => item !== name) : [...current, name]
    );
  }

  // Helper to get nested value from object
  function getNestedValue(obj: any, path: string): any {
    if (!path) return undefined;
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  }

  // Download table as Excel
  function downloadExcel() {
    if (!columnsForExport?.length || !data || data.length === 0) return;

    try {
      // Prepare worksheet data: first row is headers, then rows
      const wsData = [
        columnsForExport?.map(header => header.label ?? header.name),
        ...data.map(row =>
          columnsForExport?.map(header => cellToText(getNestedValue(row, header.name)))
        )
      ];

      // Create worksheet and workbook
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Write workbook and trigger download
      XLSX.writeFile(wb, `${filename}.xlsx`);
      setIsOpen(false);
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  }

  if (!data || data?.length === 0) {
    return <></>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ExpandableButton
          type="button"
          variant="secondary"
          icon={<FileDown className="size-4" />}
          label={t("export")}
          className={cn("flex hover:bg-transparent items-center gap-2", className)}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <Download className="h-4 w-4 text-primary" />
            {t("export-table-data")}
          </DialogTitle>
          <DialogDescription>
            {t("select-columns-description")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allSelected ? true : indeterminate ? "indeterminate" : false}
                onCheckedChange={value => toggleAllColumns(Boolean(value))}
                aria-label={t("select-all-columns")}
              />
              <span className="text-sm font-medium">{t("select-all")}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {selectedColumns.length}/{exportableHeaders.length} {t("selected")}
            </span>
          </div>

          <ScrollArea className="h-56 rounded-lg border border-border p-3">
            <div className="space-y-2">
              {exportableHeaders.map(header => {
                const label = header.label ?? prettifyLabel(header.name);
                const isChecked = selectedColumns.includes(header.name);
                return (
                  <label
                    key={header.name}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm",
                      isChecked ? "bg-muted" : "hover:bg-muted/60"
                    )}
                  >
                    <span className="truncate">{label}</span>
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleColumn(header.name)}
                      aria-label={t("select-column", { label })}
                    />
                  </label>
                );
              })}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            {t("Cancel")}
          </Button>
          <Button type="button" onClick={downloadExcel} disabled={!hasSelection}>
            {t("export")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function isIdKey(key: string): boolean {
  const normalized = key.toLowerCase();
  return normalized === "id" || normalized.endsWith("id");
}

function prettifyLabel(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, char => char.toUpperCase());
}

// Helper to convert a value to plain text for Excel cell
function cellToText(val: unknown): string {
  if (React.isValidElement(val)) {
    return extractTextFromElement(val);
  }

  if (val instanceof Date) {
    return val.toISOString();
  }

  if (Array.isArray(val)) {
    return val
      .map(item => cellToText(item))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof val === "object" && val !== null) {
    // If it's a localized object, prefer the current locale if available
    // otherwise join all values
    const entries = Object.entries(val as Record<string, unknown>).filter(
      ([key]) => !isIdKey(key) && key !== "__typename"
    );

    if (entries.length === 0) {
      return "";
    }

    return entries
      .map(([, value]) => cellToText(value))
      .filter(v => v !== undefined && v !== null && v !== "")
      .join(" | ");
  }

  if (val === undefined || val === null) {
    return "";
  }

  return String(val);
}

function extractTextFromElement(element: React.ReactElement): string {
  const props = element.props as { children?: unknown };
  if (typeof props.children === "string") {
    return props.children;
  }
  if (Array.isArray(props.children)) {
    return props.children
      .map(child => {
        if (typeof child === "string") return child;
        if (React.isValidElement(child)) return extractTextFromElement(child);
        return "";
      })
      .join(" ");
  }
  if (React.isValidElement(props.children)) {
    return extractTextFromElement(props.children);
  }
  return "";
}
