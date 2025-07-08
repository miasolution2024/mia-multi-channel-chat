/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CardHeader from '@mui/material/CardHeader';
import { Scrollbar } from '@/components/scrollbar';
import { TableHeadCustom } from '@/components/table';
import { FlagIcon } from '@/components/iconify';
import { fCurrency } from '@/utils/format-number';
import { Label } from '@/components/label';



// ----------------------------------------------------------------------

export function EcommerceBestSalesman({ title, subheader, tableData, headLabel, ...other }: any) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar sx={{ minHeight: 422 }}>
        <Table sx={{ minWidth: 640 }}>
          <TableHeadCustom headLabel={headLabel} />

          <TableBody>
            {tableData.map((row: any) => (
              <RowItem key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

function RowItem({ row }: any) {
  return (
    <TableRow>
      <TableCell>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar alt={row.name} src={row.avatarUrl} />
          {row.name}
        </Box>
      </TableCell>

      <TableCell>{row.category}</TableCell>

      <TableCell align="center">
        <FlagIcon code={row.countryCode} />
      </TableCell>

      <TableCell align="right">{fCurrency(row.totalAmount)}</TableCell>

      <TableCell align="right">
        <Label
          variant="soft"
          color={
            (row.rank === 'Top 1' && 'primary') ||
            (row.rank === 'Top 2' && 'secondary') ||
            (row.rank === 'Top 3' && 'info') ||
            (row.rank === 'Top 4' && 'warning') ||
            'error'
          }
        >
          {row.rank}
        </Label>
      </TableCell>
    </TableRow>
  );
}
