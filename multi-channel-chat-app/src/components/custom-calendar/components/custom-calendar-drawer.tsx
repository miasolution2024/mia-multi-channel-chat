/* eslint-disable @typescript-eslint/no-explicit-any */
import "../styles/custom-drawer.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Button, Drawer, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Iconify } from "@/components/iconify";
import { useCalendarNavigations } from "../hooks/use-calendar-navigations";
import DrawerDropdownOmni from "./drawer-dropdown-omni";
//import DrawerDropdownCreator from "./drawer-dropdown-creator";
import { useOmniCreatorSetup } from "../hooks/use-omni-creator-setup";
import { OmniChoices } from "../type";
// import { UserInfo } from "../type";

interface CustomCalendarDrawerProps {
  isOpened: boolean;
  handleCloseDrawer: () => void;
  onSelectedDateChange?: (date: Date | null) => void;
  onChannelsChange?: (choices: number[]) => void;
  uniqueOmnis?: OmniChoices[];
  // onCreatorChange?: (choices: string[]) => void;
  // uniqueUsers?: UserInfo[];
}

const CustomCalendarDrawer: React.FC<CustomCalendarDrawerProps> = ({
  isOpened,
  handleCloseDrawer,
  onSelectedDateChange,
  onChannelsChange,
  uniqueOmnis,
  // onCreatorChange,
  // uniqueUsers = [],
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // Used for API (suggestion ids)
  const [channelsChoices, setChannelsChoices] = useState<number[]>([]);
  // Used for UI checkbox selection (omni ids)
  const [selectedOmniIds, setSelectedOmniIds] = useState<number[]>([0]);
  // const [creatorsChoices, setCreatorsChoices] = useState<string[]>(["0"]);
  // const {
  //   createToggleHandlerOmni,
  //   createToggleHandleCreator,
  //   omniChannels,
  //   creators,
  // } = useOmniCreatorSetup({ uniqueUsers });
  // const { createToggleHandlerOmni, omniChannels } = useOmniCreatorSetup({
  //   uniqueUsers,
  // });

  // const { createToggleHandlerOmni, omniChannels } = useOmniCreatorSetup();
  const { omniChannels } = useOmniCreatorSetup({
    omniChoices: uniqueOmnis,
  });

  const handleChannelToggle = (omni: OmniChoices) => {
    const id = omni.id;
    setSelectedOmniIds((prev) => {
      if (id === 0) return [0];
      if (prev.includes(id)) {
        const next = prev.filter((v) => v !== id && v !== 0);
        return next.length ? next : [0];
      }
      const withoutAll = prev.filter((v) => v !== 0);
      return [...withoutAll, id];
    });

    setChannelsChoices(() => {
      const effectiveSelected = (() => {
        if (id === 0) return [0];
        if (selectedOmniIds.includes(id)) {
          const next = selectedOmniIds.filter((v) => v !== id && v !== 0);
          return next.length ? next : [0];
        }
        const withoutAll = selectedOmniIds.filter((v) => v !== 0);
        return [...withoutAll, id];
      })();

      if (effectiveSelected.includes(0)) return [];
      const union = new Set<number>();
      for (const selId of effectiveSelected) {
        const found = omniChannels.find((o) => o.id === selId);
        if (found && Array.isArray(found.ai_content_suggestions)) {
          for (const s of found.ai_content_suggestions) union.add(s);
        }
      }
      return Array.from(union);
    });
  };
  //const handleCreatorToggle = createToggleHandleCreator(setCreatorsChoices);

  const { handlePrevious, handleNext, formatDateForDisplay } =
    useCalendarNavigations(calendarRef, setCurrentDate);

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
    //if (onCreatorChange) onCreatorChange(creatorsChoices);
  }, [
    selectedDate,
    channelsChoices,
    // creatorsChoices,
    onSelectedDateChange,
    onChannelsChange,
    // onCreatorChange,
  ]);

  useEffect(() => {
    if (isOpened && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();

      if (selectedDate) {
        calendarApi.gotoDate(selectedDate);
        setCurrentDate(selectedDate);
      } else {
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
        PaperProps={{ sx: { width: 253.6, boxShadow: 0 } }}
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
                  fontFamily: "Public Sans Variable",
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
            <DrawerDropdownOmni
              title="Trang đặt lịch hẹn"
              handleDataToggle={handleChannelToggle}
              data={omniChannels}
              dataChoices={selectedOmniIds}
            />
          </Box>

          {/* <Box>
            <DrawerDropdownCreator
              title="Người thực hiện"
              handleDataToggle={handleCreatorToggle}
              data={creators}
              dataChoices={creatorsChoices}
            />
          </Box> */}
        </Box>
      </Drawer>
    </>
  );
};

export default CustomCalendarDrawer;
