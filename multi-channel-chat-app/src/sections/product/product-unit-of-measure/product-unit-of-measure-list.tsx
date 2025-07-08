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
import { DashboardContent } from "@/layouts/dashboard";
import { Iconify } from "@/components/iconify";
import { toast } from "@/components/snackbar";
import { ConfirmDialog } from "@/components/custom-dialog";
import { Box, Card } from "@mui/material";
import { Scrollbar } from "@/components/scrollbar";
import { endpoints } from "@/utils/axios";
import { mutate } from "swr";
import { ProductUnitOfMeasure } from "@/models/product/product-unit-of-measure";
import {
  deleteBulkProductUnitOfMeasureAsync,
  useGetProductUnitOfMeasures,
} from "@/actions/product-unit-of-measure";
import { ProductUnitOfMeasureTableRow } from "./product-unit-of-measure-table-row";
import { ProductUnitOfMeasureForm } from "./product-unit-of-measure-form";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "unit", label: "Unit" },
  { id: "conversionFactor", label: "Conversion Factor" },
  { id: "purchasePrice", label: "Purchase Price" },
  { id: "salePrice", label: "Sale Price" },
  { id: "barcode", label: "Bar Code" },
  { id: "isBaseUnit", label: "Is Base Unit" },
  { id: "", width: 88 },
];

type SelectedProductUnitOfMeasureState = {
  openDialog: boolean;
  currentProductUnitOfMeasure: ProductUnitOfMeasure | null;
};

export type FilterProductUnitOfMeasureState = {
  productunitofmeasureName: string;
};

// ----------------------------------------------------------------------

export function ProductUnitOfMeasureListView({
  productId,
}: {
  productId: string;
}) {
  const table = useTable();

  const confirm = useBoolean();

  const selectedProductUnitOfMeasure =
    useSetState<SelectedProductUnitOfMeasureState>({
      currentProductUnitOfMeasure: null,
      openDialog: false,
    });

  const { productUnitOfMeasures: tableData } =
    useGetProductUnitOfMeasures(productId);

  const filters = useSetState<FilterProductUnitOfMeasureState>({
    productunitofmeasureName: "",
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });


  const canReset = !!filters.state.productunitofmeasureName;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRows = useCallback(async () => {
    try {
      await deleteBulkProductUnitOfMeasureAsync(table.selected);
      toast.success("Delete success!");
      table.setSelected([]);

      mutate(
        (key) =>
          typeof key === "string" &&
          key.startsWith(endpoints.productUnitOfMeasure.list)
      );
    } catch (error: any) {
      toast.error(error.errorMessage || "Delete error!");
      console.log(error);
    }
  }, [table]);

  const handleEditRow = useCallback(
    (id: string) => {
      const productunitofmeasure = tableData.find(
        (item: ProductUnitOfMeasure) => item.productUnitOfMeasureID === id
      );
      selectedProductUnitOfMeasure.setState({
        openDialog: true,
        currentProductUnitOfMeasure: productunitofmeasure,
      });
    },
    [selectedProductUnitOfMeasure, tableData]
  );

  return (
    <>
      <DashboardContent>
        <Card>
          <Box
            mx={2}
            my={2}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Button
              onClick={() =>
                selectedProductUnitOfMeasure.setState({
                  currentProductUnitOfMeasure: null,
                  openDialog: true,
                })
              }
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Unit Of Measure
            </Button>
          </Box>
          <Box sx={{ position: "relative" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked: boolean) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map(
                    (row: ProductUnitOfMeasure) => row.productUnitOfMeasureID
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
                  onSelectAllRows={(checked: boolean) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map(
                        (row: ProductUnitOfMeasure) =>
                          row.productUnitOfMeasureID
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
                    .map((row: ProductUnitOfMeasure) => (
                      <ProductUnitOfMeasureTableRow
                        key={row.productUnitOfMeasureID}
                        row={row}
                        selected={table.selected.includes(
                          row.productUnitOfMeasureID
                        )}
                        onSelectRow={() =>
                          table.onSelectRow(row.productUnitOfMeasureID)
                        }
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

      <ProductUnitOfMeasureForm
        productId={productId}
        currentProductUnitOfMeasure={
          selectedProductUnitOfMeasure.state.currentProductUnitOfMeasure
        }
        open={selectedProductUnitOfMeasure.state.openDialog}
        onClose={() =>
          selectedProductUnitOfMeasure.setState({ openDialog: false })
        }
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
}: {
  inputData: ProductUnitOfMeasure[];
  comparator: (a: any, b: any) => number;
  filters: FilterProductUnitOfMeasureState;
}) {
  const stabilizedThis = inputData.map(
    (el: ProductUnitOfMeasure, index: number) => [el, index]
  );

  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el: any) => el[0]);

  return inputData;
}
