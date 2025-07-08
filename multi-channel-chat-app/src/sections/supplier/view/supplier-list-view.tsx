/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback } from "react";

import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
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
import { toast } from "@/components/snackbar";
import { ConfirmDialog } from "@/components/custom-dialog";
import { Box, Card } from "@mui/material";
import { Scrollbar } from "@/components/scrollbar";
import { deleteBulkSupplierAsync, useGetSuppliers } from "@/actions/supplier";
import { SupplierTableToolbar } from "../supplier-table-toolbar";
import { Supplier } from "@/models/supplier/supplier";
import { SupplierTableRow } from "../supplier-table-row";
import { SupplierForm } from "../supplier-form";
import { endpoints } from "@/utils/axios";
import { mutate } from "swr";
import { SupplierTableFiltersResult } from "../supplier-table-filters-result";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "supplierName", label: "Suppiler Name" },
  { id: "description", label: "Description" },
  { id: "address", label: "Address", width: 180 },
  { id: "conactPerson", label: "Contact Person" },
  { id: "", width: 88 },
];

type SelectedSupplierState = {
  openDialog: boolean;
  currentSupplier: Supplier | null;
};

export type FilterSupplierState = {
  supplierName: string;
};

// ----------------------------------------------------------------------

export function SupplierListView() {
  const table = useTable();

  const confirm = useBoolean();

  const selectedSupplier = useSetState<SelectedSupplierState>({
    currentSupplier: null,
    openDialog: false,
  });

  const { suppliers: tableData } = useGetSuppliers();

  const filters = useSetState<FilterSupplierState>({ supplierName: "" });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const canReset = !!filters.state.supplierName;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRows = useCallback(async () => {
    try {
      await deleteBulkSupplierAsync(table.selected);
      toast.success("Delete success!");
      table.setSelected([]);

      mutate(endpoints.suppliers.list);
    } catch (error: any) {
      toast.error(error.errorMessage || "Delete error!");
      console.log(error);
    }
  }, [table]);

  const handleEditRow = useCallback(
    (id: string) => {
      const supplier = tableData.find((item) => item.supplierID === id);
      selectedSupplier.setState({
        openDialog: true,
        currentSupplier: supplier,
      });
    },
    [selectedSupplier, tableData]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Supplier", href: paths.dashboard.supplier.root },
            { name: "List" },
          ]}
          action={
            <Button
              onClick={() =>
                selectedSupplier.setState({
                  openDialog: true,
                  currentSupplier: null,
                })
              }
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New supplier
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <SupplierTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <SupplierTableFiltersResult
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
                  dataFiltered.map((row: Supplier) => row.supplierID)
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
                  onSelectAllRows={(checked: boolean) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row: Supplier) => row.supplierID)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: Supplier) => (
                      <SupplierTableRow
                        key={row.supplierID}
                        row={row}
                        selected={table.selected.includes(row.supplierID)}
                        onSelectRow={() => table.onSelectRow(row.supplierID)}
                        onEditRow={handleEditRow}
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

      <SupplierForm
        currentSupplier={selectedSupplier.state.currentSupplier}
        open={selectedSupplier.state.openDialog}
        onClose={() => selectedSupplier.setState({ openDialog: false })}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete{" "}
            <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: Supplier[];
  comparator: (a: any, b: any) => number;
  filters: FilterSupplierState;
}) {
  const { supplierName } = filters;

  const stabilizedThis = inputData.map((el: Supplier, index: number) => [el, index]);

  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el: any) => el[0]);

  if (supplierName) {
    inputData = inputData.filter(
      (supplier: Supplier) =>
        supplier.supplierName
          .toLowerCase()
          .indexOf(supplierName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
