"use client";

import { useState, useCallback } from "react";
import {
  Button,
  Card,
  Container,
  TextField,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  IconButton,
  Popover,
  MenuList,
  MenuItem,
  Tooltip,
} from "@mui/material";

import { useDebounce } from "@/hooks/use-debounce";
import { useBoolean } from "@/hooks/use-boolean";
import { usePopover } from "@/components/custom-popover";

import { DashboardContent } from "@/layouts/dashboard";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { Iconify } from "@/components/iconify";
import { toast } from "@/components/snackbar";
import { ConfirmDialog } from "@/components/custom-dialog";
import { LoadingOverlay } from "@/components/loading-overlay";
import { CustomTable } from "@/components/custom-table";
import type {
  TableConfig,
  DataItem,
} from "@/components/custom-table/custom-table";

import { useGetOmniChannels } from "@/hooks/apis/use-get-omni-channels";
import { deleteOmniChannel } from "@/actions/omni-channels";
import { paths } from "@/routes/path";
import { useRouter } from "next/navigation";
import { fDate } from "@/utils/format-time";
import { OmniChannel } from "../types";
import { SwitchOmniChannelStatus } from "./components/switch-omni-channel-status";
import { SwitchOmniChannelReplyComment } from "./components/switch-omni-channel-reply-comment";
import { CopyToClipboard } from "@/components/copy-to-clipboard";

// ----------------------------------------------------------------------

