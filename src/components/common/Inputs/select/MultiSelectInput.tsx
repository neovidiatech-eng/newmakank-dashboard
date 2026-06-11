import ErrorMessage from "@/components/ui/ErrorMessage";
import { useTranslations } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import Select, { type MultiValue } from "react-select";
import { Option } from "../../Form/CustomFormTypes.types";
import { customStyles } from "./select.config";

interface CustomSelectProps {
  options: Option[];
  value?: Option[];
  placeholder?: string;
  name?: string;
  onChange?: (selectedOptions: (string | number | boolean)[]) => void;
  error?: string;
}

export default function MultiSelectInput({
  options,
  value,
  placeholder,
  name,
  onChange,
  error
}: CustomSelectProps): JSX.Element {
  const t = useTranslations();
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex flex-col w-full gap-2">
      <Select
        value={value}
        isMulti={true}
        onChange={(selectedOptions: MultiValue<Option>) => {
          const data = selectedOptions.map(item => item.value);
          onChange?.(data);
        }}
        options={options}
        data-testid={name}
        isClearable={true}
        placeholder={placeholder ? placeholder : t("select")}
        name={name}
        styles={customStyles(resolvedTheme === "dark")}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
        menuPosition="fixed"
      />
      <ErrorMessage error={error || ""} />
    </div>
  );
}
