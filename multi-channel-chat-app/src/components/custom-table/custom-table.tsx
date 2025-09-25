/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Checkbox,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Scrollbar } from "../scrollbar";

// ----------------------------------------------------------------------

export interface TableConfig<T = Record<string, unknown>> {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (item: T, index: number) => React.ReactNode;
  sticky?: "left" | "right";
  width?: number;
}

export interface DataItem {
  id?: string | number;
  [key: string]: unknown;
}

export interface CustomTableProps<T = DataItem> {
  data?: T[];
  tableConfig?: TableConfig<T>[];
  count?: number;
  page?: number;
  pageSize?: number;
  onChangePage?: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  onChangePageSize?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  firstLoading?: boolean;
  loading?: boolean;
  updateList?: (string | number)[];
  checkKey?: string;
  errorMsg?: string;
  onSelect?: (selected: (string | number)[]) => void;
  moreOptions?: (item: T) => React.ReactNode;
  csvConfig?: Record<string, unknown>[];
  csvNameFile?: string;
  csvData?: T[];
  csvOnClick?: () => void;
  csvFetchingData?: boolean;
  defaultSelected?: (string | number)[];
  groupBy?: string;
  groupByLabel?: string;
  optionHandleStatus?: (status: string) => void;
  canSelectRow?: (item: T) => boolean;
}

