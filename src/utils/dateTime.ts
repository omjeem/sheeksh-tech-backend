
export class Utils {
  static toUTCFromIST = (dateString: string | undefined) => {
    // dateString = "01-04-2025"
    if(!dateString)return new Date(`${2020}-${12}-${1}T00:00:00+05:30`);;
    const [day, month, year] = dateString.split("-");
    return new Date(`${year}-${month}-${day}T00:00:00+05:30`);
  };
}
