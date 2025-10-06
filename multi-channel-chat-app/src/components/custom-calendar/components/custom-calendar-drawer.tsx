/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Button, Drawer, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "../styles/custom-drawer.css";
import { Iconify } from "@/components/iconify";
import DrawerSidebar from "./drawer-sidebar";
import { useCalendarPositions } from "../hooks/use-calendar-navigations";

interface CustomCalendarDrawerProps {
  isOpened: boolean;
  handleCloseDrawer: () => void;
  onSelectedDateChange?: (date: Date | null) => void;
  onChannelsChange?: (choices: number[]) => void;
  onPeopleChange?: (choices: number[]) => void;
}

const Channels = [
  { id: 0, title: "Tất cả" },
  { id: 1, title: "Warmmate Thẩm Mỹ Viện" },
  { id: 2, title: "Warmmate" },
];

const People = [
  { id: 0, title: "Tất cả" },
  { id: 1, title: "Nguyễn Văn A" },
  { id: 2, title: "Vũ Quốc B" },
  { id: 3, title: "Trần Minh C" },
];

const CustomCalendarDrawer: React.FC<CustomCalendarDrawerProps> = ({
  isOpened,
  handleCloseDrawer,
  onSelectedDateChange,
  onChannelsChange,
  onPeopleChange,
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [channelsChoices, setChannelsChoices] = useState<number[]>([0]);
  const [peopleChoices, setPeopleChoices] = useState<number[]>([0]);

  const createToggleHandler = (
    setChoices: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    return (id: number) => {
      setChoices((prev) => {
        if (id === 0) {
          if (prev.includes(0)) {
            return [];
          } else {
            return [0];
          }
        } else {
          if (prev.includes(id)) {
            const newSelection = prev.filter((selectedId) => selectedId !== id);
            return newSelection.length === 0 ? [] : newSelection;
          } else {
            const newSelection = prev.filter((selectedId) => selectedId !== 0);
            return [...newSelection, id];
          }
        }
      });
    };
  };

  const handleChannelToggle = createToggleHandler(setChannelsChoices);
  const handlePeopleToggle = createToggleHandler(setPeopleChoices);

  const { handlePrevious, handleNext } = useCalendarPositions(
    calendarRef,
    setCurrentDate
  );

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

    console.log(month);
    const year = date.getFullYear();
    return `Tháng ${month}, ${year}`;
  };

  const applySelectionHighlight = useCallback((targetDate: Date) => {
    const allDays = document.querySelectorAll(
      ".drawer-calendar .fc-daygrid-day"
    );
    allDays.forEach((day) => {
      day.classList.remove("fc-day-selected");
    });

    setTimeout(() => {
      allDays.forEach((day) => {
        const dayDate = day.getAttribute("data-date");
        if (
          dayDate &&
          new Date(dayDate).toDateString() === targetDate.toDateString()
        ) {
          day.classList.add("fc-day-selected");
        }
      });
    }, 0);
  }, []);

  const handleDatesSet = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      setCurrentDate(calendarApi.view.currentStart);
    }

    if (selectedDate) {
      applySelectionHighlight(selectedDate);
    }
  }, [selectedDate, applySelectionHighlight]);

  const handleDateClick = useCallback(
    (dateInfo: any) => {
      const clickedDate = dateInfo.date;
      setSelectedDate(clickedDate);
      applySelectionHighlight(clickedDate);
    },
    [applySelectionHighlight]
  );

  useEffect(() => {
    if (onSelectedDateChange) onSelectedDateChange(selectedDate);
    if (onChannelsChange) onChannelsChange(channelsChoices);
    if (onPeopleChange) onPeopleChange(peopleChoices);
  }, [selectedDate, channelsChoices, peopleChoices]);

  useEffect(() => {
    if (isOpened && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();

      if (selectedDate) {
        calendarApi.gotoDate(selectedDate);
        setCurrentDate(selectedDate);
      } else {
        // Otherwise, go to current month
        const today = new Date();
        calendarApi.gotoDate(today);
        setCurrentDate(today);
      }
    }
  }, [isOpened, selectedDate]);

  return (
    <>
      <Drawer
        open={isOpened}
        onClose={handleCloseDrawer}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320, boxShadow: 0 } }}
      >
        <Box sx={{ width: "100%", p: "0 5px" }} role="presentation">
          <Box
            sx={{
              gap: 2,
              mt: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                sx={{
                  flexGrow: 1,
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "#171A1F",
                }}
              >
                {formatDateForDisplay(currentDate)}
              </Typography>
            </Box>

            <Box>
              <Button
                onClick={handlePrevious}
                sx={{
                  flexShrink: 0,
                  backgroundColor: "#f3f4f6",
                  width: 28,
                  height: 28,
                  minWidth: 0,
                  p: 0,
                  borderRadius: "6px",
                  "&:hover": {
                    backgroundColor: "#DEE1E6",
                    "&:active": {
                      backgroundColor: "#CFD2DA",
                    },
                  },
                  "&:disabled": {
                    opacity: 0.4,
                  },
                }}
                value="previous"
              >
                <Iconify
                  icon="fe:arrow-left"
                  sx={{ color: "#565D6D" }}
                  width={12}
                  height={12}
                />
              </Button>
              <Button
                onClick={handleNext}
                sx={{
                  flexShrink: 0,
                  backgroundColor: "#f3f4f6",
                  ml: 2,
                  width: 28,
                  height: 28,
                  minWidth: 0,
                  p: 0,
                  borderRadius: "6px",
                  "&:hover": {
                    backgroundColor: "#DEE1E6",
                    "&:active": {
                      backgroundColor: "#CFD2DA",
                    },
                  },
                  "&:disabled": {
                    opacity: 0.4,
                  },
                }}
                value="next"
              >
                <Iconify
                  icon="fe:arrow-right"
                  width={12}
                  height={12}
                  sx={{ color: "#565D6D" }}
                />
              </Button>
            </Box>
          </Box>

          <Box className="drawer-calendar">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              headerToolbar={{
                right: "prev,next",
                left: "title",
              }}
              initialView="dayGridMonth"
              editable={false}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              fixedWeekCount={false}
              height="auto"
              eventDisplay="block"
              dateClick={handleDateClick}
              datesSet={handleDatesSet}
            />
          </Box>

          <Box>
            <DrawerSidebar
              title="Trang đặt lịch hẹn"
              handleDataToggle={handleChannelToggle}
              data={Channels}
              dataChoices={channelsChoices}
            />
          </Box>

          <Box>
            <DrawerSidebar
              title="Người thực hiện"
              handleDataToggle={handlePeopleToggle}
              data={People}
              dataChoices={peopleChoices}
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default CustomCalendarDrawer;
