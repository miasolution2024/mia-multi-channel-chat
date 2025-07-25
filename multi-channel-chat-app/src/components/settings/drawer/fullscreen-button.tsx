/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import { svgColorClasses } from "../../svg-color";
import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

export function FullScreenButton() {
  const [fullscreen, setFullscreen] = useState(false);

  const onToggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }, []);

  return (
    <Tooltip title={fullscreen ? "Exit" : "Full Screen"}>
      <IconButton
        onClick={onToggleFullScreen}
        sx={{
          [`& .${svgColorClasses.root}`]: {
            background: (theme: any) =>
              `linear-gradient(135deg, ${theme.vars.palette.grey[500]}, ${theme.vars.palette.grey[600]})`,
            ...(fullscreen && {
              background: (theme: any) =>
                `linear-gradient(135deg, ${theme.vars.palette.primary.light}, ${theme.vars.palette.primary.main})`,
            }),
          },
        }}
      >
        <Iconify
          icon={
            fullscreen
              ? "solar:quit-full-screen-square-outline"
              : "solar:full-screen-square-outline"
          }
        />
      </IconButton>
    </Tooltip>
  );
}
