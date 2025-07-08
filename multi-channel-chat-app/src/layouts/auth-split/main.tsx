/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { layoutClasses } from "../classes";

// ----------------------------------------------------------------------

export function Main({ sx, children, layoutQuery, ...other }: any) {
  const theme = useTheme();

  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
        [theme.breakpoints.up(layoutQuery)]: {
          flexDirection: "row",
        },
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

export function Content({ sx, children, layoutQuery, ...other }: any) {
  const theme = useTheme();

  const renderContent = (
    <Box
      sx={{
        width: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: "var(--layout-auth-content-width)",
      }}
    >
      {children}
    </Box>
  );

  return (
    <Box
      className={layoutClasses.content}
      sx={{
        display: "flex",
        flex: "1 1 auto",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        p: theme.spacing(3, 2, 10, 2),
        [theme.breakpoints.up(layoutQuery)]: {
          p: theme.spacing(10, 2, 10, 2),
        },
        ...sx,
      }}
      {...other}
    >
      {renderContent}
    </Box>
  );
}
