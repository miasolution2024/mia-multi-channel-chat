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
import { Product } from "@/models/product/product";
import { endpoints } from "@/utils/axios";
import { mutate } from "swr";
import { deleteBulkProductAsync, useGetProducts } from "@/actions/product";
import { ProductTableToolbar } from "../product-table-toolbar";
import { ProductTableFiltersResult } from "../product-table-filters-result";
import { ProductTableRow } from "../product-table-row";
import { RouterLink } from "@/routes/components";
import { useRouter } from "next/navigation";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "productName", label: "Name" },
  { id: "description", label: "Description" },
  { id: "stockQuantity", label: "Stock Quantity" },
  { id: "purchasePrice", label: "Purchase Price"},
  { id: "salePrice", label: "Sale Price" },
  { id: "unit", label: "Unit" },
  { id: "", width: 88 },
];

// ----------------------------------------------------------------------

export function ProductListView() {
  const table = useTable();

  const confirm = useBoolean();

  const { products: tableData } = useGetProducts();

  const filters = useSetState({ productName: "", role: [] });

  const router = useRouter();

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const canReset =
    !!filters.state.productName || filters.state.role.length > 0;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRows = useCallback(async () => {
    try {
      await deleteBulkProductAsync(table.selected);
      toast.success("Delete success!");
      table.setSelected([]);

      mutate(endpoints.products.list);

    } catch (error: any) {
      toast.error(error.errorMessage || "Delete error!");
      console.log(error);
    }
  }, [table]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );
  
  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Product", href: paths.dashboard.product.root },
            { name: "List" },
          ]}
          action={
            <Button
            component={RouterLink}
            href={paths.dashboard.product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New product
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <ProductTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <ProductTableFiltersResult
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
                  dataFiltered.map((row: Product) => row.productID)
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
                      dataFiltered.map((row: Product) => row.productID)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: Product) => (
                      <ProductTableRow
                        key={row.productID}
                        row={row}
                        selected={table.selected.includes(row.productID)}
                        onSelectRow={() => table.onSelectRow(row.productID)}
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

function applyFilter({ inputData, comparator, filters }: any) {
  const { productName, role } = filters;

  const stabilizedThis = inputData.map((el: any, index: any) => [el, index]);

  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el: any) => el[0]);

  if (productName) {
    inputData = inputData.filter(
      (product: Product) =>
        product.productName
          .toLowerCase()
          .indexOf(productName.toLowerCase()) !== -1
    );
  }

  if (role.length) {
    inputData = inputData.filter((product: any) =>
      role.includes(product.role)
    );
  }

  return inputData;
}
