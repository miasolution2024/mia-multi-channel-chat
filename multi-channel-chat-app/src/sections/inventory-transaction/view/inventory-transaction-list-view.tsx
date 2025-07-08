/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Table from "@mui/material/Table";
import Tooltip from "@mui/material/Tooltip";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import { useTable } from "@/hooks/use-table";
import { useBoolean } from "@/hooks/use-boolean";
import { useSetState } from "@/hooks/use-set-state";
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
} from "@/components/table";
import { paths } from "@/routes/path";
import { DashboardContent } from "@/layouts/dashboard";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { Iconify } from "@/components/iconify";
import { Box, Card } from "@mui/material";
import { Scrollbar } from "@/components/scrollbar";
import { InventoryTransactionTableToolbar } from "../inventory-transaction-table-toolbar";
import { InventoryTransactionTableRow } from "../inventory-transaction-table-row";
import { useGetInventoryTransactions } from "@/actions/inventory-transaction";
import { InventoryTransaction } from "@/models/inventory-transaction/inventory-transaction";
import { InventoryTransactionTableFiltersResult } from "../inventory-transaction-table-filters-result";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "type", label: "Type" },
  { id: "productName", label: "Product Name" },
  { id: "quantityChange", label: "Quantity" },
  { id: "transactionDate", label: "Transaction Date" },
];

export type FilterInventoryTransactionState = {
  productName: string;
};

// ----------------------------------------------------------------------

export function InventoryTransactionListView() {
  const table = useTable();

  const confirm = useBoolean();

  const { inventoryTransactions: tableData } = useGetInventoryTransactions();

  const filters = useSetState<FilterInventoryTransactionState>({
    productName: "",
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const canReset = !!filters.state.productName;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            {
              name: "Inventory Transaction",
              href: paths.dashboard.inventoryTransaction.root,
            },
            { name: "List" },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <InventoryTransactionTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <InventoryTransactionTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: "relative" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked: boolean) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map(
                    (row: InventoryTransaction) => row.transactionID
                  )
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 960 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: InventoryTransaction) => (
                      <InventoryTransactionTableRow
                        key={row.transactionID}
                        row={row}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      dataFiltered.length
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>
    </>
  );
}

function applyFilter({ inputData, comparator, filters }: any) {
  const { productName} = filters;

  const stabilizedThis = inputData.map((el: any, index: any) => [el, index]);

  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el: any) => el[0]);

  if (productName) {
    inputData = inputData.filter(
      (inventorytransaction: InventoryTransaction) =>
        inventorytransaction.productName
          .toLowerCase()
          .indexOf(productName.toLowerCase()) !== -1
    );
  }


  return inputData;
}
