import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n";
import { Option } from "../../Form/CustomFormTypes.types";

function CheckBoxOption({
  option,
  name,
  isChecked,
  onCheckedChange,
  disabled,
  buttonStyle
}: {
  option: Option;
  name: string;
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  buttonStyle?: boolean;
}) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        buttonStyle &&
          "rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-primary transition hover:bg-primary/15",
        buttonStyle && isChecked && "border-primary bg-primary text-primary-foreground",
        disabled && "cursor-not-allowed opacity-60"
      )}
      key={option.value.toString()}
    >
      <Checkbox
        name={name}
        checked={isChecked}
        onCheckedChange={checked => onCheckedChange(!!checked)}
        id={option.value.toString()}
        disabled={disabled}
      />
      <label
        htmlFor={option.value.toString()}
        className={cn(
          "text-sm flex gap-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          buttonStyle && "cursor-pointer"
        )}
      >
        {/* {option.img && (
					<Image
						src={option.img}
						width={20}
						height={20}
						alt={option.label}
					/>
				)} */}
        {t(option.label)}
      </label>
    </div>
  );
}

export default function CheckBoxInput({
  value,
  onChange,
  name,
  disabled,
  className,
  // error,
  options
  // maxSelections = options.length
}: {
  value?: string[];
  onChange: (e: string[]) => void;
  name: string;
  disabled?: boolean;
  className?: string;
  // error?: string;
  options: Option[];
  // maxSelections?: number;
}) {
  const handleCheckedChange = (checked: boolean, optionValue: string) => {
    const newValue = checked
      ? [...(value || []), optionValue]
      : value?.filter(v => v != optionValue) || [];

    onChange(newValue);
  };

  const isChecked = (optionValue: string): boolean => {
    return Array.isArray(value) ? value.includes(optionValue) : false;
  };
  const buttonStyle = className?.includes("button-checkbox");

  return (
    <div className={cn("flex flex-wrap gap-2 items-center", buttonStyle && "pt-6")}>
      {options.map(option => (
        <CheckBoxOption
          key={option.value.toString()}
          option={option}
          name={name}
          data-testid={name}
          isChecked={isChecked(option.value.toString())}
          disabled={disabled}
          buttonStyle={buttonStyle}
          onCheckedChange={checked => handleCheckedChange(checked, option.value.toString())}
        />
      ))}
    </div>
  );
}
