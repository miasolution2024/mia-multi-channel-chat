/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Iconify } from '@/components/iconify';
import { varAlpha } from '@/theme/styles';
import { fCurrency, fShortenNumber } from '@/utils/format-number';


// ----------------------------------------------------------------------

export function PurchaseOrderAnalytic({ title, total, icon, color, percent, price }: any) {
  return (
    <Stack
      spacing={2.5}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: 1, minWidth: 200 }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
        <Iconify icon={icon} width={32} sx={{ color, position: 'absolute' }} />

        <CircularProgress
          size={56}
          thickness={2}
          value={percent}
          variant="determinate"
          sx={{ color, opacity: 0.48 }}
        />

        <CircularProgress
          size={56}
          value={100}
          thickness={3}
          variant="determinate"
          sx={{
            top: 0,
            left: 0,
            opacity: 0.48,
            position: 'absolute',
            color: (theme: any) => varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
          }}
        />
      </Stack>

      <Stack spacing={0.5}>
        <Typography variant="subtitle1">{title}</Typography>

        <Box component="span" sx={{ color: 'text.disabled', typography: 'body2' }}>
          {fShortenNumber(total)} invoices
        </Box>

        <Typography variant="subtitle2">{fCurrency(price)}</Typography>
      </Stack>
    </Stack>
  );
}
