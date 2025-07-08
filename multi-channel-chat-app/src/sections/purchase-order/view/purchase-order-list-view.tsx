/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback } from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import TableBody from "@mui/material/TableBody";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

import { RouterLink } from "@/routes/components";

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
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from "@/components/table";

import { useRouter } from "next/navigation";
import { fIsAfter, fIsBetween } from "@/utils/format-time";
import { paths } from "@/routes/path";
import { sumBy } from "@/utils/helper";
import {
  deleteBulkPurchaseOrderAsync,
  useGetPurchaseOrders,
} from "@/actions/purchase-order";
import {
  PurchaseOrder,
  PurchaseOrderStatus,
} from "@/models/purchase-order/purchase-order";
import { PurchaseOrderAnalytic } from "../purchase-order-analytic";
import { PurchaseOrderTableToolbar } from "../purchase-order-table-toolbar";
import { PurchaseOrderTableFiltersResult } from "../purchase-order-table-filters-result";
import { PurchaseOrderTableRow } from "../purchase-order-table-row";
import { mutate } from "swr";
import { endpoints } from "@/utils/axios";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "supplierName", label: "Supplier" },
  { id: "notes", label: "Notes" },
  { id: "purchaseOrderDate", label: "Order Date" },
  { id: "totalAmount", label: "Amount" },
  { id: "orderStatus", label: "Status" },
  { id: "" },
];

export type FilterPurchaseOrderState = {
  supplierName: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};
// ----------------------------------------------------------------------