export default function CustomTable({
  data = [],
  tableConfig = [],
  count,
  page,
  pageSize,
  onChangePage,
  onChangePageSize,
  firstLoading,
  loading,
  updateList = [],
  checkKey,
  errorMsg,
  onSelect,
  moreOptions,
  defaultSelected = [],
  canSelectRow,
}: Omit<
  CustomTableProps,
  "csvConfig" | "csvNameFile" | "csvData" | "csvOnClick" | "csvFetchingData"
>) {
  const PAGE_SIZE = [5, 10, 20, 25, 50];
  const [selected, setSelected] =
    useState<(string | number)[]>(defaultSelected);
  const isNotFound =
    data.length === 0 && !loading && !errorMsg && !firstLoading;

  // Calculate selectable items
  const selectableItems = data.filter((item) => !canSelectRow || canSelectRow(item));
  const selectableCount = selectableItems.length;

  // Calculate right positions for sticky columns
  const calculateStickyRightPositions = () => {
    const positions: Record<number, number> = {};
    let currentRight = 0;
    
    // Action column (moreOptions) is always at right: 0
    if (moreOptions) {
      currentRight = 30; // Approximate width of action column
    }
    
    // Calculate positions for right-sticky columns from right to left
    const rightStickyColumns = tableConfig
      .map((col, index) => ({ ...col, originalIndex: index }))
      .filter(col => col.sticky === "right")
      .reverse(); // Process from rightmost to leftmost
    
    rightStickyColumns.forEach((col) => {
      positions[col.originalIndex] = currentRight;
      currentRight += col.width || 150; // Default width if not specified
    });
    
    return positions;
  };

  const stickyRightPositions = calculateStickyRightPositions();

  const handleSelectAllClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    if (event.target.checked) {
      const newSelecteds = data
        .filter((item) => !canSelectRow || canSelectRow(item))
        .map((n) => n[key] as string | number);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    item: string | number
  ) => {
    const selectedIndex = selected.indexOf(item);
    let newSelected: (string | number)[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, item);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  useEffect(() => {
    if (onSelect) onSelect(selected);
  }, [selected]);

  return (
    <>
      <TableContainer sx={{ 
        position: "relative",
        minHeight: (firstLoading || loading) && data.length === 0 ? 300 : 'auto'
      }}>
        <Scrollbar>
          <Table size="small">
            <TableHead>
              <TableRow>
                {Boolean(onSelect) && (
                  <TableCell padding="checkbox" align="left">
                    {loading || isNotFound || errorMsg ? (
                      <CheckboxEmpty />
                    ) : (
                      <Checkbox
                        size="small"
                        indeterminate={
                          selected.length > 0 && selected.length < selectableCount
                        }
                        checked={
                          selectableCount > 0 && selected.length === selectableCount
                        }
                        onChange={(e) => {
                          handleSelectAllClick(e, checkKey || "id");
                        }}
                      />
                    )}
                  </TableCell>
                )}

                {tableConfig.map((item, index) => (
                  <TableCell
                    key={index}
                    align={item.align}
                    sx={{ 
                      whiteSpace: "nowrap",
                      ...(item.width && {
                        width: item.width,
                        minWidth: item.width,
                        maxWidth: item.width,
                      }),
                      ...(item.sticky && {
                        position: "sticky",
                        [item.sticky]: item.sticky === "right" ? stickyRightPositions[index] : 0,
                        zIndex: 1,
                      })
                    }}
                  >
                    {item.label}
                  </TableCell>
                ))}
                {moreOptions && (
                  <TableCell 
                    align="right" 
                    sx={{ 
                      whiteSpace: "nowrap",
                      position: "sticky",
                      right: 0,
                      zIndex: 1,
                    }}
                  >
                    {/* CSV Export functionality would go here */}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Show skeleton rows when loading and no data */}
              {(firstLoading || (loading && data.length === 0)) && 
                Array.from({ length: pageSize || 10 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`} hover>
                    {Boolean(onSelect) && (
                      <TableCell padding="checkbox" align="left">
                        <CheckboxEmpty />
                      </TableCell>
                    )}
                    {tableConfig.map((x, i) => (
                      <TableCell
                        key={i}
                        align={x.align}
                        sx={{ 
                          whiteSpace: "nowrap",
                          ...(x.width && {
                            width: x.width,
                            minWidth: x.width,
                            maxWidth: x.width,
                          }),
                          ...(x.sticky && {
                            position: "sticky",
                            [x.sticky]: x.sticky === "right" ? stickyRightPositions[i] : 0,
                            backgroundColor: "background.paper",
                            zIndex: 1,
                          })
                        }}
                      >
                        <Skeleton width="80%" />
                      </TableCell>
                    ))}
                    {moreOptions && (
                      <TableCell 
                        align="right" 
                        sx={{ 
                          whiteSpace: "nowrap",
                          position: "sticky",
                          right: 0,
                          backgroundColor: "background.paper",
                          zIndex: 1,
                        }}
                      >
                        <MoreOptionsEmpty />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              }
              
              {/* Show actual data when not in initial loading state */}
              {!firstLoading && !(loading && data.length === 0) && !isNotFound &&
                data.map((item, index) => {
                  const selectedUser =
                    selected.indexOf(
                      checkKey
                        ? (item[checkKey] as string | number)
                        : (item.id as string | number)
                    ) !== -1;
                  return (
                    <TableRow key={index} hover>
                      {Boolean(onSelect) && (
                        <TableCell padding="checkbox" align="left">
                          {loading ||
                          (updateList?.length > 0 &&
                            updateList?.indexOf(
                              checkKey
                                ? (item[checkKey] as string | number)
                                : (item.id as string | number)
                            ) !== -1) ? (
                            <CheckboxEmpty />
                          ) : canSelectRow && !canSelectRow(item) ? (
                            <div style={{ width: 38, height: 38 }} />
                          ) : (
                            <Checkbox
                              size="small"
                              checked={selectedUser}
                              onChange={(event) =>
                                handleClick(
                                  event,
                                  checkKey
                                    ? (item[checkKey] as string | number)
                                    : (item.id as string | number)
                                )
                              }
                            />
                          )}
                        </TableCell>
                      )}
                      {tableConfig.map((x, i) => (
                        <TableCell
                          key={i}
                          align={x.align}
                          sx={{ 
                            whiteSpace: "nowrap",
                            ...(x.width && {
                              width: x.width,
                              minWidth: x.width,
                              maxWidth: x.width,
                            }),
                            ...(x.sticky && {
                              position: "sticky",
                              [x.sticky]: x.sticky === "right" ? stickyRightPositions[i] : 0,
                              backgroundColor: "background.paper",
                              zIndex: 1,
                            })
                          }}
                        >
                          {loading ||
                          (updateList?.length > 0 &&
                            updateList?.indexOf(
                              checkKey
                                ? (item[checkKey] as string | number)
                                : (item.id as string | number)
                            ) !== -1) ? (
                            <Skeleton width="80%" />
                          ) : (
                            <>
                              {x.render ? x.render(item, index) : item[x.key]}
                            </>
                          )}
                        </TableCell>
                      ))}
                      {moreOptions && (
                        <TableCell 
                          align="right" 
                          sx={{ 
                            whiteSpace: "nowrap",
                            position: "sticky",
                            right: 0,
                            backgroundColor: "background.paper",
                            zIndex: 1,
                          }}
                        >
                          {loading ||
                          (updateList?.length > 0 &&
                            updateList?.indexOf(
                              checkKey
                                ? (item[checkKey] as string | number)
                                : (item.id as string | number)
                            ) !== -1) ? (
                            <MoreOptionsEmpty />
                          ) : (
                            moreOptions(item)
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Scrollbar>
        
        {/* Empty State Overlay */}
        {(firstLoading || isNotFound || errorMsg) && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "background.paper",
              zIndex: 2,
            }}
          >
            {firstLoading && <TableLoader />}
            {isNotFound && <RecordNotFound />}
            {errorMsg && <FetchFailed errorMsg={errorMsg} />}
          </Box>
        )}
      </TableContainer>
      {page !== undefined &&
        count !== undefined &&
        pageSize !== undefined &&
        onChangePage &&
        onChangePageSize && (
          <TablePagination
            rowsPerPageOptions={PAGE_SIZE}
            labelRowsPerPage={"Số dòng mỗi trang"}
            labelDisplayedRows={({ from, to, count }) => {
              return `${from}–${to} của ${
                count !== -1 ? count : `nhiều hơn ${to}`
              }`;
            }}
            component="div"
            count={count}
            rowsPerPage={pageSize}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangePageSize}
          />
        )}
    </>
  );
}

// ----------------------------------------------------------------------

const CheckboxEmpty = () => (
  <Stack alignItems="center" justifyContent="center" width={38} height={38}>
    <Skeleton
      sx={{ borderRadius: 0.4 }}
      variant="rectangular"
      width="1.2em"
      height="1.2em"
    />
  </Stack>
);

const MoreOptionsEmpty = () => (
  <Stack direction="row" alignItems="center">
    <Box flex={1} />
    <Skeleton
      sx={{ borderRadius: 0.4, marginRight: "8px" }}
      variant="rectangular"
      width="60%"
      height="1.2em"
    />
  </Stack>
);

const RecordNotFound = () => (
  <Stack 
    height={200} 
    justifyContent="center" 
    alignItems="center"
  >
    <Typography color="text.secondary" fontWeight={700} variant="body1">
      Không có dữ liệu
    </Typography>
  </Stack>
);

const FetchFailed = ({ errorMsg }: { errorMsg?: string }) => (
  <Stack 
    height={200} 
    justifyContent="center" 
    alignItems="center"
  >
    <Typography color="error.light" fontWeight={700} variant="body2">
      Something went wrong
    </Typography>
    {errorMsg && (
      <Typography color="error.light" variant="subtitle1">
        {errorMsg}
      </Typography>
    )}
  </Stack>
);

const TableLoader = () => (
  <Stack height={200} justifyContent="center" alignItems="center">
    <Typography variant="body2" color="text.secondary">
      Đang tải dữ liệu...
    </Typography>
  </Stack>
);
