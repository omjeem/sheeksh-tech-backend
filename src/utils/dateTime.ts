export function toUTCFromIST(dateString: string) {
  // dateString = "01-04-2025"
  const [day, month, year] = dateString.split("-");
  return new Date(`${year}-${month}-${day}T00:00:00+05:30`);
}