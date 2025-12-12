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
import { useAiRules } from "@/hooks/apis/use-ai-rules";

import { AiRule } from "../types";

// ----------------------------------------------------------------------

interface AiRuleActionMenuProps {
  rule: AiRule;
  onEdit: () => void;
  onDelete: () => void;
}

function AiRuleActionMenu({ onEdit, onDelete }: AiRuleActionMenuProps) {
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

const TABLE_HEAD: TableConfig<DataItem>[] = [
  { key: "id", label: "ID", align: "left", width: 100 },
  {
    key: "content",
    label: "Nội dung",
    align: "left",
    render: (item: DataItem) => (
      <Box
        sx={{
          cursor: "pointer",
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
    key: "actions",
    label: "Hành động",
    align: "center",
    width: 120,
    sticky: "right",
    render: (item: DataItem) => (
      <AiRuleActionMenu
        rule={item as AiRule}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    ),
  },
];

// ----------------------------------------------------------------------

export function AiRulesListView() {
  const router = useRouter();
  const confirm = useBoolean();
  const contentDialog = useBoolean();

  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [page, setPage] = useState<number>(0); // 0-based for MUI pagination
  const [pageSize, setPageSize] = useState<number>(20); // Default to 20 items per page

  // Use the custom hook for AI rules management
  const { rules, totalCount, loading, deleteRule } = useAiRules({
    page: page + 1, // Convert to 1-based for API
    pageSize,
    autoFetch: true,
  });

  const handleDeleteConfirm = useCallback(async () => {
    if (selectedRuleId) {
      try {
        await deleteRule(selectedRuleId);
      } catch {
        // Error handling is already done in the hook
      } finally {
        setSelectedRuleId(null);
        confirm.onFalse();
      }
    }
  }, [selectedRuleId, confirm, deleteRule]);

  const handleDeleteClick = useCallback(
    (ruleId: string) => {
      setSelectedRuleId(ruleId);
      confirm.onTrue();
    },
    [confirm]
  );

  const handleContentClick = useCallback(
    (content: string) => {
      setSelectedContent(content);
      contentDialog.onTrue();
    },
    [contentDialog]
  );

  // Handle page change
  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    []
  );

  // Handle rows per page change
  const handleChangePageSize = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPageSize(parseInt(event.target.value, 10));
      setPage(0); // Reset to first page when changing page size
    },
    []
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
            <Typography variant="h4">Quy tắc AI</Typography>

            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => router.push(paths.dashboard.aiRules.new)}
            >
              Thêm quy tắc mới
            </Button>
          </Stack>

          <Card>
            <Box sx={{ position: "relative" }}>
              <Scrollbar sx={{ minHeight: 444 }}>
                <CustomTable
                  data={rules}
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
                            <AiRuleActionMenu
                              rule={item as AiRule}
                              onEdit={() =>
                                router.push(
                                  paths.dashboard.aiRules.edit(
                                    item.id as string
                                  )
                                )
                              }
                              onDelete={() =>
                                handleDeleteClick(item.id as string)
                              }
                            />
                          )
                        : undefined,
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
        title="Xóa quy tắc"
        content="Bạn có chắc chắn muốn xóa quy tắc này không?"
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
        <DialogTitle>Nội dung quy tắc</DialogTitle>
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
