import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslations } from "@/lib/i18n";
import React, { useState } from "react";
import type { FormInput } from "../Form/CustomFormTypes.types";
import { TableActionsType, TablePaginationType } from "./table.types";
import TableActions from "./tableActions/TableActions";
import BasicTableHeader from "./tableHelperComponents/BasicTableHeader";
import TableNoData from "./tableHelperComponents/TableNoData";
import { TablePagination } from "./tableHelperComponents/TablePagination";

interface TableBasicProps {
  data: Record<string, unknown>[];
  columns: ColumnDef<Record<string, unknown>>[] | (() => ColumnDef<Record<string, unknown>>[]);
  tableActions?: TableActionsType;
  filters?: FormInput[];
  pagination?: TablePaginationType;
  cardHeader?: string;
  hideCreateNew?: boolean;
  createNewLink?: string;
  expandable?: {
    ExpandedRowComponent: React.ComponentType<{ row: Record<string, unknown> }>;
    expandedRowKey?: string;
  };
  isInnerTable?: boolean;
  rowSelection?: {
    selectedIds: string[];
    onToggle: (id: string) => void;
    onToggleAll?: (ids: string[]) => void;
    getRowId?: (row: Record<string, unknown>) => string;
  };
}

export default function TableBasic({
  data,
  columns,
  tableActions,
  filters,
  pagination,
  cardHeader,
  hideCreateNew,
  createNewLink,
  expandable,
  isInnerTable = false,
  rowSelection
}: TableBasicProps): JSX.Element {
  const t = useTranslations();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRowId(prev => (prev === rowId ? null : rowId));
  };

  // ... (rest of the setup code remains the same until TableBody) ...
  // Set totalData if not already provided.
  if (pagination && pagination.total === undefined) {
    pagination.total = data?.length || 0;
  }

  const hasData = Boolean(data && data?.length > 0);

  // Resolve columns - if it's a function, call it
  const resolvedColumns = typeof columns === "function" ? columns() : columns;

  // Create table instance with tanstack-table
  const table = useReactTable({
    data: data || [],
    columns: resolvedColumns,
    getCoreRowModel: getCoreRowModel()
  });

  // Get headers and rows from table
  const { getHeaderGroups, getRowModel } = table;
  const rows = getRowModel()?.rows;
  const getSelectableRowId = (row: Record<string, unknown>) =>
    rowSelection?.getRowId?.(row) ?? String(row.id);
  const visibleSelectionIds = rows
    .map(row => getSelectableRowId(row.original))
    .filter(Boolean);
  const selectedVisibleCount = visibleSelectionIds.filter(id =>
    rowSelection?.selectedIds.includes(id)
  ).length;
  const areAllVisibleRowsSelected =
    Boolean(rowSelection) &&
    visibleSelectionIds.length > 0 &&
    selectedVisibleCount === visibleSelectionIds.length;
  const areSomeVisibleRowsSelected =
    Boolean(rowSelection) &&
    selectedVisibleCount > 0 &&
    selectedVisibleCount < visibleSelectionIds.length;
  const extraColumnCount =
    (rowSelection ? 1 : 0) +
    (expandable && !isInnerTable ? 1 : 0) +
    (tableActions && Object.values(tableActions).filter(Boolean)?.length > 0 ? 1 : 0);

  const tableContent = (
    <>
      {!isInnerTable && (
        <div className="p-6 border-b border-gray-200/80 dark:border-gray-800">
          <BasicTableHeader
            headers={resolvedColumns?.map(col => ({
              name: (col as any).accessorKey || (col as any).id || "column"
            }))}
            data={data}
            cardHeader={cardHeader}
            filters={filters}
            hideCreateNew={hideCreateNew}
            createNewLink={createNewLink}
          />
        </div>
      )}

      {!hasData ? (
        <TableNoData />
      ) : (
        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Table className="w-full min-w-max">
            <TableHeader
              className={
                isInnerTable ? "bg-gray-100 dark:bg-slate-900/50" : "bg-gray-50 dark:bg-slate-900"
              }
            >
              {getHeaderGroups().map(headerGroup => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-transparent"
                >
                  {expandable && !isInnerTable && (
                    <TableHead className="w-12 text-center font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 py-3 sm:py-4 px-3 sm:px-6">
                      {/* Expand column header */}
                    </TableHead>
                  )}
                  {rowSelection && (
                    <TableHead className="w-12 text-center font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 py-3 sm:py-4 px-3 sm:px-6">
                      <Checkbox
                        aria-label={t("Select all orders")}
                        checked={
                          areSomeVisibleRowsSelected ? "indeterminate" : areAllVisibleRowsSelected
                        }
                        onCheckedChange={() => {
                          rowSelection.onToggleAll?.(visibleSelectionIds);
                        }}
                      />
                    </TableHead>
                  )}
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header?.id}
                      className="capitalize text-center font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 py-3 sm:py-4 px-3 sm:px-6"
                    >
                      <div className="whitespace-normal break-words flex items-center justify-center">
                        {header?.isPlaceholder
                          ? null
                          : flexRender(
                            typeof header?.column?.columnDef?.header == "string"
                              ? t(header?.column?.columnDef?.header)
                              : header?.column?.columnDef?.header,
                            header?.getContext()
                          )}
                      </div>
                    </TableHead>
                  ))}
                  {tableActions && Object.values(tableActions).filter(Boolean)?.length > 0 && (
                    <TableHead className={cn(
                      "capitalize text-center font-semibold text-xs sm:text-sm text-gray-700 dark:text-gray-300 py-3 sm:py-4 px-3 sm:px-6",
                      tableActions?.fixedActions && "sticky end-0 bg-gray-50 dark:bg-[#020817] z-1 shadow-[-4px_0_4px_-2px_rgba(0,0,0,0.05)] rtl:shadow-[4px_0_4px_-2px_rgba(0,0,0,0.05)]",
                      tableActions?.fixedActions && isInnerTable && "bg-gray-100 dark:bg-slate-900/50"
                    )}>
                      {t("Actions")}
                    </TableHead>
                  )}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {rows.map(row => {
                const rowId = expandable?.expandedRowKey
                  ? String(row?.original[expandable.expandedRowKey])
                  : row?.id;
                const isExpanded = expandedRowId === rowId;

                return (
                  <React.Fragment key={row?.id}>
                    <TableRow
                      className={cn(
                        "group border-b border-gray-100/50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-900/40 transition-colors",
                        isInnerTable ? "bg-gray-50/50 dark:bg-slate-900/20" : "bg-white dark:bg-transparent"
                      )}
                    >
                      {expandable && !isInnerTable && (
                        <TableCell className="text-center py-3 sm:py-4 px-3 sm:px-6">
                          <button
                            onClick={() => toggleRowExpansion(rowId)}
                            className="p-1 hover:bg-gray-200/60 dark:hover:bg-gray-700 rounded transition-colors"
                            aria-label={isExpanded ? "Collapse row" : "Expand row"}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            )}
                          </button>
                        </TableCell>
                      )}
                      {rowSelection && (
                        <TableCell className="text-center py-3 sm:py-4 px-3 sm:px-6">
                          <Checkbox
                            aria-label={t("Select order")}
                            checked={rowSelection.selectedIds.includes(
                              getSelectableRowId(row.original)
                            )}
                            onCheckedChange={() => {
                              rowSelection.onToggle(getSelectableRowId(row.original));
                            }}
                          />
                        </TableCell>
                      )}
                      {row?.getVisibleCells().map(cell => (
                        <TableCell
                          key={cell?.id}
                          className="text-center py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-800 dark:text-gray-200"
                        >
                          {flexRender(cell?.column?.columnDef?.cell, cell?.getContext())}
                        </TableCell>
                      ))}

                      {tableActions && Object.values(tableActions).filter(Boolean)?.length > 0 && (
                        <TableCell className={cn(
                          "text-center py-3 sm:py-4 px-3 sm:px-6",
                          tableActions?.fixedActions && "sticky end-0 z-1 shadow-[-4px_0_4px_-2px_rgba(0,0,0,0.05)] rtl:shadow-[4px_0_4px_-2px_rgba(0,0,0,0.05)]",
                          tableActions?.fixedActions && (isInnerTable ? "bg-gray-50/50 dark:bg-slate-900" : "bg-white dark:bg-[#020817]"),
                          tableActions?.fixedActions && "group-hover:bg-gray-50 dark:group-hover:bg-slate-900"
                        )}>
                          <TableActions
                            className="justify-center items-center gap-2"
                            status={row?.original.status as string}
                            {...tableActions}
                            id={row?.original.id as string}
                            rowData={row?.original}
                          />
                        </TableCell>
                      )}
                    </TableRow>

                    <AnimatePresence initial={false}>
                      {expandable && !isInnerTable && isExpanded && (
                        <TableRow className="bg-gray-50/50 dark:bg-slate-900/30 border-b border-gray-100 dark:border-gray-800">
                          <TableCell
                            colSpan={
                              resolvedColumns?.length +
                              extraColumnCount
                            }
                            className="p-0 border-0"
                          >
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="p-6">
                                <expandable.ExpandedRowComponent row={row?.original} />
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </motion.div>
      )}
      {pagination && hasData && !isInnerTable && (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-950 p-6">
          <TablePagination pagination={pagination} />
        </div>
      )}
    </>
  );

  if (isInnerTable) {
    return (
      <div className="bg-white dark:bg-slate-950 rounded-lg border border-gray-200/80 dark:border-gray-800">
        {tableContent}
      </div>
    );
  }

  return (
    <Card className="p-0 overflow-hidden bg-white dark:bg-slate-950 border-gray-200/80 dark:border-gray-800 shadow-sm">
      {tableContent}
    </Card>
  );
}
