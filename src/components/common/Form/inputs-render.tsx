/* eslint-disable @typescript-eslint/no-explicit-any */
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "@/lib/dynamic";
import { Suspense } from "react";
import type { FieldErrors } from "react-hook-form";
import { DateTimeInput } from "../Inputs/date/date-time-input";
import PdfInput from "../Inputs/files/PdfInput";
import VideoInput from "../Inputs/files/video-input";
import MapPointerInput from "../Inputs/map/MapPointerInput";
import ColorInput from "../Inputs/other/color-input";
import CustomPhoneInput from "../Inputs/phone/PhoneInput";
import PasswordInput from "../Inputs/text/password-input";
import type { FormInput } from "./CustomFormTypes.types";
import { getNestedError } from "./hooks/errors";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
const MapZoneInput = dynamic(() => import("../Inputs/map/MapZoneInput"), { ssr: false });

const CheckBoxInput = dynamic(() => import("../Inputs/select/CheckBoxInput"));
const DateInput = dynamic(() => import("../Inputs/date/DateInput").then(mod => mod.DateInput));
const FilesUploadInput = dynamic(() => import("../Inputs/files/FilesUploadInput"));
const ImgInput = dynamic(() => import("../Inputs/files/ImgInput"));
const MultiSelectInput = dynamic(() => import("../Inputs/select/MultiSelectInput"));
const NumberInput = dynamic(() => import("../Inputs/text/NumberInput"));
const RadioButtonInput = dynamic(() => import("../Inputs/select/RadioButtonInput"));
const SelectInput = dynamic(() => import("../Inputs/select/SelectInputs"));
const SelectPaginated = dynamic(() => import("../Inputs/select/SelectPaginatedInput"));
const TextEditor = dynamic(() => import("../Inputs/text/TextEditor"));
const TextInput = dynamic(() => import("../Inputs/text/TextInput"));
const TimeInput = dynamic(() => import("../Inputs/text/TimeInput"));
// const TimeInput = dynamic(() => import("../Inputs/TimeInput"));
const YearInput = dynamic(() => import("../Inputs/date/year-input"));

const getErrorMessage = (errors: FieldErrors, name: string): string | undefined => {
  return name.split(".").length === 3
    ? getNestedError(errors, name)
    : (errors[name]?.message as string);
};

const InputWrapper = ({
  children,
  error,
  required,
  label,
  name,
  toolTip
}: {
  name: string;
  required?: boolean;
  label?: string | JSX.Element;
  children: React.ReactNode;
  error?: string;
  toolTip?: string;
}) => (
  <div className="w-full h-full flex flex-col gap-2 ">
    <div className="flex justify-start items-center gap-1.5">
      <span className="text-red-500 mx-1">{required ? "*" : ""}</span>
      {label && (
        <label htmlFor={name} className="text-sm text-gray-600 dark:text-gray-300 ">
          {label}
        </label>
      )}
      {toolTip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-pointer flex items-center justify-center">
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="max-w-[250px] whitespace-normal">
            <span>{toolTip}</span>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
    <div className="flex flex-col h-[97%]">
      {children}
      <div className="flex-1">{error && <ErrorMessage error={error} />}</div>
    </div>
  </div>
);

export const renderInput = (item: FormInput, field: any) => {
  const commonProps = {
    value: field.value,
    onChange: field.onChange,
    name: item.name,
    placeholder: item.placeholder,
    className: item.inputClassName,
    disabled: item.disabled
  };
  switch (item.type) {
    case "filesUpload":
      return (
        <FilesUploadInput
          onRemove={item.onRemove}
          {...commonProps}
          maxSelections={item.max}
          minSelections={item.min as number}
        />
      );
    case "multiSelect":
      return (
        <MultiSelectInput
          {...commonProps}
          options={item.options || []}
          onChange={e => field.onChange(e)}
        />
      );
    case "video":
      return <VideoInput {...commonProps} />;
    case "color":
      return <ColorInput {...commonProps} />;
    case "year":
      return <YearInput {...commonProps} />;
    case "textEditor":
      return (
        <TextEditor
          className={item.inputClassName ?? ""}
          name={item.name}
          onChange={field.onChange}
          value={field.value}
        />
      );
    case 'hh-mm':
      return <TimeInput {...commonProps} />;
    case 'map':
      return <MapPointerInput {...commonProps} />;
    case "map-zone":

      return <MapZoneInput {...commonProps} defaultCenter={item.map?.center} />;
    // case "tag-input":
    //   return <TagInput {...commonProps} />;
    case "selectPaginated":
      return (
        <SelectPaginated
          {...commonProps}
          apiUrl={item.apiUrl || []}
          // options={item.options || []}
          isMulti={item.isMulti}
          labelKey={item.labelKey}
          labelFormat={item.labelFormat}
          disabled={item.disabled}
          onChange={e => {
            if (item.onChange) item.onChange(e as any);
            field.onChange(e);
          }}
          searchFilters={item.searchFilters}
          idKey={item.idKey}
        />
      );
    case "checkbox":
      return <CheckBoxInput {...commonProps} options={item.options || []} />;

    case "radioGroup":
      return <RadioButtonInput {...item} {...commonProps} options={item.options || []} />;

    case "select":
      return (
        <SelectInput
          {...commonProps}
          onChange={e => {
            field.onChange(e);
            item.onChange?.(e);
          }}
          options={item.options || []}
        />
      );

    case "img":
      return <ImgInput ratio={item.ratio} {...commonProps} />;

    case "textarea":
      return <Textarea {...commonProps} />;

    case "time":
      return <DateTimeInput {...commonProps} />;

    case "email":
      return <TextInput {...commonProps} type="email" />;

    case "date":
      return <DateInput {...commonProps} min={item?.min as Date} multiple={item?.isMulti} />;

    case "text":
    case "link":
      return <Input {...commonProps} type="link" />;

    case "number":
      return <NumberInput {...commonProps} pattern="[0-9]*\.?[0-9]*" />;
    case "price":
      return (
        <div className="flex gap-4 items-center">
          <NumberInput {...commonProps} pattern="[0-9]*\.?[0-9]*" />
        </div>
      );

    case "password":
      return <PasswordInput {...commonProps} />;

    case "tel":
      return <CustomPhoneInput {...commonProps} />;

    case "space":
      return <div className="w-full h-4" />;

    case "file":
      return <PdfInput {...commonProps} />;

    default:
      return null;
  }
};

export const renderInputComponent = ({
  item,
  field,
  errors
}: {
  item: FormInput;
  field: any;
  errors: FieldErrors;
}): JSX.Element => {
  const errorMessage = getErrorMessage(errors, item.name);
  return (
    <Suspense fallback={<InputSkeleton />}>
      <InputWrapper
        label={item.label ?? item.name}
        name={item.name}
        required={item.required}
        // multiLang={item.multiLang}
        error={errorMessage}
        toolTip={item.toolTip}
      >
        {renderInput(item, field)}
      </InputWrapper>
    </Suspense>
  );
};

const InputSkeleton = () => (
  <div className="w-full flex flex-col space-y-2 animate-pulse">
    <div className="h-5 w-1/4 rounded-md bg-gray-200 dark:bg-gray-700"></div>
    <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700"></div>
    <div className="h-4 w-full"></div> {/* Space for potential error message */}
  </div>
);
