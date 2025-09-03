/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback } from "react";

import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
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
import { Avatar, Box, Card, MenuItem, MenuList } from "@mui/material";
import { Scrollbar } from "@/components/scrollbar";
import { endpoints } from "@/utils/axios";
import { mutate } from "swr";
import { OmniChannel } from "@/models/omni-channel/omni-channel";
import { useGetOmniChannels } from "@/actions/omni-channel";
import { OmniChannelsTableToolbar } from "../omni-channel-table-toolbar";
import { OmniChannelsTableFiltersResult } from "../omni-channel-table-filters-result";
import { OmniChannelsTableRow } from "../omni-channel-table-row";
import { CustomPopover, usePopover } from "@/components/custom-popover";
import { CHANNELS } from "@/sections/chat/chat-channels";
import { ZaloLoginQR } from "../omni-channel-zalo-qr";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: "id", label: "Id" },
  { id: "page_id", label: "Page Id" },
  { id: "page_name", label: "Page Name" },
  { id: "source", label: "Source" },
  { id: "is_enabled", label: "Is Enabled" },
  { id: "expired_date", label: "Expired Date" },
  // { id: "", width: 88 },
];

export type FilterOmniChannelsState = {
  omnichannelsName: string;
};

// ----------------------------------------------------------------------

export function OmniChannelsListView() {
  const table = useTable({ defaultOrderBy: "id", defaultRowsPerPage: 100 });

  const confirm = useBoolean();

  const openZaloLoginDialog = useBoolean();

  // const router = useRouter();

  const { omniChannels: tableData } = useGetOmniChannels();

  const filters = useSetState<FilterOmniChannelsState>({
    omnichannelsName: "",
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const canReset = !!filters.state.omnichannelsName;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRows = useCallback(async () => {
    try {
      // await deleteBulkOmniChannelsAsync(table.selected);
      toast.success("Delete success!");
      table.setSelected([]);

      mutate(endpoints.omniChannels.list);
    } catch (error: any) {
      toast.error(error.errorMessage || "Delete error!");
      console.log(error);
    }
  }, [table]);

  // const handleEditRow = useCallback(
  //   (id: string | number) => {
  //     router.push(paths.dashboard.omniChannels.edit(id));
  //   },
  //   [router]
  // );

  const popover = usePopover();

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Omni Channels", href: paths.dashboard.omniChannels.root },
            { name: "List" },
          ]}
          action={
            <Button
              onClick={popover.onOpen}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New channel
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <OmniChannelsTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
          />

          {canReset && (
            <OmniChannelsTableFiltersResult
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
                  dataFiltered.map((row: OmniChannel) => row.id)
                )
              }
              // action={
              //   <Tooltip title="Delete">
              //     <IconButton color="primary" onClick={confirm.onTrue}>
              //       <Iconify icon="solar:trash-bin-trash-bold" />
              //     </IconButton>
              //   </Tooltip>
              // }
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
                  onSort={table.onSort}
                  numSelected={table.selected.length}
                  onSelectAllRows={(checked: boolean) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row: OmniChannel) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row: OmniChannel) => (
                      <OmniChannelsTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
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
            Are you sure want to delete
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

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: "right-top" } }}
      >
        <MenuList>
          {CHANNELS.map((c, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                openZaloLoginDialog.onTrue();
                popover.onClose();
              }}
              sx={{ gap: 1 }}
            >
              <Avatar alt={c.name} src={c.src} sx={{ width: 20, height: 20 }} />
              {c.name}
            </MenuItem>
          ))}
        </MenuList>
      </CustomPopover>

      <ZaloLoginQR open={openZaloLoginDialog.value} onClose={openZaloLoginDialog.onFalse}></ZaloLoginQR>
    </>
  );
}

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: OmniChannel[];
  comparator: (a: any, b: any) => number;
  filters: FilterOmniChannelsState;
}) {
  const { omnichannelsName } = filters;

  const stabilizedThis = inputData.map((el: OmniChannel, index: number) => [
    el,
    index,
  ]);

  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el: any) => el[0]);

  if (omnichannelsName) {
    inputData = inputData.filter(
      (omnichannels: OmniChannel) =>
        omnichannels.page_name
          .toLowerCase()
          .indexOf(omnichannelsName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
