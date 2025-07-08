/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";

import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";

import { useBoolean } from "@/hooks/use-boolean";
import { useSetState } from "@/hooks/use-set-state";

import { varAlpha } from "@/theme/styles";
import { DashboardContent } from "@/layouts/dashboard";

import { Label } from "@/components/label";
import { toast } from "@/components/snackbar";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";
import { ConfirmDialog } from "@/components/custom-dialog";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "@/components/table";

import { OrderTableRow } from "../order-table-row";
import { OrderTableToolbar } from "../order-table-toolbar";
import { OrderTableFiltersResult } from "../order-table-filters-result";
import { useRouter } from "next/navigation";
import { useGetSalesOrders } from "@/actions/sales-order";
import { fIsAfter, fIsBetween } from "@/utils/format-time";
import { paths } from "@/routes/path";
import { SalesOrder, SalesOrderStatus } from "@/models/sales-order/sales-order";
import { SalesOrderAnalytic } from "../order-analytic";
import { Divider, Stack } from "@mui/material";
import { sumBy } from "@/utils/helper";
import { useTheme } from "@emotion/react";

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: SalesOrderStatus.All, label: "All" },
  { value: SalesOrderStatus.PENDING, label: "Pending" },
  { value: SalesOrderStatus.PAID, label: "Paid" },
  { value: SalesOrderStatus.CANCELLED, label: "Cancelled" },
  { value: SalesOrderStatus.OVERDUE, label: "Overdue" },
  { value: SalesOrderStatus.DRAFT, label: "Draft" },
];

const TABLE_HEAD = [
  { id: "name", label: "Customer" },
  { id: "createdAt", label: "Date", width: 140 },
  {
    id: "totalQuantity",
    label: "Items",
    width: 120,
    align: "center",
  },
  { id: "totalAmount", label: "Price", width: 140 },
  { id: "orderStatus", label: "Status", width: 110 },
  { id: "", width: 88 },
];

export type FilterSalesOrderState = {
  customerName: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export function OrderListView() {
  const theme = useTheme() as any;

  const table = useTable({ defaultOrderBy: "orderNumber" });

  const router = useRouter();

  const confirm = useBoolean();

  const { salesOrders: tableData } = useGetSalesOrders();

  const filters = useSetState<FilterSalesOrderState>({
    customerName: "",
    status: SalesOrderStatus.All,
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });

  const canReset =
    !!filters.state.customerName ||
    filters.state.status !== "all" ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.salesOrder.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event: any, newValue: string) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const getSalesOrderLength = (status: string) =>
    tableData.filter((item) => item.orderStatus === status).length;

  const getTotalAmount = (status: string) =>
    sumBy(
      tableData.filter((item) => item.orderStatus === status),
      (po: SalesOrder) => po.totalAmount
    );

  const getPercentByStatus = (status: string) =>
    (getSalesOrderLength(status) / tableData.length) * 100;

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Order", href: paths.dashboard.salesOrder.root },
            { name: "List" },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card sx={{ mb: { xs: 3, md: 5 } }}>
          <Scrollbar sx={{ minHeight: 108 }}>
            <Stack
              direction="row"
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderStyle: "dashed" }}
                />
              }
              sx={{ py: 2 }}
            >
              <SalesOrderAnalytic
                title="Total"
                total={tableData.length}
                percent={100}
                price={sumBy(
                  tableData,
                  (purchaseorder: SalesOrder) => purchaseorder.totalAmount
                )}
                icon="solar:bill-list-bold-duotone"
                color={theme.vars.palette.info.main}
              />

              <SalesOrderAnalytic
                title={SalesOrderStatus.PAID}
                total={getSalesOrderLength(SalesOrderStatus.PAID)}
                percent={getPercentByStatus(SalesOrderStatus.PAID)}
                price={getTotalAmount(SalesOrderStatus.PAID)}
                icon="solar:file-check-bold-duotone"
                color={theme.vars.palette.success.main}
              />

              <SalesOrderAnalytic
                title={SalesOrderStatus.PENDING}
                total={getSalesOrderLength(SalesOrderStatus.PENDING)}
                percent={getPercentByStatus(SalesOrderStatus.PENDING)}
                price={getTotalAmount(SalesOrderStatus.PENDING)}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.vars.palette.warning.main}
              />

              <SalesOrderAnalytic
                title={SalesOrderStatus.OVERDUE}
                total={getSalesOrderLength(SalesOrderStatus.OVERDUE)}
                percent={getPercentByStatus(SalesOrderStatus.OVERDUE)}
                price={getTotalAmount(SalesOrderStatus.OVERDUE)}
                icon="solar:bell-bing-bold-duotone"
                color={theme.vars.palette.error.main}
              />

              <SalesOrderAnalytic
                title={SalesOrderStatus.DRAFT}
                total={getSalesOrderLength(SalesOrderStatus.DRAFT)}
                percent={getPercentByStatus(SalesOrderStatus.DRAFT)}
                price={getTotalAmount(SalesOrderStatus.DRAFT)}
                icon="solar:file-corrupted-bold-duotone"
                color={theme.vars.palette.text.secondary}
              />
            </Stack>
          </Scrollbar>
        </Card>
        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme: any) =>
                `inset 0 -2px 0 0 ${varAlpha(
                  theme.vars.palette.grey["500Channel"],
                  0.08
                )}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === SalesOrderStatus.All ||
                        tab.value === filters.state.status) &&
                        "filled") ||
                      "soft"
                    }
                    color={
                      (tab.value === SalesOrderStatus.PAID && "success") ||
                      (tab.value === SalesOrderStatus.PENDING && "warning") ||
                      (tab.value === SalesOrderStatus.CANCELLED && "error") ||
                      "default"
                    }
                  >
                    {[
                      SalesOrderStatus.PAID,
                      SalesOrderStatus.PENDING,
                      SalesOrderStatus.CANCELLED,
                      SalesOrderStatus.OVERDUE,
                      SalesOrderStatus.DRAFT,
                    ].includes(tab.value)
                      ? tableData.filter(
                          (user) => user.orderStatus === tab.value
                        ).length
                      : tableData.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <OrderTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
          />

          {canReset && (
            <OrderTableFiltersResult
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
                  dataFiltered.map((row: SalesOrder) => row.orderID)
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

            <Scrollbar sx={{ minHeight: 444 }}>
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
                      dataFiltered.map((row: SalesOrder) => row.orderID)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: SalesOrder) => (
                      <OrderTableRow
                        key={row.orderID}
                        row={row}
                        selected={table.selected.includes(row.orderID)}
                        onSelectRow={() => table.onSelectRow(row.orderID)}
                        onViewRow={() => handleViewRow(row.orderID)}
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

function applyFilter({ inputData, comparator, filters, dateError }: any) {
  const { status, customerName, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el: any, index: number) => [el, index]);

  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el: any) => el[0]);

  if (customerName) {
    inputData = inputData.filter(
      (order: SalesOrder) =>
        order.customerName.toLowerCase().indexOf(customerName.toLowerCase()) !==
        -1
    );
  }

  if (status !== "all") {
    inputData = inputData.filter(
      (order: SalesOrder) => order.orderStatus === status
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order: SalesOrder) =>
        fIsBetween(order.orderDate, startDate, endDate)
      );
    }
  }

  return inputData;
}
