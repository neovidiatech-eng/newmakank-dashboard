import { useApiQuery } from "@/hooks/useApiQuery";
import { useSearchParams } from "@/lib/navigation";
import TableBasic from "./TableBasic";
import type { ColumnDef } from "@tanstack/react-table";
import type { FormInput } from "../Form/CustomFormTypes.types";
import type { TableActionsType } from "./table.types";
import React from "react";

interface TableWithQueryProps {
  endPoint: (string | number)[];
  columns: ColumnDef<Record<string, unknown>>[] | (() => ColumnDef<Record<string, unknown>>[]);
  tableActions?: TableActionsType;
  filters?: FormInput[];
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
  dataKey?: string; // optional key to access nested data e.g. "data" or "items"
  extraParams?: Record<string, unknown>;
}

export default function TableWithQuery({
  endPoint,
  columns,
  tableActions,
  filters,
  cardHeader,
  hideCreateNew,
  createNewLink,
  expandable,
  isInnerTable,
  rowSelection,
  dataKey,
  extraParams = {}
}: TableWithQueryProps) {
  const searchParams = useSearchParams();

  // Build params from URL searchParams + extraParams
  const params: Record<string, unknown> = { ...extraParams };
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  const queryKey = [endPoint.join("/"), JSON.stringify(params)];

  const { data: response, isLoading } = useApiQuery({
    queryKey,
    endPoint,
    params,
    staleTime: 0 // always fresh
  });

  const rawData = response?.data;
  // Handle nested data structures gracefully
  let actualData = rawData;
  if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
    actualData = rawData.data || rawData.items || rawData;
  }
  const tableData: Record<string, unknown>[] = Array.isArray(actualData)
    ? actualData
    : dataKey && rawData?.[dataKey]
    ? (rawData[dataKey] as Record<string, unknown>[])
    : [];

  console.log("TableWithQuery debug:", { endPoint, params, response, rawData, tableData, isLoading });

  const total = response?.total ?? tableData.length;

  if (isLoading && tableData.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm animate-pulse">
        جاري التحميل...
      </div>
    );
  }

  return (
    <TableBasic
      data={tableData}
      columns={columns}
      tableActions={tableActions}
      filters={filters}
      cardHeader={cardHeader}
      hideCreateNew={hideCreateNew}
      createNewLink={createNewLink}
      expandable={expandable}
      isInnerTable={isInnerTable}
      rowSelection={rowSelection}
      pagination={{ total }}
    />
  );
}
