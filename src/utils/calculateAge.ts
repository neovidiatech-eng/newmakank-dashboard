export function formatAge(dateString: string, t: TFunction): string {
  const fromDate = new Date(dateString);
  const toDate = new Date();

  let years = toDate.getFullYear() - fromDate.getFullYear();
  let months = Math.abs(toDate.getMonth() - fromDate.getMonth());
  let days = Math.abs(toDate.getDate() - fromDate.getDate());

  if (days < 0) {
    // borrow days from previous month
    months--;
    const prevMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    months += 12;
    years--;
  }
  if (years > 0) return `${years} ${years > 1 ? `${t("years")}` : `${t("year")}`}`;
  if (months > 0) return `${months}${months > 1 ? `${t("months")}` : `${t("month")}`}`;
  if (days > 0) return `${days} ${days > 1 ? `${t("days")}` : `${t("day")}`}`;
  return t("recently");
}
