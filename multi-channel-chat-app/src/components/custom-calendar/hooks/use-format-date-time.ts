export function formatScheduledTimeToDate(
  scheduledDate: string | null
): string {
  if (!scheduledDate) return new Date().toISOString().split("T")[0];

  try {
    const date = new Date(scheduledDate);
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error parsing scheduled time:", error);
    throw error;
  }
}

export function formatScheduledTimeToTime(
  scheduledTime: string | null
): string {
  if (!scheduledTime)
    return new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  try {
    const time = new Date(scheduledTime);
    return time.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch (error) {
    console.error("Error parsing scheduled time:", error);
    throw error;
  }
}

export function formatToDDMMYYYY(dateInput: string | Date | null): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
