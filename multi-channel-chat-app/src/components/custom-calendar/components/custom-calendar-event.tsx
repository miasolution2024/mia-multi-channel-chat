import React, { useState } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import type { EventContentArg } from "@fullcalendar/core";
import { Iconify } from "@/components/iconify";
import { formatToDDMMYYYY } from "../hooks/use-format-date-time";
import ModalSchedule from "./modal-schedule";

type CustomCalendarEventProps = EventContentArg & {
  timeSetup: string;
};

const colorByStatus = [
  { id: 1, status: "draft", color: "#FEF6B8", noteColor: "#EFB034" },
  { id: 2, status: "in_progress", color: "#F2F7FD", noteColor: "#2373D3" },
  { id: 3, status: "published", color: "#E8F7E9", noteColor: "#34A853" },
];

const CustomCalendarEvent: React.FC<CustomCalendarEventProps> = (arg) => {
  const id = arg.event.id;
  const title = arg.event.title;
  const startDate = arg.event.start;
  const extended = arg.event.extendedProps as {
    channelIds: number[];
    channelName: string;
    userCreated: string;
    postType: string;
    campaign: string;
    status: string;
    timeCreated: string;
  };

  const [openModalSchedule, setOpenModalSchedule] = useState(false);
  const getColors = colorByStatus.find((c) => c.status === extended.status);

  const openSchedule = (isOpened: boolean) => {
    setOpenModalSchedule(isOpened);
  };

  const handleCloseSchedule = () => {
    setOpenModalSchedule(false);
  };

  return (
    <>
      <Box
        sx={{
          borderRadius: "6px",
          bgcolor: getColors?.color || "transparent",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          width: "100%",
          p: "8px",
          my: 0.5,
          "&:hover": {
            bgcolor: getColors?.color ? `${getColors.color}80` : "transparent",
            cursor: "pointer",
          },
        }}
        onClick={() => openSchedule(true)}
      >
        <Typography
          sx={{
            color: getColors?.noteColor,
            fontFamily: "Inter",
            fontSize: "14px",
            lineHeight: "22px",
            fontWeight: 700,
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
            width: "100%",
          }}
        >
          {title}
        </Typography>

        {arg.timeSetup === "Tuần" || arg.timeSetup === "Ngày" ? (
          <>
            <Box
              sx={{
                display: "flex",
                // justifyContent: "center",
                alignItems: "center",
                mt: 1,
                gap: 1,
                width: "100%",
              }}
            >
              <Iconify
                icon="iconamoon:clock-light"
                width="16"
                height="16"
                style={{ color: "#6F7787" }}
              />
              <Typography
                sx={{
                  color: "#323743",
                  fontFamily: "Inter",
                  fontSize: "12px",
                  lineHeight: "20px",
                  fontWeight: 400,
                }}
              >
                {extended.timeCreated}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                // justifyContent: "center",
                alignItems: "flex-start",
                gap: 1,
                width: "100%",
              }}
            >
              <Iconify
                icon="logos:facebook"
                width="16"
                height="16"
                style={{ marginTop: 2 }}
              />
              <Typography
                sx={{
                  color: "#323743",
                  fontFamily: "Inter",
                  fontSize: "12px",
                  lineHeight: "20px",
                  fontWeight: 400,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                  flex: "1 1 0%",
                  minWidth: 0,
                }}
              >
                {extended.channelName || "No Channel"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 1,
                gap: 1,
              }}
            >
              <Iconify
                icon="ion:person-circle-outline"
                width="16"
                height="16"
                style={{ color: "#6F7787" }}
              />
              <Typography
                sx={{
                  color: "#323743",
                  fontFamily: "Inter",
                  fontSize: "11px",
                  lineHeight: "18px",
                  fontWeight: 400,
                }}
              >
                {extended.userCreated || "Unknown User"}
              </Typography>
            </Box>

            {extended.campaign && (
              <Box
                sx={{
                  mt: 0.5,
                  width: "fit-content",
                  fontFamily: "Inter",
                  fontSize: "11px",
                  lineHeight: "18px",
                  fontWeight: 400,
                  display: "flex",
                  alignItems: "center",
                  padding: 0.5,
                  gap: 1,
                  backgroundColor: getColors?.noteColor,
                  border: "none",
                  borderRadius: "10px",
                }}
              >
                <Iconify
                  icon="ri:calendar-line"
                  width="16"
                  height="16"
                  style={{ color: "#fff" }}
                />
                <Typography
                  sx={{
                    color: "#fff",
                    fontFamily: "Inter",
                    fontSize: "11px",
                    lineHeight: "18px",
                    fontWeight: 400,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    flex: 1,
                  }}
                >
                  {extended.campaign}
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 0.25,
                  gap: 0.5,
                  flexWrap: "wrap",
                }}
              >
                <Iconify
                  icon="iconamoon:clock-light"
                  width="16"
                  height="16"
                  style={{ color: "#6F7787" }}
                />
                <Typography
                  sx={{
                    color: "#323743",
                    fontFamily: "Inter",
                    fontSize: "12px",
                    lineHeight: "20px",
                    fontWeight: 400,
                  }}
                >
                  {extended.timeCreated +
                    " " +
                    (startDate ? formatToDDMMYYYY(startDate) : "")}
                </Typography>
              </Box>

              <Box
                sx={{
                  ml: "auto",
                  display: "flex",
                  alignItems: "center",
                  mt: 0.2,
                }}
              >
                <Tooltip title={extended.channelName || "No Channel"}>
                  <Iconify icon="logos:facebook" width="16" height="16" />
                </Tooltip>
              </Box>
            </Box>
          </>
        )}

        <ModalSchedule
          isOpened={openModalSchedule}
          handleCloseSchedule={handleCloseSchedule}
          workingId={id}
          workingTitle={title}
          dateCreated={startDate}
          timeCreated={extended.timeCreated}
        />
      </Box>
    </>
  );
};

export default CustomCalendarEvent;
