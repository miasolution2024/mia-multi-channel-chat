"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import { useSetState } from "@/hooks/use-set-state";
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
import { deleteCampaign, deleteCampaigns } from "@/actions/campaign";
import { useGetCampaignList } from "@/hooks/apis/use-get-campaigns";
import { Campaign } from "@/types/campaign";
import { POST_TYPE_OPTIONS } from "@/constants/auto-post";
import { CAMPAIGN_STATUS } from "@/constants/marketing-compaign";

// Tạo interface riêng cho table config
interface ItemsPopupProps {
  open: boolean;
  onClose: () => void;
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
}

function ItemsPopup({ open, onClose, title, items }: ItemsPopupProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pb: 2 }}>
          {items.map((item, index) => (
            <Chip
              key={index}
              label={item.label}
              size="small"
              variant="outlined"
              color={item.color}
              sx={{
                width: "100%",
                "&.MuiChip-root": {
                  display: "flex",
                  justifyContent: "flex-start",
                  overflowY: "auto",
                  height: "fit-content",
                  minHeight: "24px",
                },
                "& .MuiChip-label": {
                  whiteSpace: "wrap",
                },
              }}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

// Extend Campaign to be compatible with DataItem
interface CampaignDataItem extends Campaign {
  [key: string]: unknown;
}

interface CampaignTableConfig {
  key: string;
  id: keyof Campaign | string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (item: CampaignDataItem) => React.ReactNode;
  sticky?: "left" | "right";
  width?: number;
}

// ----------------------------------------------------------------------

const getCampaignStatusLabelAndColor = (
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
    case CAMPAIGN_STATUS.COMPLETED:
      return { label: "Hoàn tất", color: "success" };
    case CAMPAIGN_STATUS.IN_PROGRESS:
      return { label: "Đang chạy", color: "warning" };
    case CAMPAIGN_STATUS.TODO:
      return { label: "Khởi tạo", color: "default" };
    default:
      return { label: "N/A", color: "default" };
  }
};

// ----------------------------------------------------------------------

interface CampaignActionMenuProps {
  campaign: Campaign;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

function CampaignActionMenu({
  campaign,
  onEdit,
  onDelete,
}: CampaignActionMenuProps) {
  const popover = usePopover();
  const canDelete = campaign.status === CAMPAIGN_STATUS.TODO && campaign.ai_content_suggestions?.length === 0;

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
              onEdit(campaign.id);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Chỉnh sửa
          </MenuItem>
          {canDelete && (
            <MenuItem
              onClick={() => {
                onDelete(campaign.id);
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

export function CampaignListView() {
  const router = useRouter();
  const confirm = useBoolean();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const filters = useSetState({ 
    name: "", 
    status: "" as string,
    post_type: "" as string
  });
  const debouncedName = useDebounce(filters.state.name, 500);

  // Use the custom hook for data fetching
  const { data, total, isLoading, refetch } = useGetCampaignList({
    page: page + 1, // API sử dụng 1-based pagination
    pageSize,
    name: debouncedName,
    status: filters.state.status,
    postType: filters.state.post_type,
  });

  // Move TABLE_CONFIG inside component to access setPopupState
  const TABLE_CONFIG: CampaignTableConfig[] = [
    { key: "id", id: "id", label: "ID", width: 80 },
    { 
      key: "name", 
      id: "name", 
      label: "Tên chiến dịch", 
      align: "left", 
      width: 200,
      render: (item: CampaignDataItem) => (
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
      key: "post_type",
      id: "post_type",
      label: "Loại bài viết",
      align: "left",
      width: 150,
      render: (item: CampaignDataItem) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {POST_TYPE_OPTIONS.find((option) => option.value === item.post_type)
            ?.label || "N/A"}
        </Box>
      ),
    },
    {
      key: "post_topic",
      id: "post_topic",
      label: "Chủ đề",
      align: "left",
      width: 200,
      render: (item: CampaignDataItem) => (
        <Tooltip title={item.post_topic} arrow>
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
            {item.post_topic}
          </Typography>
        </Tooltip>
      ),
    },
    {
      key: "main_seo_keyword",
      id: "main_seo_keyword",
      label: "Từ khóa SEO chính",
      align: "left",
      width: 180,
      render: (item: CampaignDataItem) => (
        <Tooltip title={item.main_seo_keyword} arrow>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 160,
              cursor: "pointer",
            }}
          >
            {item.main_seo_keyword}
          </Typography>
        </Tooltip>
      ),
    },
    {
      key: "secondary_seo_keywords",
      id: "secondary_seo_keywords",
      label: "Từ khóa SEO phụ",
      align: "left",
      width: 200,
      render: (item: CampaignDataItem) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {(item.secondary_seo_keywords || [])
            .slice(0, 2)
            .map((keyword: string, index: number) => (
              <Chip
                key={index}
                label={keyword}
                size="small"
                variant="outlined"
              />
            ))}
          {(item.secondary_seo_keywords || []).length > 2 && (
            <Chip
              label={`+${(item.secondary_seo_keywords || []).length - 2}`}
              size="small"
              variant="outlined"
              onClick={() =>
                setPopupState({
                  open: true,
                  title: "Từ khóa SEO phụ",
                  items: item.secondary_seo_keywords.map((keyword) => ({
                    label: keyword,
                    color: "default" as const,
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
      key: "customer_group",
      id: "customer_group",
      label: "Nhóm khách hàng",
      align: "left",
      width: 200,
      render: (item: CampaignDataItem) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {item.customer_group.slice(0, 1).map((group, index) => (
            <Chip
              key={index}
              label={group.customer_group_id.name}
              size="small"
              variant="outlined"
            />
          ))}
          {item.customer_group.length > 1 && (
            <Chip
              label={`+${item.customer_group.length - 1}`}
              size="small"
              variant="outlined"
              onClick={() =>
                setPopupState({
                  open: true,
                  title: "Nhóm khách hàng",
                  items: item.customer_group.map((group) => ({
                    label: group.customer_group_id.name,
                    color: "default" as const,
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
      key: "services",
      id: "services",
      label: "Dịch vụ",
      width: 200,
      align: "left",
      render: (item: CampaignDataItem) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {item.services.slice(0, 1).map((service, index) => (
            <Chip
              key={index}
              label={service?.services_id?.name || ""}
              size="small"
              variant="outlined"
              color="info"
            />
          ))}
          {item.services.length > 1 && (
            <Chip
              label={`+${item.services.length - 1}`}
              size="small"
              variant="outlined"
              onClick={() =>
                setPopupState({
                  open: true,
                  title: "Dịch vụ",
                  items: item.services.map((service) => ({
                    label: service?.services_id?.name || "",
                    color: "info" as const,
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
      key: "start_date",
      id: "start_date",
      label: "Ngày bắt đầu",
      align: "center",
      width: 120,
      render: (item: CampaignDataItem) => (
        <Box>
          {item.start_date ? new Date(item.start_date).toLocaleDateString('vi-VN') : "N/A"}
        </Box>
      ),
    },
    {
      key: "end_date",
      id: "end_date",
      label: "Ngày kết thúc",
      align: "center",
      width: 120,
      render: (item: CampaignDataItem) => (
        <Box>
          {item.end_date ? new Date(item.end_date).toLocaleDateString('vi-VN') : "N/A"}
        </Box>
      ),
    },
    {
      key: "target_post_count",
      id: "target_post_count",
      label: "Số bài viết",
      align: "center",
      width: 100,
    },
    {
      key: "status",
      id: "status",
      label: "Trạng thái",
      align: "center",
      render: (item: CampaignDataItem) => (
        <Chip
          label={getCampaignStatusLabelAndColor(item.status).label}
          color={getCampaignStatusLabelAndColor(item.status).color}
          variant="outlined"
          size="small"
        />
      ),
      width: 150,
    },
    {
      key: "actions",
      id: "id",
      label: "",
      align: "center",
      render: (item: CampaignDataItem) => (
        <CampaignActionMenu
          campaign={item}
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
    filters.setState({
      name: "",
      status: "",
      post_type: "",
    });
    setPage(0); // Reset to first page when filters change
  }, [filters]);

  const canReset = !!filters.state.name || 
    !!filters.state.status || 
    !!filters.state.post_type;

  const handleDeleteRow = useCallback(
    async (id: string | number) => {
      try {
        setIsDeleting(true);
        await deleteCampaign(String(id));
        // Refresh data
        await refetch();
        toast.success("Xóa chiến dịch thành công!");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Lỗi khi xóa chiến dịch!";
        toast.error(errorMessage);
      } finally {
        setIsDeleting(false);
      }
    },
    [refetch, setIsDeleting]
  );

  const handleEditRow = useCallback(
    (id: string | number) => {
      router.push(paths.dashboard.marketingCampaign.edit(String(id)));
    },
    [router]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      setIsDeleting(true);
      await deleteCampaigns(selected);
      // Refresh data
      await refetch();
      toast.success(`Xóa ${selected.length} chiến dịch thành công!`);
      setSelected([]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Lỗi khi xóa chiến dịch!";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  }, [selected, refetch, setIsDeleting]);

  const statusOptions = [
    { value: CAMPAIGN_STATUS.TODO, label: "Khởi tạo" },
    { value: CAMPAIGN_STATUS.IN_PROGRESS, label: "Đang chạy" },
    { value: CAMPAIGN_STATUS.COMPLETED, label: "Hoàn tất" },
  ];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Chiến dịch Marketing"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Chiến dịch Marketing",
            href: paths.dashboard.marketingCampaign,
          },
          { name: "Danh sách" },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push(paths.dashboard.marketingCampaign.new)}
          >
            Thêm chiến dịch mới
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
            value={filters.state.name}
            onChange={(e) => filters.setState({ name: e.target.value })}
            placeholder="Tìm kiếm theo tên chiến dịch hoặc chủ đề"
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
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filters.state.status}
                onChange={(e) =>
                  filters.setState({
                    status: e.target.value as string,
                  })
                }
                label="Trạng thái"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Loại bài viết</InputLabel>
              <Select
                value={filters.state.post_type}
                onChange={(e) =>
                  filters.setState({
                    post_type: e.target.value as string,
                  })
                }
                label="Loại bài viết"
              >
                {POST_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
          data={data as CampaignDataItem[]}
          tableConfig={TABLE_CONFIG as TableConfig[]}
          page={page}
          pageSize={pageSize}
          onChangePage={(_, newPage) => setPage(newPage)}
           onChangePageSize={(event) => {
              setPageSize(parseInt(event.target.value, 10));
              setPage(0);
            }}
          onSelect={(selected) => setSelected(selected.map(String))}
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
            ? `Bạn có chắc chắn muốn xóa ${selected.length} chiến dịch đã chọn?`
            : "Bạn có chắc chắn muốn xóa chiến dịch này?"
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

      <ItemsPopup
        open={popupState.open}
        onClose={() => setPopupState({ ...popupState, open: false })}
        title={popupState.title}
        items={popupState.items}
      />

      <LoadingOverlay open={isDeleting} />
    </DashboardContent>
  );
}
