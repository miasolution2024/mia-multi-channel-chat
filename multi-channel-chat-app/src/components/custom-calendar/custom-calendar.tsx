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
import CustomCalendarStatusChoices from "./components/custome-calendar-statuschoices";
import CustomCalendarDrawer from "./components/custom-calendar-drawer";
import CustomCalendarEvent from "./components/custom-calendar-event";
// import { paths } from "@/routes/path";
// import router from "next/router";
import { useCalendarPositions } from "./hooks/use-calendar-navigations";
import CustomCalendarTooltip from "./components/custom-calendar-tooltip";

const Events = [
  {
    id: 1,
    title: "Cấy meso",
    time: "08:00 AM",
    date: "23/09/2025",
    channelId: 1,
    channel: "Warmmate Thẩm Mỹ Viện",
    peopleId: 1,
    people: "Nguyễn Văn A",
    note: "MKT Tháng 10",
    status: "Đã lên lịch",
  },
  {
    id: 2,
    title: "Chăm da trẻ hoá",
    time: "04:00 AM",
    date: "23/09/2025",
    channelId: 1,
    channel: "Warmmate Thẩm Mỹ Viện",
    peopleId: 1,
    people: "Nguyễn Văn A",
    note: "MKT Tháng 10",
    status: "Đã lên lịch",
  },
  {
    id: 3,
    title: "Cấy meso",
    time: "15:00 PM",
    date: "26/09/2025",
    channelId: 1,
    channel: "Warmmate Thẩm Mỹ Viện",
    peopleId: 2,
    people: "Vũ Quốc B",
    note: "MKT Tháng 10",
    status: "Đã đăng",
  },
  {
    id: 4,
    title: "Cấy meso",
    time: "16:00 PM",
    date: "27/09/2025",
    channelId: 1,
    channel: "Warmmate Thẩm Mỹ Viện",
    peopleId: 3,
    people: "Trần Minh C",
    note: "MKT Tháng 10",
    status: "Đã đăng",
  },
  {
    id: 5,
    title: "Cấy meso",
    time: "14:00 PM",
    date: "27/09/2025",
    channelId: 2,
    channel: "Warmmate",
    peopleId: 2,
    people: "Vũ Quốc B",
    note: "MKT Tháng 10",
    status: "Đã lên lịch",
  },
  {
    id: 6,
    title: "Cấy meso",
    time: "14:00 PM",
    date: "02/10/2025",
    channelId: 2,
    channel: "Warmmate",
    peopleId: 2,
    people: "Vũ Quốc B",
    note: "MKT Tháng 10",
    status: "Đã lên lịch",
  },
];

const CustomCalendar = () => {
  const theme = useTheme();
  const calendarRef = useRef<FullCalendar>(null);
  const [timeChoice, setTimeChoice] = useState("Tuần");
  const [statusChoice, setStatusChoice] = useState("Tất cả");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerSelectedDate, setDrawerSelectedDate] = useState<Date | null>(
    null
  );
  const [drawerChannels, setDrawerChannels] = useState<number[]>([1]);
  const [drawerPeople, setDrawerPeople] = useState<number[]>([1]);
  const [, setSelectedDate] = useState<Date | null>(null);
  const [searchData, setSearchData] = useState("");
  const [inputData, setInputData] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // const [searchData, setSearchData] = useState("");

  const toggleDrawer = (isOpened: boolean) => {
    setOpenDrawer(isOpened);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const isDateInAllowedRange = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate the same date next month, then subtract one day
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
        y: rect.bottom + 10,
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

  const toIsoDate = (dateString: string) => {
    const [day, month, year] = dateString.split("/").map(Number);
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  };

  const filteredEvents = useMemo(() => {
    const channels = drawerChannels || [];
    const people = drawerPeople || [];

    if (channels.length === 0 && people.length === 0) return [];

    const channelsAll = channels.includes(0);
    const peopleAll = people.includes(0);
    if (channelsAll && peopleAll) return Events;

    const isInChannels = (id: number) => channels.includes(id);
    const isInPeople = (id: number) => people.includes(id);

    if (
      !channelsAll &&
      channels.length > 0 &&
      (peopleAll || people.length === 0)
    ) {
      return Events.filter((e) => isInChannels(e.channelId));
    }

    if (
      !peopleAll &&
      people.length > 0 &&
      (channelsAll || channels.length === 0)
    ) {
      return Events.filter((e) => isInPeople(e.peopleId));
    }

    if (!channelsAll && !peopleAll) {
      return Events.filter(
        (e) => isInChannels(e.channelId) && isInPeople(e.peopleId)
      );
    }

    if (channels.length === 0 && people.length > 0 && !peopleAll) {
      return Events.filter((e) => isInPeople(e.peopleId));
    }

    if (people.length === 0 && channels.length > 0 && !channelsAll) {
      return Events.filter((e) => isInChannels(e.channelId));
    }

    return Events;
  }, [drawerChannels, drawerPeople]);

  const calendarEvents = filteredEvents.map((e) => ({
    id: String(e.id),
    title: e.title,
    date: toIsoDate(e.date),
    allDay: true,
    extendedProps: {
      channelId: e.channelId,
      peopleId: e.peopleId,
      channel: e.channel,
      people: e.people,
      note: e.note,
      status: e.status,
      time: e.time,
    },
  }));

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
                onChannelsChange={setDrawerChannels}
                onPeopleChange={setDrawerPeople}
              />
            </Box>
          </Paper>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default CustomCalendar;
