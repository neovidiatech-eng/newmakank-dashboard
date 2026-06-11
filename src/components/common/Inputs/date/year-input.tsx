import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChangeEvent, FC } from "react";

interface YearInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  placeholder?: string;
  className?: string;
  label?: string;
  error?: string;
}

const YearInput: FC<YearInputProps> = ({
  value,
  onChange,
  name,
  placeholder,
  className,
  label,
  error
}) => {
  const currentYear = new Date().getFullYear();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty value or numbers only
    if (value === "" || (/^\d{0,4}$/.test(value) && Number(value) <= currentYear)) {
      onChange(e);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        name={name}
        type="number"
        max={currentYear}
        min="1"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(error && "border-destructive")}
        onKeyDown={e => {
          // Prevent non-numeric keys (allow only numbers, backspace, delete, tab, arrows)
          if (
            !/^\d$/.test(e.key) &&
            !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
          ) {
            e.preventDefault();
          }
        }}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default YearInput;
