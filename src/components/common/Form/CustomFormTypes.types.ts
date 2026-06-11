import { endpointType } from "@/utils/endpoints";

export type inputTypes =
  | "select"
  | "text"
  | "link"
  | "map"
  | "textarea"
  | "number"
  | "img"
  | "checkbox"
  | "email"
  | "tel"
  | "multiSelect"
  | "password"
  | "selectPaginated"
  | "textEditor"
  | "tag-input"
  | "time"
  | "price"
  | "file"
  | "radioGroup"
  | "map-zone"
  |'hh-mm'
  | "year"
  | "filesUpload"
  | "title"
  | "color"
  | "space"
  | "video"
  | "date";
export type CardConfig = {
  id?: number | string;
  title?: string | JSX.Element;
  width: number;
  icon?: JSX.Element;
  multiLang?: boolean;
};
export type FormInput = {
  name: string;
  type: inputTypes;
  label?: string | JSX.Element;
  defaultValue?: string;
  id?: string;
  apiUrl?: endpointType;
  ratio?: string;
  inputClassName?: string;
  placeholder?: string;
  multiLang?: boolean;
  idKey?: string;
  labelKey?: string;
  labelFormat?: "storeBranch" | "serviceStore";
  availableLanguages?: string[];
  min?: Date | number | string;
  value?: string | number;
  required?: boolean;
  disabled?: boolean;
  isMulti?: boolean;
  max?: number;
  onRemove?: (file: string) => Promise<void | {
    success: boolean;
  }>;
  width?: number;
  cardId?: number | string;
  toolTip?: string;
  onChange?: (value: Option[] | string) => void;
  map?: {
    center: {
      lat: number;
      lng: number;
    };
  };
  options?: Option[];
  isHidden?: boolean;
  searchFilters?: { key: string; value: string | number }[];
};

export type FormLangs = "Ar" | "En" | "default" | "changeToAr" | "changeToEn" | "changeToDefault";

export interface Option {
  label: string;
  value: boolean | string | number;
}
