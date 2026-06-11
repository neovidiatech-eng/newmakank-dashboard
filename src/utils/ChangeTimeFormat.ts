import { useLocale } from "@/lib/i18n";
export default function ChangeTimeFormat({
  time,
  year = true,
  month = true,
  day = true,
  hour = true,
  minute = true,
  hour12 = true,
  localeStringType = "ar-EG"
}: {
  time: string | Date;
  year?: boolean;
  month?: boolean;
  day?: boolean;
  hour?: boolean;
  minute?: boolean;
  localeStringType?: string;
  hour12?: boolean;
}): string {
  const lang = useLocale();
  if (!time) return "";
  const date = new Date(time);
  localeStringType = lang === "ar" ? "ar-EG" : "en-US";
  return isNaN(date.getTime())
    ? " "
    : date.toLocaleString(localeStringType, {
        year: year ? "numeric" : undefined,
        month: month ? "short" : undefined,
        day: day ? "numeric" : undefined,
        hour: hour ? "numeric" : undefined,
        minute: minute ? "numeric" : undefined,
        hour12: hour12 || true,
        numberingSystem: "latn"
      }) || " ";
}

export function handleHourMinutesDateFormat(value: string): string {
  if (!value || !value.includes(":")) {
    return "";
  }
  const parts = value.split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  // Check if parsing was successful
  if (isNaN(hours) || isNaN(minutes)) {
    return "";
  }

  // Create a Date object with current date and input time
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  console.log(date,'sad2esa');
  return date.toISOString();
}

export function extractHourFromTime(value: string): number | null {
  if (!value || !value.includes(":")) {
    return null;
  }
  
  const parts = value.split(":");
  const hours = parseInt(parts[0], 10);
  
  if (isNaN(hours) || hours < 0 || hours > 23) {
    return null;
  }
  
  return hours;
}

export function formatHourOnly(value: string): string {
  const hour = extractHourFromTime(value);
  return hour !== null ? hour.toString() : "";
}
