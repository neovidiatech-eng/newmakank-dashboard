import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n";

interface DateInputProps {
  value?: Date | Date[];
  onChange: (date: Date | Date[] | string | string[] | undefined) => void;
  className?: string;
  name: string;
  min?: Date;
  multiple?: boolean;
}

export function DateInput({
  value,
  onChange,
  className,
  name,
  min,
  multiple = false
}: DateInputProps): JSX.Element {
  const t = useTranslations();
  const maxYear = new Date().getFullYear() + 1;

  const formatDisplayValue = () => {
    if (!value) return <span>{t("Pick a date")}</span>;

    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return <span>{t("Pick a date")}</span>;
      if (value.length === 1) return format(value[0], "PPP");
      return <span>{value.length} dates selected</span>;
    }

    return format(value as Date, "PPP");
  };

  return (
    <>
      {/* <InputLabel label={label} /> */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={name}
            className={cn(
              " justify-start text-left w-full font-normal",
              !value && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDisplayValue()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {multiple ? (
            <Calendar
              mode="multiple"
              selected={Array.isArray(value) ? value : []}
              toYear={maxYear}
              disabled={min ? date => date < min : undefined}
              className="rounded-md border shadow-sm"
              required={false}
              onSelect={e => {
                if (Array.isArray(e)) {
                  const isodates = e.map(date => new Date(date).toISOString());
                  onChange(isodates);
                } else {
                  onChange([]);
                }
              }}
              // initialFocus
              captionLayout="dropdown"
            />
          ) : (
            <Calendar
              mode="single"
              selected={value as Date | undefined}
              toYear={maxYear}
              disabled={min ? date => date < min : undefined}
              className="rounded-md border shadow-sm"
              required={false}
              onSelect={e => {
                if (e) {
                  const isoDate = new Date(e.toString()).toISOString();
                  onChange(isoDate);
                } else {
                  onChange(undefined);
                }
              }}
              // initialFocus
              captionLayout="dropdown"
            />
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
