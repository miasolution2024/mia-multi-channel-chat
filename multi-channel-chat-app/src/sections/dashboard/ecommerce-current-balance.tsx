/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { fCurrency } from '@/utils/format-number';


// ----------------------------------------------------------------------

export function EcommerceCurrentBalance({
  sx,
  title,
  earning,
  refunded,
  orderTotal,
  currentBalance,
  ...other
}: any) {
  const row = (label: string, value: any) => (
    <Box sx={{ display: 'flex', typography: 'body2', justifyContent: 'space-between' }}>
      <Box component="span" sx={{ color: 'text.secondary' }}>
        {label}
      </Box>
      <Box component="span">{fCurrency(value)}</Box>
    </Box>
  );

  return (
    <Card sx={{ p: 3, ...sx }} {...other}>
      <Box sx={{ mb: 1, typography: 'subtitle2' }}>{title}</Box>

      <Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ typography: 'h3' }}>{fCurrency(currentBalance)}</Box>

        {row('Order total', orderTotal)}
        {row('Earning', earning)}
        {row('Refunded', refunded)}

        <Box sx={{ gap: 2, display: 'flex' }}>
          <Button fullWidth variant="contained" color="warning">
            Request
          </Button>

          <Button fullWidth variant="contained" color="primary">
            Transfer
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
