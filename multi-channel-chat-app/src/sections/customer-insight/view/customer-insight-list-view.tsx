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
import { useGetCustomerInsights } from "@/hooks/apis/use-get-customer-insight";
import type { CustomerInsight } from "../types";
import type { TableConfig } from "@/components/custom-table/custom-table";
import { deleteCustomerInsight } from "@/actions/customer-insight";

// ----------------------------------------------------------------------

interface CustomerInsightActionMenuProps {
  customerInsight: CustomerInsight;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

function CustomerInsightActionMenu({
  customerInsight,
  onEdit,
  onDelete,
}: CustomerInsightActionMenuProps) {
  const popover = usePopover();
  const canDelete = !customerInsight.customer_group_customer_journey;
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
              onEdit(customerInsight.id);
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Chỉnh sửa
          </MenuItem>
          {canDelete && (
            <MenuItem
              onClick={() => {
                popover.onClose();
                onDelete(customerInsight.id);
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

export function CustomerInsightListView() {
  const router = useRouter();
  const confirm = useBoolean();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [content, setContent] = useState("");

  const debouncedContent = useDebounce(content, 500);

  // Use the custom hook for data fetching
  const { data, total, isLoading, refetch } = useGetCustomerInsights({
    page: page + 1, // API sử dụng 1-based pagination
    limit: pageSize,
    content: debouncedContent,
  });

  // Move TABLE_CONFIG inside component to access setPopupState
  const TABLE_CONFIG = [
    { key: "id", id: "id", label: "ID", width: 80 },
    {
      key: "content",
      id: "content",
      label: "Nội dung",
      align: "left",
      width: 200,
      render: (item: CustomerInsight) => (
        <Tooltip title={item.content} arrow>
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
            {item.content}
          </Typography>
        </Tooltip>
      ),
    },
    {
      key: "customer_journey_id",
      id: "customer_journey_id",
      label: "Giai đoạn khách hàng",
      align: "left",
      width: 200,
      render: (item: CustomerInsight) => {
        const journeyName = item["10769dd4"]?.customer_journey_id?.name || "-";
        return (
          <Tooltip title={journeyName} arrow>
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
              {journeyName}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      key: "customer_group_id",
      id: "customer_group_id",
      label: "Nhóm khách hàng",
      align: "left",
      width: 200,
      render: (item: CustomerInsight) => {
        const groupName = item["6475a12b"]?.customer_group_id?.name || "-";
        return (
          <Tooltip title={groupName} arrow>
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
              {groupName}
            </Typography>
          </Tooltip>
        );
      },
    },
    {
      key: "actions",
      id: "actions",
      label: "",
      align: "center",
      render: (item: CustomerInsight) => (
        <CustomerInsightActionMenu
          customerInsight={item}
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
        await deleteCustomerInsight(String(id));
        // Refresh data
        await refetch();
        toast.success("Xóa hành vi khách hàng thành công!");
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Lỗi khi xóa hành vi khách hàng!";
        toast.error(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    },
    [refetch, setIsDeleting]
  );

  const handleEditRow = useCallback(
    (id: string | number) => {
      router.push(paths.dashboard.customerInsight.edit(String(id)));
    },
    [router]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Danh sách hành vi khách hàng"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Hành vi khách hàng" },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => router.push(paths.dashboard.customerInsight.new)}
            >
              Tạo hành vi khách hàng mới
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
                placeholder="Tìm kiếm theo nội dung..."
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
            data={data as CustomerInsight[]}
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
        content={"Bạn có chắc chắn muốn xóa hành vi khách hàng này?"}
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

      <LoadingOverlay open={isDeleting} />
    </>
  );
}
