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
import { deleteBulkCustomerAsync, useGetCustomers } from "@/actions/customer";
import { CustomerTableToolbar } from "../customer-table-toolbar";
import { CustomerTableFiltersResult } from "../customer-table-filters-result";
import { Customer } from "@/models/customer/customer";
import { CustomerTableRow } from "../customer-table-row";
import { CustomerForm } from "../customer-form";
import { endpoints } from "@/utils/axios";
import { mutate } from "swr";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "Id" },
  { id: "name", label: "Name" },
  { id: "customer_source", label: "Customer Source" },
  { id: "phone_number", label: "Phone Number", width: 180 },
  { id: "email", label: "Email" },
  { id: "", width: 88 },
];

type SelectedCustomerState = {
  openDialog: boolean;
  currentCustomer: Customer | null;
};

export type FilterCustomerState = {
  customerName: string;
};

// ----------------------------------------------------------------------

export function CustomerListView() {
  const table = useTable();

  const confirm = useBoolean();

  const selectedCustomer = useSetState<SelectedCustomerState>({
    currentCustomer: null,
    openDialog: false,
  });

  const { customers: tableData } = useGetCustomers();

  const filters = useSetState<FilterCustomerState>({ customerName: "" });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const canReset = !!filters.state.customerName;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRows = useCallback(async () => {
    try {
      await deleteBulkCustomerAsync(table.selected);
      toast.success("Delete success!");
      table.setSelected([]);

      mutate(endpoints.customers.list);
    } catch (error: any) {
      toast.error(error.errorMessage || "Delete error!");
      console.log(error);
    }
  }, [table]);

  const handleEditRow = useCallback(
    (id: string) => {
      const customer = tableData.find((item) => item.id === id);
      selectedCustomer.setState({
        openDialog: true,
        currentCustomer: customer,
      });
    },
    [selectedCustomer, tableData]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Customer", href: paths.dashboard.customer.root },
            { name: "List" },
          ]}
          action={
            <Button
              onClick={() =>
                selectedCustomer.setState({
                  openDialog: true,
                  currentCustomer: null,
                })
              }
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New customer
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <CustomerTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <CustomerTableFiltersResult
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
                  dataFiltered.map((row: Customer) => row.id)
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
                      dataFiltered.map((row: Customer) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: Customer) => (
                      <CustomerTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
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

      <CustomerForm
        currentCustomer={selectedCustomer.state.currentCustomer}
        open={selectedCustomer.state.openDialog}
        onClose={() => selectedCustomer.setState({ openDialog: false })}
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
  inputData: Customer[];
  comparator: (a: any, b: any) => number;
  filters: FilterCustomerState;
}) {
  const { customerName } = filters;

  const stabilizedThis = inputData.map((el: Customer, index: number) => [el, index]);

  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el: any) => el[0]);

  if (customerName) {
    inputData = inputData.filter(
      (customer: Customer) =>
        customer.name
          .toLowerCase()
          .indexOf(customerName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
