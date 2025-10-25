export function calculateDateDistance(
  period: string,
  startDate: string,
  endDate: string
): number {
  switch (period) {
    case "7days":
    case "thisWeek":
      return 7;
    case "28days":
      return 28;
    case "90days":
      return 90;
    case "thisMonth":
      return 30;
    case "custom":
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error(
          "Invalid dates for custom period calculation:",
          startDate,
          endDate
        );
        return 7;
      }

      return Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );
    default:
      return 7;
  }
}

export function calculatePreviousDates(
  startDate: string,
  endDate: string,
  dateDistance: number
): {
  prevStartDate: string;
  prevEndDate: string;
} {
  if (!startDate || !endDate) {
    return {
      prevStartDate: startDate,
      prevEndDate: endDate,
    };
  }

  const start = new Date(startDate);

  if (isNaN(start.getTime())) {
    console.error("Invalid start date:", startDate);
    return {
      prevStartDate: startDate,
      prevEndDate: endDate,
    };
  }

  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate());

  if (isNaN(prevEnd.getTime())) {
    console.error("Invalid previous end date calculated");
    return {
      prevStartDate: startDate,
      prevEndDate: endDate,
    };
  }

  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - dateDistance);

  if (isNaN(prevStart.getTime())) {
    console.error("Invalid previous start date calculated");
    return {
      prevStartDate: startDate,
      prevEndDate: endDate,
    };
  }

  return {
    prevStartDate: prevStart.toISOString().split("T")[0],
    prevEndDate: prevEnd.toISOString().split("T")[0],
  };
}
