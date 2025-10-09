import React from "react";
import FullCalendar from "@fullcalendar/react";

export type SetCurrentDate = React.Dispatch<React.SetStateAction<Date>>;

export function useCalendarPositions(
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

  return { handlePrevious, handleNext, handleToday };
}
