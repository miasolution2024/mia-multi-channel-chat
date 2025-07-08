import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {
  InventoryTransaction,
  TransactionType,
} from "@/models/inventory-transaction/inventory-transaction";
import { ListItemText } from "@mui/material";
import { fDate, fTime } from "@/utils/format-time";
import { Label } from "@/components/label";
// ----------------------------------------------------------------------

export interface InventoryTransactionTableRowProps {
  row: InventoryTransaction;
}

export function InventoryTransactionTableRow({
  row,
}: InventoryTransactionTableRowProps) {
  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>
          <Label
            variant="soft"
            color={
              (row.transactionType === TransactionType.Purchase && "success") ||
              (row.transactionType === TransactionType.Sale && "warning") ||
              "default"
            }
          >
            {row.transactionType}
          </Label>
        </TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>{row.productName}</TableCell>
        <TableCell sx={{ whiteSpace: "nowrap" }}>
          {row.quantityChange}
        </TableCell>
        <TableCell>
          <ListItemText
            primary={fDate(row.transactionDate)}
            secondary={fTime(row.transactionDate)}
            slotProps={{
              primary: {
                typography: "body2",
                noWrap: true,
              },
              secondary: {
                mt: 0.5,
                component: "span",
                typography: "caption",
              },
            }}
          />
        </TableCell>
      </TableRow>
    </>
  );
}
