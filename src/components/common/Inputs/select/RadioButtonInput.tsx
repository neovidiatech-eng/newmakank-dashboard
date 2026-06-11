import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLocale } from "@/lib/i18n";
import type { FormInput } from "../../Form/CustomFormTypes.types";

type RadioButtonInputProps = FormInput & {
  value?: string;
};

export default function RadioButtonInput({
  options,
  onChange,
  name,
  value
}: RadioButtonInputProps) {
  const locale = useLocale();
  return (
    <div>
      <RadioGroup
        value={value?.toString()}
        className={`${locale === "ar" ? "flex-row-reverse" : "flex-row"} flex flex-wrap gap-4`}
        onValueChange={value => onChange?.(value)}
        name={name}
      >
        {options?.map(option => (
          <div key={option.value.toString()} className="flex items-center gap-2">
            <p
              className="font-medium text-[12px]"
              dangerouslySetInnerHTML={{ __html: option.label }}
            ></p>
            <RadioGroupItem data-testid={name} value={option.value.toString()} />
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
