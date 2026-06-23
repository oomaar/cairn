export function dateRangeLabel(departLabel: string, dayTotal: number): string {
  const parts = departLabel.split(" ");
  if (parts.length !== 2) return departLabel;
  const [month, dayStr] = parts as [string, string];
  const start = parseInt(dayStr, 10);
  if (isNaN(start)) return departLabel;
  const end = start + dayTotal - 1;
  return `${start}-${end} ${month}`;
}
