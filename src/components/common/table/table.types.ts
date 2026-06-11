import { endpointType } from "@/utils/endpoints";

export type TableHeaders = {
  name: string; // The key used for data lookup (similar to dataIndex in Ant Design)
  label?: string; // A more user-friendly header label
  width?: string; // Optional width (e.g., "100px", "20%")
  // Additional features
  // tooltip?: string; // Provides additional information on hover
  // customRender?: (cell: any, rowData: Record<string, any>) => React.ReactNode; // Override cell rendering
  // editable?: boolean; // Allow cell editing
  className?: string; // Custom CSS classes for the header
  hide?: boolean; // Hide this column if needed
  minWidth?: string; // Minimum width for responsive layouts

  // Ant Design inspired options
  // ellipsis?: boolean; // Display ellipsis if content overflows
  // fixed?: "left" | "right"; // Fix column on the left or right
  // responsive?: string[]; // Responsive breakpoints (e.g., ['sm', 'md'])

  // Extended customization options
  cellClassName?: string; // Additional CSS classes for table cells in this column
  // colSpan?: number; // Column span (when you need to merge headers)
  // rowSpan?: number; // Row span for header cells
};
export type TableActionsType = {
  onInfo?: boolean | string;
  additionalActions?: React.ReactNode;
  renderRowActions?: (rowData: Record<string, unknown>) => React.ReactNode;
  onEdit?: boolean | string;
  onDelete?: endpointType;
  fixedActions?: boolean;
  className?: string;
  defaultApiPath?: string;
  onChangeStatus?: endpointType;
  children?: React.ReactElement;
  statusKey?: string;
  status?: string;
  statusOptions?: string[];
  links?: { label: string; href: string }[];
};

export type TablePaginationType = {
  total: number;
};
