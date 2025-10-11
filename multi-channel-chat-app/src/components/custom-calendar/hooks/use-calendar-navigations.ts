import React from "react";
import FullCalendar from "@fullcalendar/react";

export type SetCurrentDate = React.Dispatch<React.SetStateAction<Date>>;

export function useCalendarNavigations(
  calendarRef: React.RefObject<FullCalendar | null>,
  setCurrentDate: SetCurrentDate
) {
  const handlePrevious = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
      setCurrentDate(new Date());
    }
  };

  const formatDateForDisplay = (date: Date) => {
    const monthNames = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `Tháng ${month}, ${year}`;
  };

  return { handlePrevious, handleNext, handleToday, formatDateForDisplay };
}