interface OmniChannelActionMenuProps {
  omniChannel: OmniChannel;   
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

function OmniChannelActionMenu({
  omniChannel,
  onEdit,
  onDelete,
}: OmniChannelActionMenuProps) {
  const popover = usePopover();

  return (
    <>
      <IconButton onClick={popover.onOpen}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
      <Popover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onEdit(omniChannel.id || "");
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Chỉnh sửa
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDelete(omniChannel.id || "");
              popover.onClose();
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Xóa
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

export function OmniChannelListView() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [name, setName] = useState("");

  const debouncedName = useDebounce(name, 500);

  const confirm = useBoolean();
  const deleteLoading = useBoolean();

  // State for popup
  const [popupState, setPopupState] = useState<{
    open: boolean;
    title: string;
    items: { label: string; color: string }[];
  }>({
    open: false,
    title: "",
    items: [],
  });

  const { data, total, isLoading, refetch } = useGetOmniChannels({
    page,
    limit: pageSize,
    pageName: debouncedName,
  });

  const TABLE_CONFIG: TableConfig<DataItem>[] = [
    {
      key: "id",
      label: "ID",
      width: 80,
      render: (row: DataItem) => row.id,
    },
    {
      key: "page_name",
      label: "Tên trang",
      width: 200,
      render: (row: DataItem) => {
        const omniChannel = row as OmniChannel;
        return (
          <Tooltip title={omniChannel.page_name} placement="top">
            <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
              {omniChannel.page_name}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      key: "page_id",
      label: "Mã trang",
      width: 200,
      render: (row: DataItem) => {
        const omniChannel = row as OmniChannel;
        if(!omniChannel?.page_id) {
          return null;
        }
        return (
          <CopyToClipboard value={omniChannel?.page_id || ''}>
            <Typography
            variant="body2"
            sx={{
              maxWidth: 180,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {omniChannel.page_id}
          </Typography>
          </CopyToClipboard>
        );
      },
    },
    {
      key: "source",
      label: "Nguồn",
      width: 120,
      render: (row: DataItem) => {
        const omniChannel = row as OmniChannel;
        return <Typography variant="body2">{omniChannel.source}</Typography>;
      },
    },
    {
      key: "token",
      label: "Mã xác thực",
      width: 200,
      render: (row: DataItem) => {
        const omniChannel = row as OmniChannel;
        if(!omniChannel?.token) {
          return null;
        }
        return (
          <CopyToClipboard value={omniChannel?.token || ''}>
            <Typography
            variant="body2"
            sx={{
              maxWidth: 180,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {omniChannel.token}
          </Typography>
          </CopyToClipboard>
        );
      },
    },
    {
      key: "phone_number",
      label: "Số điện thoại",
      width: 120,
      render: (row: DataItem) => {
        const omniChannel = row as OmniChannel;
        return <Typography variant="body2">{omniChannel.phone_number}</Typography>;
      },
    },
    {
      key: "date_created",
      label: "Ngày tạo",
      width: 180,
      render: (row: DataItem) => {
        const omniChannel = row as unknown as OmniChannel;
        return (
          <Typography variant="body2">
            {fDate(omniChannel.date_created, "HH:mm DD/MM/YYYY")}
          </Typography>
        );
      },
    },
    {
      key: "is_enabled",
      label: "Trạng thái",
      width: 120,
      render: (row: DataItem) => {
        const omniChannel = row as unknown as OmniChannel;
        return <SwitchOmniChannelStatus item={omniChannel} />;
      },
    },
    {
      key: "is_enabled_reply_comment",
      label: "Tự động trả lời bình luận",
      width: 200,
      render: (row: DataItem) => {
        const omniChannel = row as OmniChannel;
        return <SwitchOmniChannelReplyComment item={omniChannel} />;
      },
    },
    {
      key: "actions",
      label: "",
      align: "center",
      sticky: "right",
      width: 80,
      render: (row: DataItem) => {
        const omniChannel = row as OmniChannel;
        return (
          <OmniChannelActionMenu
            omniChannel={omniChannel}
            onEdit={() => handleEditRow(omniChannel.id?.toString() || "")}
            onDelete={() => handleDeleteRow(omniChannel.id?.toString() || "")}
          />
        );
      },
    },
  ];

  const handleDeleteRow = useCallback(
    (id: string) => {
      setSelected([id]);
      confirm.onTrue();
    },
    [confirm]
  );

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.omniChannel.edit(id));
    },
    [router]
  );

  const handleConfirmDelete = useCallback(async () => {
    try {
      deleteLoading.onTrue();

      if (selected.length === 1) {
        await deleteOmniChannel(selected[0]);
        toast.success("Xóa trang thành công!");
      }

      setSelected([]);
      await refetch();
    } catch (error) {
      console.error("Error deleting omni channel(s):", error);
      toast.error("Có lỗi xảy ra khi xóa trang!");
    } finally {
      deleteLoading.onFalse();
      confirm.onFalse();
    }
  }, [selected, refetch, deleteLoading, confirm]);

  return (
    <>
      <DashboardContent>
        <Container maxWidth="xl">
          <CustomBreadcrumbs
            heading="Danh sách trang"
            links={[
              { name: "Dashboard", href: paths.dashboard.root },
              { name: "Trang" },
            ]}
            action={
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => router.push(paths.dashboard.omniChannel.new)}
              >
                Thêm trang  
              </Button>
            }
            sx={{ mb: { xs: 3, md: 5 } }}
          />

          <Card>
            <div style={{ padding: "20px" }}>
              <TextField
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tìm kiếm theo tên trang..."
                InputProps={{
                  startAdornment: (
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: "text.disabled" }}
                    />
                  ),
                }}
                sx={{ maxWidth: { md: 350 } }}
                size="small"
              />
            </div>

            <CustomTable
              data={data as DataItem[]}
              tableConfig={TABLE_CONFIG}
              loading={isLoading}
              count={total}
              page={page}
              pageSize={pageSize}
              onChangePage={(_, newPage) => setPage(newPage)}
              onChangePageSize={(event) => {
                setPageSize(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </Card>
        </Container>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xác nhận xóa"
        content={
          selected.length === 1
            ? "Bạn có chắc chắn muốn xóa trang này?"
            : `Bạn có chắc chắn muốn xóa ${selected.length} trang đã chọn?`
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleteLoading.value}
          >
            Xóa
          </Button>
        }
      />

      <LoadingOverlay open={deleteLoading.value} />

      {/* Popup Dialog for Channels */}
      <Dialog
        open={popupState.open}
        onClose={() => setPopupState({ ...popupState, open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{popupState.title}</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ pb: 2 }}>
            {popupState.items.map((item, index) => (
              <Chip
                key={index}
                label={item.label}
                color="info"
                variant="outlined"
                size="small"
              />
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
