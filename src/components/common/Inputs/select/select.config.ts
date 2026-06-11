import { endpointType } from "@/utils/endpoints";

export const customStyles = (isDarkMode: boolean) => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: isDarkMode ? "transparent" : "hsl(var(--background))",
    borderColor: state.isFocused
      ? "hsl(var(--ring))"
      : isDarkMode
        ? "hsl(var(--border) / 0.5)"
        : "hsl(var(--border))",
    borderRadius: "0.75rem",
    boxShadow: state.isFocused
      ? "0 0 0 2px hsl(var(--ring) / 0.2)"
      : "0 1px 2px rgba(0, 0, 0, 0.05)",
    "&:hover": {
      borderColor: state.isFocused
        ? "hsl(var(--ring))"
        : isDarkMode
          ? "hsl(var(--border))"
          : "hsl(var(--border) / 0.8)",
    },
  }),
  menu: base => ({
    ...base,
    backgroundColor: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.75rem",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    zIndex: 9999,
    pointerEvents: 'auto',
  }),
  	menuPortal: (base) => ({
		...base,
		zIndex: 99999,
		pointerEvents: 'auto',
	}),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? "hsl(var(--accent))"
      : state.isSelected
        ? "hsl(var(--primary) / 0.1)"
        : "transparent",
    color: state.isSelected ? "hsl(var(--primary))" : "hsl(var(--popover-foreground))",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "hsl(var(--accent))",
    },
  }),
  singleValue: base => ({
    ...base,
    color: "hsl(var(--foreground))",
  }),
  multiValue: base => ({
    ...base,
    backgroundColor: "hsl(var(--accent))",
    borderRadius: "0.375rem",
  }),
  multiValueLabel: base => ({
    ...base,
    color: "hsl(var(--accent-foreground))",
  }),
  multiValueRemove: base => ({
    ...base,
    color: "hsl(var(--accent-foreground))",
    "&:hover": {
      backgroundColor: "hsl(var(--destructive) / 0.2)",
      color: "hsl(var(--destructive))",
    },
  }),
  placeholder: base => ({
    ...base,
    color: "hsl(var(--muted-foreground))",
  }),
  input: base => ({
    ...base,
    color: "hsl(var(--foreground))",
  }),
});

export interface SelectPaginatedProps {
   isMulti?: boolean;
   value?: string | string[]; // Allow both single and multi-select values
   placeholder?: string;
   onChange?: (value: Option[] | undefined | string) => void;
   onControlChange?: (value: Option[] | undefined | string) => void;
   name: string;
   idKey?: string;
   onLabelAction?: (data: any) => any;
   labelKey?: string;
   labelFormat?: "storeBranch" | "serviceStore";
   apiUrl: endpointType;
	groupBy?: string;
   searchParamsFilter?: string[];
   searchTermKey?: string;
   searchFilters?: { key: string; value: string | number }[];
   disabled?: boolean;
   allowNew?: boolean; // New prop to allow creating new options
   // formatCreateLabel?: (inputValue: string) => string;
}
export interface Option {
   label: string;
   value: string | number;
   icon?: React.ReactElement;
   __isNew__?: boolean;
}

// Define the props interface with strict typing

// Define the API response item shape
export interface ApiResponseItem {
   [key: string]: any;
   id?: string | number;
   name?: string;
}
