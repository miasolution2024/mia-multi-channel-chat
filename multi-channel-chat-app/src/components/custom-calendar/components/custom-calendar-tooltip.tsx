import { Iconify } from "@/components/iconify";
import { paths } from "@/routes/path";
import { Box, Button } from "@mui/material";
// import router from "next/router";
import { useRouter } from "next/navigation";
import React from "react";

interface CustomCalendarTooltipProps {
  showTooltip: boolean;
  tooltipPosition: { x: number; y: number };
}

const CustomCalendarTooltip: React.FC<CustomCalendarTooltipProps> = ({
  showTooltip,
  tooltipPosition,
}) => {
  const router = useRouter();

  if (!showTooltip) return null;

  return (
    <>
      <Box
        data-tooltip="true"
        sx={{
          position: "fixed",
          left: tooltipPosition.x - 100,
          top: tooltipPosition.y,
          zIndex: 9999,
          pointerEvents: "auto",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -8,
            left: 20,
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: "8px solid #4a4a4a",
          }}
        />

        <Box
          sx={{
            backgroundColor: "#4a4a4ae8",
            color: "white",
            padding: "8px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 500,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          Tạo bài viết
          <Button
            sx={{
              width: "32px",
              height: "32px",
              padding: 0,
              minWidth: 0,
              backgroundColor: "white",
              border: "1px solid #2373d3",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              zIndex: 10000,
              pointerEvents: "auto",
              "&:hover": {
                backgroundColor: "#f0f7ff",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(paths.dashboard.contentAssistant.new);
            }}
          >
            <Iconify
              icon="material-symbols:add"
              sx={{ color: "#2373d3", fontSize: "16px" }}
            />
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CustomCalendarTooltip;
