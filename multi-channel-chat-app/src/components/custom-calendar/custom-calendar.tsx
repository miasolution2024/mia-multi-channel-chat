import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
  useTheme,
} from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Iconify } from "../iconify";
import "./styles/custom-calendar.css";
import CustomCalendarTimeChoice from "./components/custom-calendar-timechoices";
import CustomCalendarStatusChoices from "./components/custom-calendar-statuschoices";
import CustomCalendarDrawer from "./components/custom-calendar-drawer";
import CustomCalendarEvent from "./components/custom-calendar-event";
import { useCalendarPositions } from "./hooks/use-calendar-navigations";
import CustomCalendarTooltip from "./components/custom-calendar-tooltip";
import { WorkingSchedule } from "./type";
import { useGetWorkingSchedule } from "@/actions/post-calendar";
import {
  formatScheduledTimeToDate,
  formatScheduledTimeToTime,
} from "./hooks/use-format-date-time";

const CustomCalendar = () => {
  const theme = useTheme();
  const calendarRef = useRef<FullCalendar>(null);
  const [timeChoice, setTimeChoice] = useState("Tuần");
  const [statusChoice, setStatusChoice] = useState("all");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerSelectedDate, setDrawerSelectedDate] = useState<Date | null>(
    null
  );
  const [schedules, setSchedules] = useState<WorkingSchedule[]>([]);
  const [drawerChannels, setDrawerChannels] = useState<number[]>([0]);
  // const [drawerPeople, setDrawerPeople] = useState<number[]>([1]);
  const [, setSelectedDate] = useState<Date | null>(null);
  const [searchData, setSearchData] = useState("");
  const [inputData, setInputData] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const { workingSchedules } = useGetWorkingSchedule(
    searchData,
    statusChoice,
    drawerChannels
  );

  useEffect(() => {
    if (workingSchedules) {
      setSchedules(workingSchedules);
    }
  }, [workingSchedules]);

  const toggleDrawer = (isOpened: boolean) => {
    setOpenDrawer(isOpened);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const isDateInAllowedRange = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sameDateNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );
    const dayBeforeSameDateNextMonth = new Date(
      sameDateNextMonth.getTime() - 24 * 60 * 60 * 1000
    );

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate >= today && checkDate <= dayBeforeSameDateNextMonth;
  };

  const handleDateClick = (info: { date: Date; dayEl: HTMLElement }) => {
    const clickedDate = new Date(info.date);

    // Update currentDate to reflect the clicked date's month
    setCurrentDate(clickedDate);

    if (isDateInAllowedRange(clickedDate)) {
      setSelectedDate(clickedDate);
      setShowTooltip(true);

      // Calculate tooltip position
      const rect = info.dayEl.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + 10,
      });
    } else {
      setShowTooltip(false);
      setSelectedDate(null);
    }
  };

  const getViewName = (choice: string) => {
    switch (choice) {
      case "Ngày":
        return "dayGridDay";
      case "Tuần":
        return "dayGridWeek";
      case "Tháng":
        return "dayGridMonth";
      default:
        return "dayGridMonth";
    }
  };

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const viewName = getViewName(timeChoice);
      setTimeout(() => {
        calendarApi.changeView(viewName);
        if (timeChoice === "Tháng") {
          const today = new Date();
          calendarApi.gotoDate(today);
          setCurrentDate(today);
        }
      }, 0);
    }
  }, [timeChoice]);

  useEffect(() => {
    if (calendarRef.current && drawerSelectedDate) {
      const calendarApi = calendarRef.current.getApi();
      setTimeout(() => {
        calendarApi.gotoDate(drawerSelectedDate);
        calendarApi.select(drawerSelectedDate);
        setCurrentDate(drawerSelectedDate);
      }, 0);
    } else if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setCurrentDate(calendarApi.getDate());
    }
  }, [drawerSelectedDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showTooltip) {
        // Check if the click is outside the tooltip
        const tooltipElement = document.querySelector('[data-tooltip="true"]');
        if (tooltipElement && !tooltipElement.contains(event.target as Node)) {
          setShowTooltip(false);
        }
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  const { handlePrevious, handleNext, handleToday } = useCalendarPositions(
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
    const year = date.getFullYear();
    return `Tháng ${month}, ${year}`;
  };

  const WeekDayCalendarSetup =
    timeChoice === "Tuần" || timeChoice === "Ngày"
      ? {
          dayHeaderContent: (
            args: import("@fullcalendar/core").DayHeaderContentArg
          ) => {
            const date = args.date;
            const dayNumber = date.getDate();
            const dayNames = [
              "Chủ nhật",
              "Thứ hai",
              "Thứ ba",
              "Thứ tư",
              "Thứ năm",
              "Thứ sáu",
              "Thứ bảy",
            ];
            const dayName = dayNames[date.getDay()];

            return (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: args.isToday ? "#1976d2" : "#f0f0f0",
                    color: args.isToday ? "#fff" : "#333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 8px",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {dayNumber}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    fontWeight: "normal",
                  }}
                >
                  {dayName}
                </div>
              </div>
            );
          },
          slotMinTime: "00:00:00",
          slotMaxTime: "24:00:00",
        }
      : {};

  const calendarEvents = useMemo(() => {
    const sortedSchedules = [...schedules].sort((a, b) => {
      const aTime = a.scheduled_post_time || a.date_created;
      const bTime = b.scheduled_post_time || b.date_created;
      const dateA = new Date(aTime).getTime();
      const dateB = new Date(bTime).getTime();
      return dateA - dateB;
    });

    return sortedSchedules.map((schedule) => ({
      id: schedule.id.toString(),
      title: schedule.topic,
      date: formatScheduledTimeToDate(
        schedule.scheduled_post_time || schedule.date_created
      ),
      allDay: false,
      start: schedule.scheduled_post_time || schedule.date_created,
      display: "list-item",
      extendedProps: {
        channelIds: schedule.omni_channels,
        channelName: schedule.omni_channel_name,
        userCreated: schedule.user_created,
        postType: schedule.post_type,
        // note: schedule.post_notes,
        campaign: schedule.campaign,
        status: schedule.status,
        timeCreated: formatScheduledTimeToTime(
          schedule.scheduled_post_time || schedule.date_created
        ),
      },
    }));
  }, [schedules]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box
              sx={{
                gap: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box>
                <Typography
                  sx={{ flexGrow: 1, fontWeight: "bold", fontSize: 18 }}
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
                    width: 32,
                    height: 32,
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
                    width: 32,
                    height: 32,
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

              <Box>
                <Button
                  onClick={handleToday}
                  sx={{
                    flexShrink: 0,
                    backgroundColor: "#f2f7fdff",
                    width: "67px",
                    height: "32px",
                    borderRadius: "6px",
                    padding: "0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Inter",
                    fontSize: "12px",
                    lineHeight: "20px",
                    fontWeight: 400,
                    textTransform: "none",
                    color: "#2373D3",
                    "&:hover": {
                      backgroundColor: "#DEE1E6",
                      "&:active": {
                        backgroundColor: "#BCD5F4",
                      },
                    },
                    "&:disabled": {
                      opacity: 0.4,
                    },
                  }}
                  value="today"
                >
                  Hôm nay
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                gap: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ display: "flex" }}>
                <TextField
                  placeholder="Nhập tên chiến dịch, tên bài viết"
                  value={inputData}
                  onChange={(e) => setInputData(e.target.value)}
                  sx={{
                    width: "271px",
                    height: "36px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "6px 0 0 6px",
                      fontFamily: "Inter",
                      fontSize: "14px",
                      lineHeight: "22px",
                      fontWeight: 400,
                      backgroundColor: "#fff",
                      borderColor: "#BDC1CA",
                      "& input": {
                        height: "36px",
                        padding: "0 12px",
                      },
                    },
                    "&:hover .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderColor: "#A8ADB7",
                    },
                    "&.Mui-focused .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderColor: "#9095A1",
                    },
                    "&.Mui-disabled .MuiOutlinedInput-root": {
                      backgroundColor: "#fff",
                      borderColor: "#BDC1CA",
                      color: "#BDC1CA",
                    },
                  }}
                />
                <Button
                  sx={{
                    flexShrink: 0,
                    width: 57,
                    height: 36,
                    minWidth: 0,
                    padding: "0 10px",
                    border: "none",
                    color: "#fff",
                    borderRadius: "0 6px 6px 0",
                    backgroundColor: "#2373d3",
                    "&:hover": {
                      // color: "#fff",
                      backgroundColor: "#1C5CAA",
                      "&:active": {
                        // color: "#fff",
                        backgroundColor: "#154681",
                      },
                    },
                    "&:disabled": {
                      opacity: 0.4,
                    },
                  }}
                  onClick={() => setSearchData(inputData)}
                >
                  <Iconify
                    icon="lets-icons:search-alt"
                    color="#fff"
                    width="16px"
                    height="16px"
                  />
                </Button>
              </Box>

              <Box>
                <CustomCalendarTimeChoice
                  value={timeChoice}
                  onChange={setTimeChoice}
                />
              </Box>

              <Box>
                <CustomCalendarStatusChoices
                  value={statusChoice}
                  onChange={setStatusChoice}
                />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              mt: 3,
            }}
          >
            <Button
              onClick={() => toggleDrawer(true)}
              sx={{
                flexShrink: 0,
                backgroundColor: "#f3f4f6",
                width: 32,
                height: 32,
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
              value="openDrawer"
            >
              <Iconify
                icon="fe:arrow-left"
                sx={{
                  color: "#565D6D",
                  transform: `${
                    openDrawer ? "rotate(180deg)" : "rotate(0deg)"
                  }`,
                  transition: "transform 0.3s ease-in-out",
                  pointerEvents: "none",
                }}
                width={12}
                height={12}
              />
            </Button>
          </Box>

          {/* Calendar Container */}
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mt: 3,
              padding: 0,
              border: "none",
              borderRadius: 0,
              boxShadow: 0,
            }}
          >
            <Box className="custom-calendar">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridWeek"
                editable={false}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                fixedWeekCount={false}
                events={calendarEvents}
                eventOrder="-1"
                height="auto"
                eventDisplay="block"
                eventBackgroundColor="transparent"
                eventBorderColor="transparent"
                eventContent={(arg) => (
                  <CustomCalendarEvent {...arg} timeSetup={timeChoice} />
                )}
                datesSet={(dateInfo) => {
                  if (calendarRef.current) {
                    const calendarApi = calendarRef.current.getApi();
                    const currentView = calendarApi.view.type;
                    const viewName = getViewName(timeChoice);

                    if (currentView === viewName) {
                      setCurrentDate(dateInfo.start);
                    }
                  }
                }}
                dateClick={handleDateClick}
                {...WeekDayCalendarSetup}
              />
            </Box>

            <CustomCalendarTooltip
              showTooltip={showTooltip}
              tooltipPosition={tooltipPosition}
            />

            <Box>
              <CustomCalendarDrawer
                isOpened={openDrawer}
                handleCloseDrawer={handleCloseDrawer}
                onSelectedDateChange={setDrawerSelectedDate}
                onChannelsChange={(ids) => setDrawerChannels(ids)}
                onPeopleChange={() => {}}
              />
            </Box>
          </Paper>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default CustomCalendar;