export function PurchaseOrderListView() {
  const theme = useTheme() as any;

  const router = useRouter();

  const table = useTable({ defaultOrderBy: "createdAt" });

  const confirm = useBoolean();
  const { purchaseOrders: tableData } = useGetPurchaseOrders();

  const filters = useSetState<FilterPurchaseOrderState>({
    supplierName: "",
    status: "all",
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
    !!filters.state.supplierName ||
    filters.state.status !== "all" ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getPurchaseOrderLength = (status: string) =>
    tableData.filter((item) => item.orderStatus === status).length;

  const getTotalAmount = (status: string) =>
    sumBy(
      tableData.filter((item) => item.orderStatus === status),
      (po: PurchaseOrder) => po.totalAmount
    );

  const getPercentByStatus = (status: string) =>
    (getPurchaseOrderLength(status) / tableData.length) * 100;

  const TABS = [
    {
      value: "all",
      label: "All",
      color: "default",
      count: tableData.length,
    },
    {
      value: PurchaseOrderStatus.PAID,
      label: "Paid",
      color: "success",
      count: getPurchaseOrderLength(PurchaseOrderStatus.PAID),
    },
    {
      value: PurchaseOrderStatus.PENDING,
      label: "Pending",
      color: "warning",
      count: getPurchaseOrderLength(PurchaseOrderStatus.PENDING),
    },
    {
      value: PurchaseOrderStatus.OVERDUE,
      label: "Overdue",
      color: "error",
      count: getPurchaseOrderLength(PurchaseOrderStatus.OVERDUE),
    },
    {
      value: PurchaseOrderStatus.DRAFT,
      label: "Draft",
      color: "default",
      count: getPurchaseOrderLength(PurchaseOrderStatus.DRAFT),
    },
  ];

  const handleDeleteRows = useCallback(async () => {
    try {
      await deleteBulkPurchaseOrderAsync(table.selected);
      toast.success("Delete success!");
      table.setSelected([]);

      mutate(endpoints.purchaseOrders.list);
    } catch (error: any) {
      toast.error(error.errorMessage || "Delete error!");
      console.log(error);
    }
  }, [table]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.purchaseOrder.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.purchaseOrder.details(id));
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

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "PurchaseOrder", href: paths.dashboard.purchaseOrder.root },
            { name: "List" },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.purchaseOrder.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New purchase order
            </Button>
          }
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
              <PurchaseOrderAnalytic
                title="Total"
                total={tableData.length}
                percent={100}
                price={sumBy(
                  tableData,
                  (purchaseorder: PurchaseOrder) => purchaseorder.totalAmount
                )}
                icon="solar:bill-list-bold-duotone"
                color={theme.vars.palette.info.main}
              />

              <PurchaseOrderAnalytic
                title={PurchaseOrderStatus.PAID}
                total={getPurchaseOrderLength(PurchaseOrderStatus.PAID)}
                percent={getPercentByStatus(PurchaseOrderStatus.PAID)}
                price={getTotalAmount(PurchaseOrderStatus.PAID)}
                icon="solar:file-check-bold-duotone"
                color={theme.vars.palette.success.main}
              />

              <PurchaseOrderAnalytic
                title={PurchaseOrderStatus.PENDING}
                total={getPurchaseOrderLength(PurchaseOrderStatus.PENDING)}
                percent={getPercentByStatus(PurchaseOrderStatus.PENDING)}
                price={getTotalAmount(PurchaseOrderStatus.PENDING)}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.vars.palette.warning.main}
              />

              <PurchaseOrderAnalytic
                title={PurchaseOrderStatus.OVERDUE}
                total={getPurchaseOrderLength(PurchaseOrderStatus.OVERDUE)}
                percent={getPercentByStatus(PurchaseOrderStatus.OVERDUE)}
                price={getTotalAmount(PurchaseOrderStatus.OVERDUE)}
                icon="solar:bell-bing-bold-duotone"
                color={theme.vars.palette.error.main}
              />

              <PurchaseOrderAnalytic
                title={PurchaseOrderStatus.DRAFT}
                total={getPurchaseOrderLength(PurchaseOrderStatus.DRAFT)}
                percent={getPercentByStatus(PurchaseOrderStatus.DRAFT)}
                price={getTotalAmount(PurchaseOrderStatus.DRAFT)}
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
              boxShadow: `inset 0 -2px 0 0 ${varAlpha(
                theme.vars.palette.grey["500Channel"],
                0.08
              )}`,
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === "all" ||
                        tab.value === filters.state.status) &&
                        "filled") ||
                      "soft"
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <PurchaseOrderTableToolbar
            filters={filters}
            dateError={dateError}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <PurchaseOrderTableFiltersResult
              filters={filters}
              onResetPage={table.onResetPage}
              totalResults={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: "relative" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked: boolean) => {
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row: PurchaseOrder) => row.purchaseOrderID)
                );
              }}
              action={
                <Stack direction="row">
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="iconamoon:send-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            <Scrollbar sx={{ minHeight: 444 }}>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 800 }}
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
                      dataFiltered.map(
                        (row: PurchaseOrder) => row.purchaseOrderID
                      )
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: PurchaseOrder) => (
                      <PurchaseOrderTableRow
                        key={row.purchaseOrderID}
                        row={row}
                        selected={table.selected.includes(row.purchaseOrderID)}
                        onSelectRow={() =>
                          table.onSelectRow(row.purchaseOrderID)
                        }
                        onViewRow={() => handleViewRow(row.purchaseOrderID)}
                        onEditRow={() => handleEditRow(row.purchaseOrderID)}
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

function applyFilter({ inputData, comparator, filters, dateError }: any) {
  console.log(filters);

  const { supplierName, status, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el: any, index: number) => [el, index]);

  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el: any) => el[0]);

  if (supplierName) {
    inputData = inputData.filter(
      (purchaseorder: PurchaseOrder) =>
        purchaseorder.supplierName
          .toLowerCase()
          .indexOf(supplierName.toLowerCase()) !== -1 ||
        purchaseorder.invoiceID
          .toLowerCase()
          .indexOf(supplierName.toLowerCase()) !== -1 ||
        purchaseorder.notes
          .toLowerCase()
          .indexOf(supplierName.toLowerCase()) !== -1
    );
  }

  if (status !== "all") {
    inputData = inputData.filter(
      (purchaseorder: PurchaseOrder) => purchaseorder.orderStatus === status
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((purchaseorder: PurchaseOrder) =>
        fIsBetween(purchaseorder.purchaseOrderDate, startDate, endDate)
      );
    }
  }

  return inputData;
}
