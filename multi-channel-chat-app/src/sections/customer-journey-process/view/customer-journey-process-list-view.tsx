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
import type { TableConfig } from "@/components/custom-table/custom-table";
import { usePopover } from "@/components/custom-popover";
import { fDate } from "@/utils/format-time";
import { CustomerJourneyProcess } from "../types";
import { Box, Chip } from "@mui/material";
import { CUSTOMER_JOURNEY_PROCESS_STATUS } from "@/constants/customer-journey-process";
import { useGetCustomerJourneyProcess } from "@/hooks/apis/use-get-customer-journey-process";
import { deleteCustomerJourneyProcess } from "@/actions/customer-journey-process";
import { ItemsPopup } from "../components/item-popup";

// ----------------------------------------------------------------------


const getCustomerJourneyProcessStatusLabelAndColor = (
  status: string
): {
  label: string;
  color:
    | "success"
    | "default"
    | "warning"
    | "primary"
    | "secondary"
    | "error"
    | "info";
} => {
  switch (status) {
    case CUSTOMER_JOURNEY_PROCESS_STATUS.DRAFT:
      return { label: "Nháp", color: "default" };
    case CUSTOMER_JOURNEY_PROCESS_STATUS.PUBLISHED:
      return { label: "Đang hoạt đông", color: "success" };
    default:
      return { label: "N/A", color: "default" };
  }
};

interface CustomerJourneyProcessActionMenuProps {
  customerJourneyProcess: CustomerJourneyProcess;  
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

function CustomerJourneyProcessActionMenu({
  customerJourneyProcess,
  onEdit,
  onDelete,
}: CustomerJourneyProcessActionMenuProps) {
  const popover = usePopover();
  const canDelete = customerJourneyProcess.status === CUSTOMER_JOURNEY_PROCESS_STATUS.DRAFT;

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
              onEdit(customerJourneyProcess.id);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Chỉnh sửa
          </MenuItem>
          {canDelete && (
            <MenuItem
            onClick={() => {
              onDelete(customerJourneyProcess.id);
              popover.onClose();
            }}
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

export function CustomerJourneyProcessListView() {
  const router = useRouter();
  const confirm = useBoolean();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState('')

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
 
  const debouncedName = useDebounce(name, 500);

  // Use the custom hook for data fetching
  const { data, total, isLoading, refetch } = useGetCustomerJourneyProcess({
    page: page + 1, // API sử dụng 1-based pagination
    limit: pageSize,
    name: debouncedName,
  });

  // Move TABLE_CONFIG inside component to access setPopupState
  const TABLE_CONFIG = [
    { key: "id", id: "id", label: "ID", width: 80 },
    {
      key: "name",
      id: "name",
      label: "Tên hành trình",
      align: "left",
      width: 200,
      render: (item: CustomerJourneyProcess) => (
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
      key: "customer_journey",
      id: "customer_journey",
      label: "Giai đoạn khách hàng",
      align: "left",
      width: 200,
      render: (item: CustomerJourneyProcess) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {item.customer_journey.slice(0, 1).map((group, index) => (
            <Chip
              key={index}
              label={group?.customer_journey_id?.name || "N/A"}
              size="small"
              variant="outlined"
              color="primary"
            />
          ))}
          {item.customer_journey.length > 1 && item.customer_journey.some((group) => group?.customer_journey_id?.name) && (
            <Chip
              label={`+${item.customer_journey.length - 1}`}  
              size="small"
              variant="outlined"
              color="primary"
              onClick={() =>
                setPopupState({
                  open: true,
                  title: "Giai đoạn khách hàng",
                  items: item.customer_journey.map((group) => ({
                    label: group.customer_journey_id.name,
                    color: "primary" as const,
                  })),
                })
              }
              sx={{ cursor: "pointer" }}
            />
          )}
        </Box>
      ),
    },
    {
      key: "status",
      id: "status",
      label: "Trạng thái",
      align: "center",
      render: (item: CustomerJourneyProcess) => (
        <Chip
          label={getCustomerJourneyProcessStatusLabelAndColor(item.status).label}
          color={getCustomerJourneyProcessStatusLabelAndColor(item.status).color}
          variant="outlined"
          size="small"
        />
      ),
      sticky: "right",
      width: 180,
    },
    {
      key: "date_created",
      id: "date_created",
      label: "Ngày tạo",
      align: "left",
      width: 180,
      render: (item: CustomerJourneyProcess) => (
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
          {fDate(item.date_created, "HH:mm DD/MM/YYYY")}
        </Typography>
      ),
    },
     {
      key: "date_updated",
      id: "date_updated",
      label: "Ngày cập nhật",
      align: "left",
      width: 180,
      render: (item: CustomerJourneyProcess) => (
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
          {fDate(item.date_updated, "HH:mm DD/MM/YYYY")}
        </Typography>
      ),
    },
    {
      key: "actions",
      id: "id",
      label: "",
      align: "center",
      render: (item: CustomerJourneyProcess) => (
        <CustomerJourneyProcessActionMenu
          customerJourneyProcess={item}
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
    setName('');
    setPage(0); // Reset to first page when filters change
  }, []);

  const canReset = !!name

  const handleDeleteRow = useCallback(
    async (id: string | number) => {
      try {
        setIsDeleting(true);
        await deleteCustomerJourneyProcess(String(id));
        // Refresh data
        await refetch();
        toast.success("Xóa hành trình thành công!");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Lỗi khi xóa hành trình!";
        toast.error(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    },
    [refetch, setIsDeleting]
  );

  const handleEditRow = useCallback(
    (id: string | number) => {
      router.push(paths.dashboard.customerJourneyProcess.edit(String(id)));
    },
    [router]
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Danh sách hành trình"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Hành trình",
            href: paths.dashboard.customerJourneyProcess,
          },
          { name: "Danh sách" },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() =>
              router.push(paths.dashboard.customerJourneyProcess.new)
            }
          >
            Thêm hành trình mới
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{ p: 2.5 }}
          spacing={2}
          justifyContent="space-between"
        >
          <TextField
            size="small"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tìm kiếm theo tên hành trình"
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

          <Stack direction="row" spacing={1} flexShrink={0}>
            {canReset && (
              <Button
                color="error"
                onClick={handleResetFilters}
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              >
                Xóa bộ lọc
              </Button>
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa hành trình"
        content={"Bạn có chắc chắn muốn xóa hành trình này?"}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow(selected);
              confirm.onFalse();
            }}
          >
            Xóa
          </Button>
        }
      />
      <LoadingOverlay description="Đang xóa..." open={isDeleting} />
      <ItemsPopup
        open={popupState.open}
        title={popupState.title}
        items={popupState.items}
        onClose={() => setPopupState({ open: false, title: "", items: [] })}
      />
    </DashboardContent>
  );
}
