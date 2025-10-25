"use client";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import { Iconify } from "@/components/iconify";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import "../styles/calendar-dropdown.css";

interface DropdownCalendarChoiceProps {
  value: string;
  onChange: (value: string) => void;
  onDateRangeChange?: (startDate: string, endDate: string) => void;
}

const DateRangeOptions = [
  { value: "7days", label: "7 ngày qua" },
  { value: "28days", label: "28 ngày qua" },
  { value: "90days", label: "90 ngày qua" },
  { value: "thisWeek", label: "Tuần này" },
  { value: "thisMonth", label: "Tháng này" },
  { value: "custom", label: "Tùy chỉnh" },
];

const DropdownCalendarChoice: React.FC<DropdownCalendarChoiceProps> = ({
  value,
  onChange,
  onDateRangeChange,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(value || "");
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());

  const [tempSelectedPeriod, setTempSelectedPeriod] = useState(value || "");
  const [tempSDate, setTempSDate] = useState(new Date());
  const [tempEDate, setTempEDate] = useState(new Date());

  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSelecting, setIsSelecting] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [forceRender, setForceRender] = useState(0);

  const leftCalendarRef = useRef<FullCalendar>(null);
  const rightCalendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    if (open) {
      setTempSelectedPeriod(selectedPeriod);
      setTempSDate(customStartDate);
      setTempEDate(customEndDate);
    }
  }, [customEndDate, customStartDate, open, selectedPeriod]);

  useEffect(() => {
    if (selectedPeriod !== "custom") {
      const { start, end } = getDateRangeByPeriod(tempSelectedPeriod);
      setTempSDate(start);
      setTempEDate(end);
    }
  }, [selectedPeriod, tempSelectedPeriod]);

  const formatDateRange = (period: string, start: Date, end: Date) => {
    const viewMode =
      DateRangeOptions.find((item) => item.value === period)?.label || "";

    const startStr = start.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const endStr = end.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    if (viewMode === "") return `${startStr} - ${endStr}`;
    else return `${viewMode}, ${startStr} - ${endStr}`;
  };

  const getDateRangeByPeriod = (period: string) => {
    const today = new Date();
    const start = new Date();
    const end = new Date();

    switch (period) {
      case "7days":
        start.setDate(today.getDate() - 8);
        end.setDate(today.getDate() - 1);
        break;
      case "28days":
        start.setDate(today.getDate() - 29);
        end.setDate(today.getDate() - 1);
        break;
      case "90days":
        start.setDate(today.getDate() - 91);
        end.setDate(today.getDate() - 1);
        break;
      case "thisWeek":
        start.setDate(today.getDate() - 7);
        end.setDate(today.getDate());
        break;
      case "thisMonth":
        start.setMonth(today.getMonth() - 1);
        end.setDate(today.getDate());
        break;
      default:
        return { start, end };
    }

    return { start, end };
  };

  const handlePeriodChange = (period: string) => {
    setTempSelectedPeriod(period);
    setIsSelecting(false);
    setTempStartDate(null);

    if (period !== "custom") {
      const { start, end } = getDateRangeByPeriod(period);
      setTempSDate(start);
      setTempEDate(end);
      // onDateRangeChange?.(formatDateToString(start), formatDateToString(end));
    }
  };

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleApply = () => {
    const dateDifferent =
      Math.floor(
        new Date(tempEDate).getTime() - new Date(tempSDate).getTime()
      ) /
      (1000 * 60 * 60 * 24);

    if (dateDifferent > 90) {
      toast.warning(
        "Khoảng thời gian không được vượt quá 90 ngày. Vui lòng chọn lại khoảng thời gian phù hợp."
      );
      return; // Prevent applying the changes
    } else {
      setSelectedPeriod(tempSelectedPeriod);
      setCustomStartDate(tempSDate);
      setCustomEndDate(tempEDate);

      // Create a new date that is 1 day before the start date
      const adjustedStartDate = new Date(tempSDate);
      adjustedStartDate.setDate(adjustedStartDate.getDate() - 1);

      onChange(tempSelectedPeriod);
      onDateRangeChange?.(
        formatDateToString(adjustedStartDate),
        formatDateToString(tempEDate)
      );
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setTempSDate(customStartDate);
    setTempEDate(customEndDate);
    setTempSelectedPeriod(selectedPeriod);
    setOpen(false);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);

    const leftCalendar = leftCalendarRef.current?.getApi();
    const rightCalendar = rightCalendarRef.current?.getApi();

    if (leftCalendar) {
      leftCalendar.gotoDate(newMonth);
    }

    if (rightCalendar) {
      const rightMonth = new Date(
        newMonth.getFullYear(),
        newMonth.getMonth() + 1
      );
      rightCalendar.gotoDate(rightMonth);
    }
  };

  const handleDateSelect = (selectInfo: { start: Date; end: Date }) => {
    if (tempSelectedPeriod === "custom") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(selectInfo.start);
      startDate.setHours(0, 0, 0, 0);

      if (startDate > today) {
        return;
      }

      const adjustedEndDate = new Date(selectInfo.end);
      adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);
      adjustedEndDate.setHours(0, 0, 0, 0);

      if (adjustedEndDate > today) {
        adjustedEndDate.setTime(today.getTime());
      }

      setTempSDate(selectInfo.start);
      setTempEDate(adjustedEndDate);
      setForceRender((prev) => prev + 1);
    }
  };

  const handleDateClick = (clickInfo: { date: Date }) => {
    if (tempSelectedPeriod === "custom") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const clickDate = new Date(clickInfo.date);
      clickDate.setHours(0, 0, 0, 0);

      if (clickDate > today) {
        return;
      }

      if (!isSelecting) {
        // set start date
        setTempStartDate(clickInfo.date);
        setIsSelecting(true);
        setTempSDate(clickInfo.date);
        setTempEDate(clickInfo.date);
        setForceRender((prev) => prev + 1);
      } else {
        // set end date
        const startDate = tempStartDate || tempSDate;
        const endDate = clickInfo.date;

        if (endDate >= startDate) {
          setTempSDate(startDate);
          setTempEDate(endDate);
        } else {
          setTempSDate(endDate);
          setTempEDate(startDate);
        }
        setIsSelecting(false);
        setTempStartDate(null);
        setForceRender((prev) => prev + 1);
      }
    }
  };

  const dayCellClassNames = (arg: { date: Date }) => {
    const cellDate = new Date(arg.date);
    cellDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (cellDate > today) {
      return ["fc-day-future"];
    }

    const startDateNormalized = new Date(tempSDate);
    startDateNormalized.setHours(0, 0, 0, 0);

    const endDateNormalized = new Date(tempEDate);
    endDateNormalized.setHours(0, 0, 0, 0);

    // Check if date is in range
    if (cellDate >= startDateNormalized && cellDate <= endDateNormalized) {
      if (
        cellDate.getTime() === startDateNormalized.getTime() ||
        cellDate.getTime() === endDateNormalized.getTime()
      ) {
        return ["fc-daygrid-selected"];
      }
      return ["fc-daygrid-in-range"];
    }

    if (cellDate.getTime() === today.getTime()) {
      return ["fc-day-today"];
    }

    return [];
  };

  const renderCalendarContent = () => (
    <Paper className="calendar-dropdown-paper">
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Left Sidebar - Date Range Options */}
        <Box sx={{ flex: "0 0 200px" }}>
          <Typography
            sx={{
              mb: 2,
              fontWeight: 600,
              fontSize: "14px",
              color: "#333",
            }}
          >
            Chọn khoảng thời gian
          </Typography>
          <RadioGroup
            value={tempSelectedPeriod}
            onChange={(e) => handlePeriodChange(e.target.value)}
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            {DateRangeOptions.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={
                  <Radio
                    sx={{
                      color: "#2373D3",
                      "&.Mui-checked": { color: "#2373D3" },
                    }}
                  />
                }
                label={option.label}
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "14px",
                    color:
                      tempSelectedPeriod === option.value ? "#2373D3" : "#333",
                  },
                }}
              />
            ))}
          </RadioGroup>
        </Box>

        {/* Right Side - Calendars */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <IconButton
              onClick={() => navigateMonth("prev")}
              size="small"
              sx={{
                mr: 1,
                color: "#6B7280",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <Iconify icon="iconamoon:arrow-left-2-thin" />
            </IconButton>

            <Typography
              variant="h6"
              sx={{
                flex: 1,
                textAlign: "center",
                fontSize: "12px",
                fontWeight: 600,
                color: "#333",
                mx: 1,
              }}
            >
              {currentMonth.toLocaleDateString("vi-VN", {
                month: "long",
                year: "numeric",
              })}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                flex: 1,
                textAlign: "center",
                fontSize: "12px",
                fontWeight: 600,
                color: "#333",
                mx: 1,
              }}
            >
              {new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1
              ).toLocaleDateString("vi-VN", {
                month: "long",
                year: "numeric",
              })}
            </Typography>

            <IconButton
              onClick={() => navigateMonth("next")}
              size="small"
              sx={{
                ml: 1,
                color: "#6B7280",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <Iconify icon="iconamoon:arrow-right-2-thin" />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {/* Left Calendar */}
            <Box
              sx={{
                flex: 1,
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <FullCalendar
                key={`left-${forceRender}`}
                ref={leftCalendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                initialDate={currentMonth}
                selectable={selectedPeriod === "custom"}
                selectMirror={true}
                select={handleDateSelect}
                dateClick={handleDateClick}
                headerToolbar={false}
                dayCellClassNames={dayCellClassNames}
                height="auto"
                locale="vi"
                dayHeaderFormat={{ weekday: "short" }}
                fixedWeekCount={false}
                dayMaxEvents={false}
                moreLinkClick="popover"
                eventDisplay="block"
                aspectRatio={1.5}
                selectOverlap={false}
                selectConstraint={{
                  start: new Date(2020, 0, 1),
                  end: new Date(),
                }}
              />
            </Box>

            {/* Right Calendar */}
            <Box
              sx={{
                flex: 1,
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <FullCalendar
                key={`right-${forceRender}`}
                ref={rightCalendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                initialDate={
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1
                  )
                }
                selectable={selectedPeriod === "custom"}
                selectMirror={true}
                select={handleDateSelect}
                dateClick={handleDateClick}
                headerToolbar={false}
                dayCellClassNames={dayCellClassNames}
                height="auto"
                locale="vi"
                dayHeaderFormat={{ weekday: "short" }}
                dayMaxEvents={false}
                fixedWeekCount={false}
                moreLinkClick="popover"
                eventDisplay="block"
                aspectRatio={1.0}
                selectOverlap={false}
                selectConstraint={{
                  start: new Date(2020, 0, 1),
                  end: new Date(),
                }}
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                borderColor: "#ccc",
                color: "#666",
                "&:hover": {
                  borderColor: "#999",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleApply}
              sx={{
                backgroundColor: "#2373D3",
                "&:hover": {
                  backgroundColor: "#1e5bb8",
                },
              }}
            >
              Áp dụng
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Box
          onClick={() => setOpen(!open)}
          sx={{
            backgroundColor: "#fff",
            color: "#2373D3",
            width: "378px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "6px",
            height: "36px",
            fontSize: "14px",
            lineHeight: "22px",
            fontFamily: "Public Sans Variable",
            padding: "8px 12px",
            fontWeight: 400,
            gap: "6px",
            border: "1px solid #2373D3",
            cursor: "pointer",
            "&:hover": {
              borderColor: "#1e5bb8",
            },
          }}
        >
          <Typography sx={{ fontSize: "14px", color: "#2373D3" }}>
            {formatDateRange(selectedPeriod, customStartDate, customEndDate)}
          </Typography>
          <Iconify
            icon="iconamoon:arrow-down-2-thin"
            width="16px"
            height="16px"
            style={{
              color: "#2373D3",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        </Box>

        {open && (
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              right: 0,
              zIndex: 1300,
              mt: 1,
            }}
          >
            {renderCalendarContent()}
          </Box>
        )}
      </Box>

      {/* Backdrop to close dropdown when clicking outside */}
      {open && (
        <Box
          onClick={() => setOpen(false)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1299,
            backgroundColor: "transparent",
          }}
        />
      )}
    </>
  );
};

export default DropdownCalendarChoice;
