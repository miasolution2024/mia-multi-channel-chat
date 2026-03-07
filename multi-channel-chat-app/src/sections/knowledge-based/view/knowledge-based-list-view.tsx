"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Card,
  Stack,
  Button,
  Container,
  Typography,
  IconButton,
  MenuList,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";

import { paths } from "@/routes/path";
import { DashboardContent } from "@/layouts/dashboard";
import { Iconify } from "@/components/iconify";
import { Scrollbar } from "@/components/scrollbar";
import { ConfirmDialog } from "@/components/custom-dialog";
import { useBoolean } from "@/hooks/use-boolean";
import { CustomTable } from "@/components/custom-table";
import type {
  TableConfig,
  DataItem,
} from "@/components/custom-table/custom-table";
import { usePopover, CustomPopover } from "@/components/custom-popover";
import { useKnowledgeBased } from "@/hooks/apis/use-knowledge-based";

import { KnowledgeBased } from "../types";

// ----------------------------------------------------------------------

interface KnowledgeBasedActionMenuProps {
  item: KnowledgeBased;
  onEdit: () => void;
  onDelete: () => void;
}

function KnowledgeBasedActionMenu({
  onEdit,
  onDelete,
}: KnowledgeBasedActionMenuProps) {
  const popover = usePopover();

  return (
    <>
      <IconButton onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: "right-top" } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onEdit();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Cập nhật
          </MenuItem>

          <MenuItem
            onClick={() => {
              onDelete();
              popover.onClose();
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Xóa
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PUBLISHED":
      return "success";
    case "DRAFT":
      return "warning";
    case "SUSPENDED":
      return "error";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "PUBLISHED":
      return "Đã đào tạo";
    case "DRAFT":
      return "Bản nháp";
    case "SUSPENDED":
      return "Ngưng đào tạo";
    default:
      return status;
  }
};

const TABLE_HEAD: TableConfig<DataItem>[] = [
  { key: "id", label: "ID", align: "left", width: 80 },
  {
    key: "content",
    label: "Nội dung",
    align: "left",
    width: 500,
    render: (item: DataItem) => (
      <Box
        sx={{
          cursor: "pointer",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          width: "100%",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        {item.content as string}
      </Box>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    align: "center",
    width: 140,
    render: (item: DataItem) => (
      <Chip
        label={getStatusLabel(item.status as string)}
        color={getStatusColor(item.status as string)}
        size="small"
      />
    ),
  },
  {
    key: "actions",
    label: "Hành động",
    align: "center",
    width: 120,
    sticky: "right",
    render: (item: DataItem) => (
      <KnowledgeBasedActionMenu
        item={item as KnowledgeBased}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    ),
  },
];

// ----------------------------------------------------------------------

export function KnowledgeBasedListView() {
  const router = useRouter();
  const confirm = useBoolean();
  const contentDialog = useBoolean();

  const [selectedItemId, setSelectedItemId] = useState<string | number | null>(
    null,
  );
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);

  const { items, totalCount, loading, deleteItem } = useKnowledgeBased({
    page: page + 1,
    pageSize,
    autoFetch: true,
  });

  const handleDeleteConfirm = useCallback(async () => {
    if (selectedItemId) {
      try {
        await deleteItem(selectedItemId);
      } catch {
        // Error handling is already done in the hook
      } finally {
        setSelectedItemId(null);
        confirm.onFalse();
      }
    }
  }, [selectedItemId, confirm, deleteItem]);

  const handleDeleteClick = useCallback(
    (itemId: string | number) => {
      setSelectedItemId(itemId);
      confirm.onTrue();
    },
    [confirm],
  );

  const handleContentClick = useCallback(
    (content: string) => {
      setSelectedContent(content);
      contentDialog.onTrue();
    },
    [contentDialog],
  );

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    [],
  );

  const handleChangePageSize = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPageSize(parseInt(event.target.value, 10));
      setPage(0);
    },
    [],
  );

  return (
    <>
      <DashboardContent>
        <Container maxWidth="xl">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: { xs: 3, md: 5 } }}
          >
            <Typography variant="h4">Kiến thức AI</Typography>

            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => router.push(paths.dashboard.knowledgeBased.new)}
            >
              Thêm kiến thức mới
            </Button>
          </Stack>

          <Card>
            <Box sx={{ position: "relative" }}>
              <Scrollbar sx={{ minHeight: 444 }}>
                <CustomTable
                  data={items}
                  tableConfig={TABLE_HEAD.map((col) => ({
                    ...col,
                    render:
                      col.key === "content"
                        ? (item: DataItem) => (
                            <Box
                              onClick={() =>
                                handleContentClick(item.content as string)
                              }
                              sx={{
                                cursor: "pointer",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                width: "100%",
                                "&:hover": {
                                  textDecoration: "underline",
                                },
                              }}
                            >
                              {item.content as string}
                            </Box>
                          )
                        : col.key === "actions"
                          ? (item: DataItem) => (
                              <KnowledgeBasedActionMenu
                                item={item as KnowledgeBased}
                                onEdit={() =>
                                  router.push(
                                    paths.dashboard.knowledgeBased.edit(
                                      item.id as number,
                                    ),
                                  )
                                }
                                onDelete={() =>
                                  handleDeleteClick(item.id as number)
                                }
                              />
                            )
                          : col.render,
                  }))}
                  loading={loading}
                  firstLoading={loading}
                  count={totalCount}
                  page={page}
                  pageSize={pageSize}
                  onChangePage={handleChangePage}
                  onChangePageSize={handleChangePageSize}
                />
              </Scrollbar>
            </Box>
          </Card>
        </Container>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa kiến thức"
        content="Bạn có chắc chắn muốn xóa kiến thức này không?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Xóa
          </Button>
        }
      />

      <Dialog
        open={contentDialog.value}
        onClose={contentDialog.onFalse}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Nội dung kiến thức</DialogTitle>
        <DialogContent>
          <Typography sx={{ whiteSpace: "pre-wrap", pt: 2 }}>
            {selectedContent}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={contentDialog.onFalse}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
