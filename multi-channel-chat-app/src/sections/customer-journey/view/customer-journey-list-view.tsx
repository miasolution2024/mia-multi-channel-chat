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
import { useGetCustomerJourneys } from "@/hooks/apis/use-get-customer-journeys";
import type { CustomerJourney } from "../types";
import { deleteCustomerJourney, deleteCustomerJourneys } from "@/actions/customer-journey";
import { fDate } from "@/utils/format-time";
import { SwitchCustomerJourneyComponent } from "../components/switch-customer-journey-component";

// ----------------------------------------------------------------------

interface CustomerJourneyActionMenuProps {
  customerJourney: CustomerJourney;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

function CustomerJourneyActionMenu({
  customerJourney,
  onEdit,
  onDelete,
}: CustomerJourneyActionMenuProps) {
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
              onEdit(customerJourney.id);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Chỉnh sửa
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDelete(customerJourney.id);
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

export function CustomerJourneyListView() {
  const router = useRouter();
  const confirm = useBoolean();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [name, setName] = useState('')
 
  const debouncedName = useDebounce(name, 500);

  // Use the custom hook for data fetching
  const { data, total, isLoading, refetch } = useGetCustomerJourneys({
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
      render: (item: CustomerJourney) => (
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
      key: "active",
      id: "active",
      label: "Trạng thái",
      align: "left",
      width: 100,
      render: (item: CustomerJourney) => (
       <SwitchCustomerJourneyComponent item={item} />
      ),
    },
    {
      key: "description",
      id: "description",
      label: "Mô tả",
      align: "left",
      width: 300,
      render: (item: CustomerJourney) => (
        <Tooltip title={item.description} arrow>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 280,
              cursor: "pointer",
            }}
          >
            {item.description}
          </Typography>
        </Tooltip>
      ),
    },
    {
      key: "date_created",
      id: "date_created",
      label: "Ngày tạo",
      align: "left",
      width: 180,
      render: (item: CustomerJourney) => (
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
      render: (item: CustomerJourney) => (
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
      render: (item: CustomerJourney) => (
        <CustomerJourneyActionMenu
          customerJourney={item}
          onEdit={handleEditRow}
          onDelete={(id) => {
            setSelected([String(id)]);
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
        await deleteCustomerJourney(String(id));
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
      router.push(paths.dashboard.customerJourney.edit(String(id)));
    },
    [router]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      setIsDeleting(true);
      await deleteCustomerJourneys(selected);
      // Refresh data
      await refetch();
      toast.success(`Xóa ${selected.length} hành trình thành công!`);
      setSelected([]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Lỗi khi xóa hành trình!";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [selected, refetch, setIsDeleting]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Danh sách hành trình"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Hành trình",
            href: paths.dashboard.customerJourney,
          },
          { name: "Danh sách" },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push(paths.dashboard.customerJourney.new)}
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
                  <Iconify icon="eva:search-fill" sx={{ color: "text.disabled" }} />
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
          data={data as CustomerJourney[]}
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
        title="Xóa chiến dịch"
        content={
          selected.length > 1
            ? `Bạn có chắc chắn muốn xóa ${selected.length} hành trình đã chọn?`
            : "Bạn có chắc chắn muốn xóa hành trình này?"
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (selected.length === 1) {
                handleDeleteRow(selected[0]);
              } else {
                handleDeleteRows();
              }
              confirm.onFalse();
            }}
          >
            Xóa
          </Button>
        }
      />
      <LoadingOverlay description="Đang xóa..." open={isDeleting} />
    </DashboardContent>
  );
}
