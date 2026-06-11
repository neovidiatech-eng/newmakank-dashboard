import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/lib/i18n";

export function DateTimeInput({
  value,
  onChange,
  className,
  name = "date-time"
}: {
  value?: string | Date;
  onChange: (date: Date | string | undefined) => void;
  className?: string;
  name?: string;
  min?: Date;
  placeholder?: string;
}) {
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    value ? (typeof value === "string" ? new Date(value) : value) : undefined
  );

  React.useEffect(() => {
    if (value) {
      const newDate = typeof value === "string" ? new Date(value) : value;
      if (!date || newDate.getTime() !== date.getTime()) {
        setDate(newDate);
      }
    } else if (date) {
      setDate(undefined);
    }
  }, [value]);

  // Helper to get time string in HH:mm:ss format from a Date
  const getTimeString = (d?: Date) => {
    if (!d) return "00:00";
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  return (
    <div data-testid={name} className={cn("flex gap-4", className)}>
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              name={name}
              variant="outline"
              data-testid={`${name}-date`}
              id="date"
              className="w-32 justify-between font-normal"
            >
              {date && date instanceof Date ? date.toLocaleDateString() : t("selectDate")}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={date => {
                setDate(date);
                onChange(date ? date.toISOString() : undefined);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {date && (
        <div className="flex flex-col gap-3">
          <Input
            type="time"
            data-testid={`${name}-time`}
            onChange={e => {
              const timeValue = e.target.value;
              const [hours, minutes, seconds] = timeValue.split(":").map(Number);
              if (date) {
                const newDate = new Date(date);
                newDate.setHours(hours, minutes, seconds || 0);
                setDate(newDate);
                onChange(newDate.toISOString());
              }
            }}
            id="time"
            step="1"
            value={getTimeString(date)}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
        </div>
      )}
    </div>
  );
}
