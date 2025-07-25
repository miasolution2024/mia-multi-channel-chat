/* eslint-disable @typescript-eslint/no-explicit-any */
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { CONFIG } from "@/config-global";
import { bgGradient, varAlpha } from "@/theme/styles";

// ----------------------------------------------------------------------

export function Section({
  sx,
  method,
  layoutQuery,
  methods,
  title = "Manage the job",
  imgUrl = `${CONFIG.assetsDir}/assets/illustrations/illustration-dashboard.webp`,
  subtitle = "More effectively with optimized workflows.",
  ...other
}: any) {
  const theme = useTheme() as any;

  return (
    <Box
      sx={{
        ...bgGradient({
          color: `0deg, ${varAlpha(
            theme.vars.palette.background.defaultChannel,
            0.92
          )}, ${varAlpha(theme.vars.palette.background.defaultChannel, 0.92)}`,
          imgUrl: `${CONFIG.assetsDir}/assets/background/background-3-blur.webp`,
        }),
        px: 3,
        pb: 3,
        width: 1,
        maxWidth: 480,
        display: "none",
        position: "relative",
        pt: "var(--layout-header-desktop-height)",
        [theme.breakpoints.up(layoutQuery)]: {
          gap: 8,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        },
        ...sx,
      }}
      {...other}
    >
      <div>
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          {title}
        </Typography>

        {subtitle && (
          <Typography
            sx={{ color: "text.secondary", textAlign: "center", mt: 2 }}
          >
            {subtitle}
          </Typography>
        )}
      </div>

      <Box
        component="img"
        alt="Dashboard illustration"
        src={imgUrl}
        sx={{ width: 1, aspectRatio: "4/3", objectFit: "cover" }}
      />

      {!!methods?.length && method && (
        <Box component="ul" gap={2} display="flex">
          {methods.map((option: any) => {
            const selected = method === option.label.toLowerCase();

            return (
              <Box
                key={option.label}
                component="li"
                sx={{
                  ...(!selected && {
                    cursor: "not-allowed",
                    filter: "grayscale(1)",
                  }),
                }}
              >
                <Tooltip title={option.label} placement="top">
                  <Link
                    component={RouterLink}
                    href={option.path}
                    sx={{
                      ...(!selected && { pointerEvents: "none" }),
                    }}
                  >
                    <Box
                      component="img"
                      alt={option.label}
                      src={option.icon}
                      sx={{ width: 32, height: 32 }}
                    />
                  </Link>
                </Tooltip>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
