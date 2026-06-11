import { Input } from "@/components/ui/input";
import { forwardRef } from "react";

interface TimeInputProps {
    value?: string;
    onChange?: (value: string) => void;
    name?: string;
    placeholder?: string;
    className?: string;
    utcOffset?: number; // Hours to add for UTC conversion (default: 2)
}

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
    ({ value, onChange, name, placeholder, className, utcOffset = 2, ...props }, ref) => {

        // Convert backend UTC value to display value (subtract offset)

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;
            if (inputValue) {
                onChange?.(inputValue);
            } else {
                onChange?.("");
            }
        };

        return (
            <Input
                ref={ref}
                type="time"
                name={name}
                placeholder={placeholder}
                className={className}
                value={value ?? ''}
                onChange={handleChange}
                {...props}
            />
        );
    }
);

TimeInput.displayName = "TimeInput";

export default TimeInput;