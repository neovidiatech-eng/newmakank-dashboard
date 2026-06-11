export function getMinutesDifference(date: string): number {
  const current = new Date();
  const date1 = new Date(date);

  const diffMs = date1.getTime() - current.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  return diffMins;
}
