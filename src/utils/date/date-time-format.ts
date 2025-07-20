export function DateTimeFormat(timestamp: string | null | undefined): string {
  if (timestamp) {
    const date = new Date(timestamp);

    // Convert to Cambodia time (UTC +7)
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Phnom_Penh",
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // To display AM/PM
    };

    // Format the date and time in Cambodia time
    const formattedDateTime = date.toLocaleString("en-US", options);

    return formattedDateTime;
  }
  return "";
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
