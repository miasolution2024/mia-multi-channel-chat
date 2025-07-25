/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

export function Layout({ slots, sx, ...other }: any) {
  const renderNav = (
    <Box display="flex" flexDirection="column">
      {slots.nav}
    </Box>
  );

  const renderHeader = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        py: 1,
        pr: 1,
        pl: 2.5,
        height: 72,
        flexShrink: 0,
        borderBottom: (theme: any) => `solid 1px ${theme.vars.palette.divider}`,
      }}
    >
      {slots.header}
    </Stack>
  );

  const renderMain = <Stack sx={{ flex: '1 1 auto', minWidth: 0 }}>{slots.main}</Stack>;

  const renderDetails = <Stack sx={{ minHeight: 0 }}>{slots.details}</Stack>;

  return (
    <Stack direction="row" sx={sx} {...other}>
      {renderNav}

      <Stack sx={{ flex: '1 1 auto', minWidth: 0 }}>
        {renderHeader}

        <Stack direction="row" sx={{ flex: '1 1 auto', minHeight: 0 }}>
          {renderMain}
          {renderDetails}
        </Stack>
      </Stack>
    </Stack>
  );
}
