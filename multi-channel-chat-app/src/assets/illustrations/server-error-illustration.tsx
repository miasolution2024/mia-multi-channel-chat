/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";

import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

import { BackgroundShape } from "./background-shape";
import { CONFIG } from "@/config-global";

// ----------------------------------------------------------------------

function ServerErrorIllustration({ hideBackground, sx, ...other }: any) {
  const theme = useTheme() as any;

  const PRIMARY_LIGHTER = theme.vars.palette.primary.lighter;

  const PRIMARY_LIGHT = theme.vars.palette.primary.light;

  const PRIMARY_MAIN = theme.vars.palette.primary.main;

  const PRIMARY_DARK = theme.vars.palette.primary.dark;

  const PRIMARY_DARKER = theme.vars.palette.primary.darker;

  return (
    <Box
      component="svg"
      width="100%"
      height="100%"
      viewBox="0 0 480 360"
      xmlns="http://www.w3.org/2000/svg"
      sx={{ width: 320, maxWidth: 1, flexShrink: 0, height: "auto", ...sx }}
      {...other}
    >
      {!hideBackground && <BackgroundShape />}

      <image
        href={`${CONFIG.assetsDir}/assets/illustrations/characters/character-8.webp`}
        height="300"
        x="340"
        y="30"
      />

      <path
        fill={PRIMARY_MAIN}
        d="M292.4 266.4h-7.3v-.6h6.7v-59.6h-25.7V118h-23.6v-.6h24.2v88.2h25.7v60.8zM146 164.5h-.6v-21.1h16.5v-19h.6v19.7H146v20.4z"
      />

      <path
        fill={PRIMARY_MAIN}
        d="M242.5 112.3c0 3.2-1.3 6.3-3.5 8.5-2.3 2.3-5.3 3.5-8.5 3.5h-82.9c-4.4.1-8.5-2.2-10.7-5.9-2.2-3.8-2.2-8.5 0-12.3 2.2-3.8 6.3-6.1 10.7-5.9h2.8c-2-7.2-.6-14.9 3.9-20.8s11.6-9.4 19-9.4h7c8.9 0 17 4.9 21.1 12.8 2-1 4.2-1.6 6.5-1.6h1.8c3.8 0 7.4 1.5 10.1 4.2 2.7 2.7 4.2 6.3 4.2 10.1v.7c0 1.3-.2 2.7-.6 3.9h6.9c6.8.2 12.2 5.6 12.2 12.2z"
        opacity="0.08"
      />

      <path
        fill="#fff"
        d="M275.4 228.3v14c0 .8-.4 1.5-1.1 1.8-.3.2-.7.3-1.1.3-1.2 0-2.2-1-2.2-2.1v-14c0-4.7-3.5-8.6-8.1-9.1-.4 0-.7-.1-1.1-.1-5.1 0-9.2 4.1-9.2 9.2v14c0 .8-.4 1.5-1.1 1.8-.3.2-.7.3-1.1.3-1.2 0-2.2-1-2.2-2.2v-14c0-7.5 6.1-13.5 13.5-13.5.4 0 .7 0 1.1.1 7.2.6 12.6 6.4 12.6 13.5z"
      />

      <path
        fill="#DFE3E8"
        d="M275.4 228.3v14c.3.5.2 1.2-.3 1.6-.5.4-1.1.4-1.6 0s-.6-1.1-.3-1.6v-14c0-5.1-4.1-9.2-9.2-9.2-.4 0-.7 0-1.1.1-.4 0-.7-.1-1.1-.1-5.1 0-9.2 4.1-9.2 9.2v14c.3.5.2 1.2-.3 1.6-.5.4-1.1.4-1.6 0s-.6-1-.3-1.6v-14c-.4-4.7 1.9-9.2 5.9-11.7s9.1-2.5 13.1 0c4.1 2.4 6.4 7 6 11.7z"
      />

      <path
        fill={PRIMARY_DARKER}
        d="M277.8 242.2h-33.2c-4 0-7.3 3.3-7.3 7.3v33.2c0 4 3.3 7.3 7.3 7.3h33.2c4 0 7.3-3.3 7.3-7.3v-33.2c0-4-3.3-7.3-7.3-7.3z"
      />

      <path
        fill={PRIMARY_DARK}
        d="M277.8 242.2h-24.9c-4 0-7.3 3.3-7.3 7.3v33.2c0 4 3.3 7.3 7.3 7.3h24.9c4 0 7.3-3.3 7.3-7.3v-33.2c0-4-3.3-7.3-7.3-7.3z"
      />

      <path
        fill="url(#paint0_linear_1_140)"
        d="M278 145h-22c-4.4 0-8 3.6-8 8v22.8c0 4.4 3.6 8 8 8h22c4.4 0 8-3.6 8-8V153c0-4.4-3.6-8-8-8z"
      />

      <path
        fill={PRIMARY_MAIN}
        d="M126 129.7h-22.4c-1.7 0-3 1.3-3 3v32.8c0 1.7 1.3 3 3 3H126c1.7 0 3-1.3 3-3v-32.8c0-1.7-1.4-3-3-3z"
        opacity="0.08"
      />

      <path
        fill="#fff"
        d="M119.1 135.9H96.6c-1.7 0-3 1.3-3 3v32.8c0 1.7 1.3 3 3 3H119c1.7 0 3-1.3 3-3v-32.8c.1-1.6-1.3-3-2.9-3z"
      />

      <path
        fill={PRIMARY_MAIN}
        d="M119.1 135.9H96.6c-1.7 0-3 1.3-3 3v32.8c0 1.7 1.3 3 3 3H119c1.7 0 3-1.3 3-3v-32.8c.1-1.6-1.3-3-2.9-3z"
        opacity="0.48"
      />

      <path
        fill={PRIMARY_MAIN}
        d="M80 243.5c.2 2 .9 3.9 2 5.5 4.4 7.8 9.4 15.5 16.2 21.3 10.1 8.5 23.2 12.2 36 15.7-1.1-.6-2.5-6.4-3-7.7-1-2.5-1.9-5.1-2.8-7.6-1.5-4-4.6-7.2-7.7-10.2-6.9-6.7-15.3-11.6-24.5-14.4-5.3-1.7-10.8-2.6-16.2-2.6z"
      />

      <path
        fill={PRIMARY_DARKER}
        d="M129.8 247.8c-1-7.3-2.1-14.6-5-21.4-2.9-6.7-8-12.9-14.9-15.4l-.6 31.2c-.1 6-.2 12.1 1.5 17.9 3 10.1 13.5 21.9 23.6 25.3 1.5-4.8-1-12.2-1.7-17.2l-2.9-20.4z"
      />

      <path
        fill={PRIMARY_DARK}
        d="M237.2 164H140c-4.7 0-8.4 3.8-8.4 8.4v19.1c0 4.7 3.8 8.4 8.4 8.4h97.1c4.7 0 8.4-3.8 8.4-8.4v-19.1c.1-4.6-3.7-8.4-8.3-8.4zm0 44H140c-4.7 0-8.4 3.8-8.4 8.4v19.1c0 4.7 3.8 8.4 8.4 8.4h97.1c4.7 0 8.4-3.8 8.4-8.4v-19.1c.1-4.6-3.7-8.4-8.3-8.4zm0 44.2H140c-4.7 0-8.4 3.8-8.4 8.4v19.1c0 4.7 3.8 8.4 8.4 8.4h97.1c4.7 0 8.4-3.8 8.4-8.4v-19.1c.1-4.6-3.7-8.4-8.3-8.4z"
      />

      <path
        fill="url(#paint1_linear_1_140)"
        d="M237.6 164h-91.2c-4.7 0-8.4 3.8-8.4 8.4v19.1c0 4.7 3.8 8.4 8.4 8.4h91.1c4.7 0 8.4-3.8 8.4-8.4v-19.1c.1-4.6-3.7-8.4-8.3-8.4zm8.4 53.6v16.8c0 2.5-1 5-2.9 6.8-1.9 1.8-4.4 2.8-7.1 2.8h-88c-2.7 0-5.2-1-7.1-2.8-1.9-1.8-2.9-4.2-2.9-6.8v-16.8c0-5.3 4.5-9.6 10-9.6h88c2.7 0 5.2 1 7.1 2.8 1.8 1.8 2.9 4.2 2.9 6.8zm-8.4 34.4h-91.2c-4.7 0-8.4 3.8-8.4 8.4v19.1c0 4.7 3.8 8.4 8.4 8.4h91.1c4.7 0 8.4-3.8 8.4-8.4v-19.1c.1-4.6-3.7-8.4-8.3-8.4z"
      />

      <path
        fill={PRIMARY_LIGHTER}
        d="M161.6 182c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zm12 0c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zm8 4c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zM162 226c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zm12 0c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zm8 4c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm52-6h-30c-.6 0-1 .4-1 1v2c0 .6.4 1 1 1h30c.6 0 1-.4 1-1v-2c0-.6-.4-1-1-1zm-72 46c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zm12 0c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zm8 4c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm52-6h-30c-.6 0-1 .4-1 1v2c0 .6.4 1 1 1h30c.6 0 1-.4 1-1v-2c0-.6-.4-1-1-1z"
      />

      <path
        fill={PRIMARY_DARKER}
        d="M264.4 267.7c.5-1.8-.8-3.7-1.2-5.5-.1-.3-.1-.7 0-1 .2-1.5 1.5-2.6 3-2.6s2.8 1.1 3 2.6c.1.3 0 .7 0 1-.3 1.8-1.6 3.8-1.1 5.6l.4 1.3c.5 1.5-.7 3.1-2.3 3.1-1.6 0-2.7-1.5-2.3-3l.5-1.5zM258 158.8l9.2-4.8 8.8 4.8s-1.6 11.8-8.6 15.2c0 0-8.6-3.3-9.4-15.2z"
      />

      <defs>
        <linearGradient
          id="paint0_linear_1_140"
          x1="277.574"
          x2="255.652"
          y1="143.24"
          y2="187.057"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_MAIN} />
          <stop offset="1" stopColor={PRIMARY_DARK} />
        </linearGradient>

        <linearGradient
          id="paint1_linear_1_140"
          x1="138"
          x2="138"
          y1="164"
          y2="287.9"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={PRIMARY_LIGHT} />
          <stop offset="1" stopColor={PRIMARY_DARK} />
        </linearGradient>
      </defs>
    </Box>
  );
}

export default memo(ServerErrorIllustration);
