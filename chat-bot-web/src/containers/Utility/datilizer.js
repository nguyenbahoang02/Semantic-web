export function datilizer(year, month, day) {
  if (month === undefined) {
    return year;
  }
  if (year === undefined) return undefined;
  return (
    day.replace(/-/g, "") +
    "/" +
    month.replace(/-/g, "") +
    "/" +
    year.replace(/-/g, "")
  );
}
