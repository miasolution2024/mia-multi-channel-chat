"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { useDebounce } from "@/hooks/use-debounce";
import { paths } from "@/routes/path";
import { DashboardContent } from "@/layouts/dashboard";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { Iconify } from "@/components/iconify";
import { toast } from "@/components/snackbar";
import { ConfirmDialog } from "@/components/custom-dialog";
import { LoadingOverlay } from "@/components/loading-overlay";
import { useBoolean } from "@/hooks/use-boolean";
import { CustomTable } from "@/components/custom-table";
import { usePopover } from "@/components/custom-popover";
import { useGetCustomerGroups } from "@/hooks/apis/use-get-customer-groups";
import type { CustomerGroup } from "../types";
import type { TableConfig } from "@/components/custom-table/custom-table";
import { deleteCustomerGroup } from "@/actions/customer-group";
import { Box, Chip } from "@mui/material";
import { ItemsPopup } from "../components/item-popup";

// ----------------------------------------------------------------------

interface CustomerGroupActionMenuProps {
  customerGroup: CustomerGroup;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

function CustomerGroupActionMenu({
  customerGroup,
  onEdit,
  onDelete,
}: CustomerGroupActionMenuProps) {
  const popover = usePopover();
  const canDelete = true
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
              popover.onClose();
              onEdit(customerGroup.id);
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Chỉnh sửa
          </MenuItem>
          {canDelete && (
            <MenuItem
              onClick={() => {
                popover.onClose();
                onDelete(customerGroup.id);
              }}
              sx={{ color: "error.main" }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Xóa
            </MenuItem>
          )}
        </MenuList>
      </Popover>
    </>
  );
}

export function CustomerGroupListView() {
  const router = useRouter();
  const confirm = useBoolean();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [content, setContent] = useState("");

  const [popupState, setPopupState] = useState<{
    open: boolean;
    title: string;
    items: Array<{
      label: string;
      color?:
        | "primary"
        | "secondary"
        | "info"
        | "success"
        | "warning"
        | "error"
        | "default";
    }>;
  }>({ open: false, title: "", items: [] });

  const debouncedContent = useDebounce(content, 500);

  // Use the custom hook for data fetching
  const { data, total, isLoading, refetch } = useGetCustomerGroups({
    page: page + 1, // API sử dụng 1-based pagination
    limit: pageSize,
    name: debouncedContent,
  });

  // Move TABLE_CONFIG inside component to access setPopupState
  const TABLE_CONFIG = [
    { key: "id", id: "id", label: "ID", width: 80 },
    {
      key: "name",
      id: "name",
      label: "Tên nhóm khách hàng",
      align: "left",
      width: 200,
      render: (item: CustomerGroup) => (
        <Tooltip title={item.name} arrow>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 180,
              cursor: "pointer",
            }}
          >
            {item.name}
          </Typography>
        </Tooltip>
      ),
    },
    {
      key: "services",
      id: "services",
      label: "Dịch vụ",
      align: "left",
      width: 250,
      render: (item: CustomerGroup) => {
        const services = item.services || [];
        if (services.length === 0) {
          return '-'
        }
        
        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {services.slice(0, 1).map((service, index) => (
              <Chip
                key={index}
                label={service.services_id.name}
                size="small"
                variant="outlined"
                color="info"
              />
            ))}
            {services.length > 1 && (
              <Chip
                label={`+${services.length - 1}`}
                size="small"
                variant="outlined"
                color="info"
                onClick={() =>
                  setPopupState({
                    open: true,
                    title: "Dịch vụ",
                    items: services.map((service) => ({
                      label: service.services_id.name,
                      color: "info" as const,
                    })),
                  })
                }
                sx={{ cursor: "pointer" }}
              />
            )}
          </Box>
        );
      },
    },
    {
      key: "descriptions",
      id: "descriptions",
      label: "Mô tả",
      align: "left",
      width: 250,
      render: (item: CustomerGroup) => (
        <Tooltip title={item.descriptions || '-'} arrow>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 200,
              cursor: "pointer",
            }}
          >
            {item.descriptions || '-'}
          </Typography>
        </Tooltip>
      ),
    },
    {
      key: "actions",
      id: "actions",
      label: "",
      align: "center",
      render: (item: CustomerGroup) => (
        <CustomerGroupActionMenu
          customerGroup={item}
          onEdit={handleEditRow}
          onDelete={(id) => {
            setSelected(String(id));
            confirm.onTrue();
          }}
        />
      ),
      sticky: "right",
      width: 80,
    },
  ];

  const handleResetFilters = useCallback(() => {
    setContent("");
    setPage(0); // Reset to first page when filters change
  }, []);

  const canReset = !!content;

  const handleDeleteRow = useCallback(
    async (id: string | number) => {
      try {
        setIsDeleting(true);
        await deleteCustomerGroup(String(id));
        // Refresh data
        await refetch();
        toast.success("Xóa nhóm khách hàng thành công!");
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Lỗi khi xóa nhóm khách hàng!";
        toast.error(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    },
    [refetch, setIsDeleting]
  );

  const handleEditRow = useCallback(
    (id: string | number) => {
      router.push(paths.dashboard.customerGroup.edit(String(id)));
    },
    [router]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Danh sách nhóm khách hàng"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Nhóm khách hàng" },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => router.push(paths.dashboard.customerGroup.new)}
            >
              Tạo nhóm khách hàng mới
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Stack
            spacing={2}
            alignItems={{ xs: "flex-end", md: "center" }}
            direction={{ xs: "column", md: "row" }}
            sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              flexGrow={1}
              sx={{ width: 1 }}
            >
              <TextField
                size="small"
                fullWidth
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Tìm kiếm theo tên..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon="eva:search-fill"
                        sx={{ color: "text.disabled" }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{ maxWidth: { md: 350 } }}
              />

              {canReset && (
                <Tooltip title="Xóa bộ lọc">
                  <IconButton onClick={handleResetFilters}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>

          <CustomTable
            data={data}
            tableConfig={TABLE_CONFIG as TableConfig[]}
            page={page}
            pageSize={pageSize}
            onChangePage={(_, newPage) => setPage(newPage)}
            onChangePageSize={(event) => {
              setPageSize(parseInt(event.target.value, 10));
              setPage(0);
            }}
            loading={isLoading}
            count={total}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa"
        content={
            "Bạn có chắc chắn muốn xóa hành vi khách hàng này?"
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow(selected);
              confirm.onFalse();
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        }
      />

      <ItemsPopup
        open={popupState.open}
        onClose={() => setPopupState({ ...popupState, open: false })}
        title={popupState.title}
        items={popupState.items}
      />

      <LoadingOverlay open={isDeleting} />
    </>
  );
}
