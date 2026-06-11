import { customStyles } from "@/components/common/Inputs/select/select.config";
import { useTranslations } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import Select, { type ActionMeta, type MultiValue, type SingleValue } from "react-select";
import type { Option } from "@/components/common/Form/CustomFormTypes.types";

interface SelectPaginatedUIProps {
  isMulti?: boolean;
  name: string;
  options: Option[];
  value?: Option | Option[] | null;
  placeholder?: string;
  isLoading?: boolean;
  onChange: (value: MultiValue<Option> | SingleValue<Option>, actionMeta: ActionMeta<Option>) => void;
  onInputChange: (value: string) => void;
  onMenuScrollToBottom: () => void;
}

export default function SelectPaginatedUI({
  isMulti = false,
  name,
  options,
  value,
  placeholder,
  isLoading = false,
  onChange,
  onInputChange,
  onMenuScrollToBottom
}: SelectPaginatedUIProps) {
  const t = useTranslations();
  const { theme, systemTheme } = useTheme();
  const isDarkMode = theme === "dark" || (theme === "system" && systemTheme === "dark");

  return (
    <div data-testid={name} className="flex w-full flex-col gap-3">
      <Select
        isMulti={isMulti}
        data-testid={name}
        onChange={onChange}
        options={options}
        value={value}
        placeholder={placeholder || t("select")}
        name={name}
        id={name}
        classNames={{
          control: () => "border-[1px] border-gray-400  shadow-none"
        }}
        styles={customStyles(isDarkMode)}
        className=" w-full"
        onMenuScrollToBottom={onMenuScrollToBottom}
        isLoading={isLoading}
        onInputChange={onInputChange}
      />
    </div>
  );
}
