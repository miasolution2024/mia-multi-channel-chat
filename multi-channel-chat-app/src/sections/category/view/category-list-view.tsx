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
import { deleteBulkCategoryAsync, useGetCategories  } from "@/actions/category";
import { CategoryTableToolbar } from "../category-table-toolbar";
import { Category } from "@/models/category/category";
import { CategoryTableRow } from "../category-table-row";
import { CategoryForm } from "../category-form";
import { endpoints } from "@/utils/axios";
import { mutate } from "swr";
import { CategoryTableFiltersResult } from "../category-table-filters-result";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "categoryName", label: "Category Name" },
  { id: "description", label: "Description" , width: 180},
  { id: "", width: 88 },
];

type SelectedCategoryState = {
  openDialog: boolean;
  currentCategory: Category | null;
};

export type FilterCategoryState = {
  categoryName: string;
};

// ----------------------------------------------------------------------

export function CategoryListView() {
  const table = useTable();

  const confirm = useBoolean();

  const selectedCategory = useSetState<SelectedCategoryState>({
    currentCategory: null,
    openDialog: false,
  });

  const { categories: tableData } = useGetCategories();

  const filters = useSetState<FilterCategoryState>({ categoryName: "" });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const canReset = !!filters.state.categoryName;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRows = useCallback(async () => {
    try {
      await deleteBulkCategoryAsync(table.selected);
      toast.success("Delete success!");
      table.setSelected([]);

      mutate(endpoints.categories.list);
    } catch (error: any) {
      toast.error(error.errorMessage || "Delete error!");
      console.log(error);
    }
  }, [table]);

  const handleEditRow = useCallback(
    (id: string) => {
      const category = tableData.find((item: Category) => item.categoryID === id);
      selectedCategory.setState({
        openDialog: true,
        currentCategory: category,
      });
    },
    [selectedCategory, tableData]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Category", href: paths.dashboard.category.root },
            { name: "List" },
          ]}
          action={
            <Button
              onClick={() =>
                selectedCategory.setState({
                  openDialog: true,
                  currentCategory: null,
                })
              }
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New category
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <CategoryTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <CategoryTableFiltersResult
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
                  dataFiltered.map((row: Category) => row.categoryID)
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
                      dataFiltered.map((row: Category) => row.categoryID)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: Category) => (
                      <CategoryTableRow
                        key={row.categoryID}
                        row={row}
                        selected={table.selected.includes(row.categoryID)}
                        onSelectRow={() => table.onSelectRow(row.categoryID)}
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

      <CategoryForm
        currentCategory={selectedCategory.state.currentCategory}
        open={selectedCategory.state.openDialog}
        onClose={() => selectedCategory.setState({ openDialog: false })}
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
  inputData: Category[];
  comparator: (a: any, b: any) => number;
  filters: FilterCategoryState;
}) {
  const { categoryName } = filters;

  const stabilizedThis = inputData.map((el: Category, index: number) => [el, index]);

  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el: any) => el[0]);

  if (categoryName) {
    inputData = inputData.filter(
      (category: Category) =>
        category.categoryName
          .toLowerCase()
          .indexOf(categoryName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
