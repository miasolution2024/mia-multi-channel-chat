import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import type { EventContentArg } from "@fullcalendar/core";
import { Iconify } from "@/components/iconify";

type CustomCalendarEventProps = EventContentArg & {
  timeSetup: string;
};

const colorByStatus = [
  { id: 1, status: "Đã đăng", color: "#FEF6B8", noteColor: "#EFB034" },
  { id: 1, status: "Đã lên lịch", color: "#F2F7FD", noteColor: "#2373D3" },
];

const CustomCalendarEvent: React.FC<CustomCalendarEventProps> = (arg) => {
  const title = arg.event.title;
  const extended = arg.event.extendedProps as {
    channel: string;
    people: string;
    note: string;
    status: string;
    time: string;
  };

  const getColors = colorByStatus.find((c) => c.status === extended.status);

  return (
    <>
      <Box
        sx={{
          borderRadius: "6px",
          bgcolor: getColors?.color || "transparent",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          p: "8px",
          my: 0.5,
        }}
      >
        <Typography
          sx={{
            color: getColors?.noteColor,
            fontFamily: "Inter",
            fontSize: "14px",
            lineHeight: "22px",
            fontWeight: 700,
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
                {extended.time}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                // justifyContent: "center",
                alignItems: "flex-start",

                gap: 1,
                flexWrap: "wrap",
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
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {extended.channel}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                // justifyContent: "center",
                alignItems: "center",
                mt: 2,
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
                {extended.people}
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 0.5,
                width: "110px",
                height: "20px",
                fontFamily: "Inter",
                fontSize: "11px",
                lineHeight: "18px",
                fontWeight: 400,
                display: "flex",
                alignItems: "center",
                // justifyContent: "space-between",
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
                }}
              >
                {extended.note}
              </Typography>
            </Box>
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
                  mt: 0.5,
                  gap: 1,
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
                  {extended.time}
                </Typography>
              </Box>

              <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                <Tooltip title={extended.channel}>
                  <Iconify icon="logos:facebook" width="16" height="16" />
                </Tooltip>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default CustomCalendarEvent;
