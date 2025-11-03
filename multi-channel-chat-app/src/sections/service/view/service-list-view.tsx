"use client";

import { useState, useCallback } from "react";
import {
  Button,
  Card,
  Container,
  TextField,
  Tooltip,
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

import { useGetServices } from "@/hooks/apis/use-get-services";
import { Service } from "../types";
import { deleteService, deleteServices } from "@/actions/service";
import { paths } from "@/routes/path";
import { useRouter } from "next/navigation";
import { fDate } from "@/utils/format-time";

// ----------------------------------------------------------------------

interface ServiceActionMenuProps {
  service: Service;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

function ServiceActionMenu({
  service,
  onEdit,
  onDelete,
}: ServiceActionMenuProps) {
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
              onEdit(service.id);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Chỉnh sửa
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDelete(service.id);
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

export function ServiceListView() {
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

  const { data, total, isLoading, refetch } = useGetServices({
    page,
    limit: pageSize,
    name: debouncedName,
  });

  const TABLE_CONFIG: TableConfig<DataItem>[] = [
    {
      key: "id",
      label: "ID",
      width: 80,
      render: (row: DataItem) => (row as Service).id,
    },
    {
      key: "name",
      label: "Tên dịch vụ",
      width: 200,
      render: (row: DataItem) => {
        const service = row as Service;
        return (
          <Tooltip title={service.name} placement="top">
            <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
              {service.name}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      key: "price",
      label: "Giá",
      width: 120,
      render: (row: DataItem) => {
        const service = row as Service;
        return (
          <Typography variant="body2">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(service.price))}
          </Typography>
        );
      },
    },
    {
      key: "description",
      label: "Mô tả",
      width: 250,
      render: (row: DataItem) => {
        const service = row as Service;
        return (
          <Tooltip
            title={service.description || "Không có mô tả"}
            placement="top"
          >
            <Typography variant="body2" noWrap sx={{ maxWidth: 230 }}>
              {service.description || "Không có mô tả"}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      key: "omni_channels",
      label: "Kênh",
      width: 200,
      render: (row: DataItem) => {
        const service = row as Service;
        const channels = service.omni_channels || [];

        if (channels.length === 0) {
          return (
            <Typography variant="body2" color="text.secondary">
              Không có kênh
            </Typography>
          );
        }

        const firstChannel = channels[0];
        const firstChannelName =
          firstChannel?.omni_channels_id?.page_name || "Không có tên";

        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={firstChannelName}
              size="small"
              variant="outlined"
              color="info"
            />
            {channels.length > 1 && (
              <Chip
                label={`+${channels.length - 1}`}
                size="small"
                variant="outlined"
                color="info"
                onClick={() =>
                  setPopupState({
                    open: true,
                    title: "Danh sách kênh",
                    items: channels.map((channel) => ({
                      label:
                        channel.omni_channels_id?.page_name || "Không có tên",
                      color: "info",
                    })),
                  })
                }
                sx={{ cursor: "pointer" }}
              />
            )}
          </Stack>
        );
      },
    },
    {
      key: "created_at",
      label: "Ngày tạo",
      width: 120,
      render: (row: DataItem) => {
        const service = row as Service;
        return (
          <Typography variant="body2">
            {fDate(service.created_at, "HH:mm DD/MM/YYYY")}
          </Typography>
        );
      },
    },
    {
      key: "actions",
      label: "",
      align: "center",
      sticky: "right",
      width: 80,
      render: (row: DataItem) => {
        const service = row as Service;
        return (
          <ServiceActionMenu
            service={service}
            onEdit={() => handleEditRow(service.id.toString())}
            onDelete={() => handleDeleteRow(service.id.toString())}
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
      router.push(paths.dashboard.service.edit(id));
    },
    [router]
  );

  const handleConfirmDelete = useCallback(async () => {
    try {
      deleteLoading.onTrue();

      if (selected.length === 1) {
        await deleteService(selected[0]);
        toast.success("Xóa dịch vụ thành công!");
      } else {
        await deleteServices(selected);
        toast.success(`Xóa ${selected.length} dịch vụ thành công!`);
      }

      setSelected([]);
      await refetch();
    } catch (error) {
      console.error("Error deleting service(s):", error);
      toast.error("Có lỗi xảy ra khi xóa dịch vụ!");
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
            heading="Danh sách dịch vụ"
            links={[
              { name: "Dashboard", href: paths.dashboard.root },
              { name: "Dịch vụ" },
            ]}
            action={
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => router.push(paths.dashboard.service.new)}
              >
                Thêm dịch vụ
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
                placeholder="Tìm kiếm theo tên..."
                InputProps={{
                  startAdornment: (
                    <Iconify
                      icon="eva:search-fill"
                      sx={{ color: "text.disabled" }}
                    />
                  ),
                }}
                sx={{ maxWidth: { md: 350 } }}
              />
            </div>

            <CustomTable
              data={data}
              tableConfig={TABLE_CONFIG}
              loading={isLoading}
              count={total}
              page={page - 1}
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
            ? "Bạn có chắc chắn muốn xóa dịch vụ này?"
            : `Bạn có chắc chắn muốn xóa ${selected.length} dịch vụ đã chọn?`
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
          <Stack spacing={1} sx={{ pt: 1 }}>
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
