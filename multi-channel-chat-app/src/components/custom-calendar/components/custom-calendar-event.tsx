import React, { useState } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import type { EventContentArg } from "@fullcalendar/core";
import { Iconify } from "@/components/iconify";
import { useRouter } from "next/navigation";
import ModalSchedule from "./modal-schedule";
import { paths } from "@/routes/path";

type CustomCalendarEventProps = EventContentArg & {
  timeSetup: string;
};

const colorByStatus = [
  {
    id: 1,
    status: "draft",
    color: "#FEF6B8",
    noteColor: "#EFB034",
    hoverColor: "#FDEF86",
  },
  {
    id: 2,
    status: "in_progress",
    color: "#F2F7FD",
    noteColor: "#2373D3",
    hoverColor: "#CADEF7",
  },
  {
    id: 3,
    status: "published",
    color: "#E8F7E9",
    noteColor: "#34A853",
    hoverColor: "#D2EFD4",
  },
];

const CustomCalendarEvent: React.FC<CustomCalendarEventProps> = (arg) => {
  const id = arg.event.id;
  const title = arg.event.title;
  const startDate = arg.event.start;
  const extended = arg.event.extendedProps as {
    channelIds: number[];
    channelName: string;
    creatorName: string;
    userCreated: string;
    postType: string;
    campaignName: string;
    status: string;
    timeCreated: string;
  };

  const router = useRouter();
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
          p: "16px 22px",
          cursor: "pointer",
          // my: 0.5,
          "&:hover": {
            bgcolor: getColors?.color
              ? `${getColors.hoverColor}`
              : "transparent",
          },
        }}
        onClick={() => {
          openSchedule(extended.status !== "published");
        }}
      >
        <Typography
          sx={{
            color: getColors?.noteColor,
            fontFamily: "Public Sans Variable",
            fontSize: "14px",
            lineHeight: "22px",
            fontWeight: 700,
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
            width: "100%",
          }}
        >
          <span
            onClick={(e) => {
              e.stopPropagation(); // Prevent the parent Box's onClick from firing
              router.push(paths.dashboard.contentAssistant.edit(id));
            }}
          >
            {title}
          </span>
        </Typography>

        {arg.timeSetup === "Tuần" || arg.timeSetup === "Ngày" ? (
          <>
            {extended.status === "published" && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 0.5,
                  gap: 1,
                  width: "100%",
                }}
              >
                <Iconify
                  icon="iconamoon:clock-light"
                  width="16"
                  height="16"
                  style={{ color: "#6F7787", flexShrink: 0 }}
                />
                <Typography
                  sx={{
                    color: "#323743",
                    fontFamily: "Public Sans Variable",
                    fontSize: "12px",
                    lineHeight: "20px",
                    fontWeight: 400,
                  }}
                >
                  {extended.timeCreated}
                </Typography>
              </Box>
            )}

            {extended.postType && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    // alignItems: "flex-start",
                    mt: 0.5,
                    gap: 1,
                    width: "100%",
                  }}
                >
                  {(extended.postType === "facebook_post" ||
                    extended.postType === "instagram_post" ||
                    extended.postType === "zalo_post" ||
                    extended.postType === "zalo_oa_post") && (
                    <Iconify
                      icon={
                        extended.postType === "facebook_post"
                          ? "logos:facebook"
                          : extended.postType === "instagram_post"
                          ? "logos:facebook"
                          : extended.postType === "zalo_post" ||
                            extended.postType === "zalo_oa_post"
                          ? "arcticons:zalo"
                          : ""
                      }
                      width="16"
                      height="16"
                      style={{ flexShrink: 0 }}
                    />
                  )}
                  <Typography
                    sx={{
                      color: "#323743",
                      fontFamily: "Public Sans Variable",
                      fontSize: "12px",
                      lineHeight: "20px",
                      fontWeight: 400,
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                      // flex: "1 1 0%",
                      minWidth: 0,
                    }}
                  >
                    {extended.channelName || "No Channel"}
                  </Typography>
                </Box>
              </>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 0.5,
                gap: 1,
              }}
            >
              <Iconify
                icon="ion:person-circle-outline"
                width="16"
                height="16"
                style={{ color: "#6F7787", flexShrink: 0 }}
              />
              <Typography
                sx={{
                  color: "#323743",
                  fontFamily: "Public Sans Variable",
                  fontSize: "12px",
                  lineHeight: "18px",
                  fontWeight: 400,
                }}
              >
                {extended.creatorName || "Unknown User"}
              </Typography>
            </Box>

            {extended.campaignName && (
              <Box
                sx={{
                  mt: 0.5,
                  width: "fit-content",
                  fontFamily: "Public Sans Variable",
                  fontSize: "11px",
                  lineHeight: "18px",
                  fontWeight: 400,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 4px",
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
                  style={{ color: "#fff", flexShrink: 0 }}
                />
                <Typography
                  sx={{
                    color: "#fff",
                    fontFamily: "Public Sans Variable",
                    fontSize: "12px",
                    lineHeight: "18px",
                    fontWeight: 400,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                    flex: 1,
                  }}
                >
                  {extended.campaignName}
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
                    fontFamily: "Public Sans Variable",
                    fontSize: "12px",
                    lineHeight: "20px",
                    fontWeight: 400,
                  }}
                >
                  {/* {extended.timeCreated +
                    " " +
                    (startDate ? formatToDDMMYYYY(startDate) : "")} */}
                  {extended.timeCreated}
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
                {/* <Tooltip title={extended.channelName || "No Channel"}>
                  <Iconify icon="logos:facebook" width="16" height="16" />
                </Tooltip> */}
                {extended.postType === "facebook_post" ||
                extended.postType === "instagram_post" ||
                extended.postType === "zalo_post" ||
                extended.postType === "zalo_oa_post" ? (
                  <Tooltip title={extended.channelName || "No Channel"}>
                    <Iconify
                      icon={
                        extended.postType === "facebook_post"
                          ? "logos:facebook"
                          : extended.postType === "instagram_post"
                          ? "logos:facebook"
                          : extended.postType === "zalo_post" ||
                            extended.postType === "zalo_oa_post"
                          ? "arcticons:zalo"
                          : ""
                      }
                      width="16"
                      height="16"
                      style={{ flexShrink: 0 }}
                    />
                  </Tooltip>
                ) : null}
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
