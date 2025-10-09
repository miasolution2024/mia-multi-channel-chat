import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  Chip,
  Stack,
  InputAdornment,
} from "@mui/material";
import { Content } from "@/sections/content-assistant/view/content-assistant-list-view";
import { POST_TYPE_OPTIONS } from "@/constants/auto-post";
import { useDebounce } from "@/hooks/use-debounce";
import { Iconify } from "@/components/iconify";
import { CustomTable } from "@/components/custom-table";
import type {
  TableConfig,
  DataItem,
} from "@/components/custom-table/custom-table";
import { useEffect, useMemo, useState } from "react";
import { useGetContentAssistantList } from "@/hooks/apis/use-get-content-assistant-list";

// Utility functions from content-assistant-list-view
const getAIContentStatusLabelAndColor = (
  status: string
): {
  label: string;
  color:
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "default";
} => {
  switch (status) {
    case "draft":
      return { label: "Bản nháp", color: "default" };
    case "published":
      return { label: "Đã xuất bản", color: "success" };
    case "scheduled":
      return { label: "Đã lên lịch", color: "info" };
    case "archived":
      return { label: "Đã lưu trữ", color: "secondary" };
    default:
      return { label: status, color: "default" };
  }
};

const mappingCurrentStep: Record<string, string> = {
  research_analysis: "Phân tích nghiên cứu",
  make_outline: "Tạo dàn ý",
  write_article: "Viết bài",
  html_coding: "Mã hóa HTML",
  publish: "Xuất bản",
};

interface PostSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedItems: Content[]) => void;
  defaultSelected?: (string | number)[];
  postFilters?: {
    status?: string;
    post_type?: string;
    omni_channels?: string[];
  };
}

function PostSelectionDialog({
  open,
  onClose,
  onConfirm,
  defaultSelected = [],
  postFilters,
}: PostSelectionDialogProps) {
  const [selectedItems, setSelectedItems] = useState<Content[]>([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const variable = useMemo(
    () => ({
      topic: debouncedSearchTerm,
      status: postFilters?.status ? [postFilters.status] : ["draft"], // Hard-coded draft status
      page: page + 1, // API uses 1-based pagination
      pageSize: rowsPerPage,
    }),
    [debouncedSearchTerm, postFilters?.status, page, rowsPerPage]
  );
  // Use the hook to fetch data with filters
  const { data, total, isLoading } = useGetContentAssistantList(variable);

  // Transform API data to match Content interface
  const items: Content[] = useMemo(() => {
    return data
      ? data.map((item) => ({
          ...item,
          id: item.id,
          topic: item.topic || "",
          post_type: item.post_type,
          main_seo_keyword: item.main_seo_keyword || "",
          secondary_seo_keywords: item.secondary_seo_keywords || [],
          customer_group: (item.customer_group ||
            []) as unknown as Content["customer_group"],
          customer_journey: (item.customer_journey ||
            []) as unknown as Content["customer_journey"],
          ai_rule_based: (item.ai_rule_based ||
            []) as unknown as Content["ai_rule_based"],
          content_tone: (item.content_tone ||
            []) as unknown as Content["content_tone"],
          omni_channels: (item.omni_channels ||
            []) as unknown as Content["omni_channels"],
          status: item.status || "draft",
          current_step: item.current_step,
          outline_post: item.outline_post ?? undefined,
          post_goal: item.post_goal ?? undefined,
          post_notes: item.post_notes ?? undefined,
          post_html_format: item.post_html_format ?? undefined,
          video: item.video || "",
          media: [],
          media_generated_ai: [],
          services: (item.services || []) as unknown as Content["services"],
        }))
      : [];
  }, [data]);

  const totalCount = total || 0;

  const tableConfig: TableConfig<Content>[] = [
    {
      key: "id",
      label: "ID",
      width: 80,
    },
    {
      key: "topic",
      label: "Chủ đề",
      width: 200,
    },
    {
      key: "post_type",
      label: "Loại bài viết",
      width: 150,
      render: (item: Content) => (
        <Chip
          label={
            POST_TYPE_OPTIONS.find(
              (option: { value: string; label: string }) =>
                option.value === item.post_type
            )?.label || item.post_type
          }
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      key: "current_step",
      label: "Bước hiện tại",
      width: 150,
      render: (item: Content) => (
        <Typography variant="body2">
          {item?.current_step ? mappingCurrentStep[item.current_step] : ""}
        </Typography>
      ),
    },
    {
      key: "main_seo_keyword",
      label: "Từ khóa SEO chính",
      width: 180,
    },
    {
      key: "secondary_seo_keywords",
      label: "Từ khóa SEO phụ",
      width: 400,
      render: (item: Content) => (
        <Box
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            gap: 0.5,
            overflowX: "auto",
          }}
        >
          {item.secondary_seo_keywords &&
          item.secondary_seo_keywords.length > 0 ? (
            item.secondary_seo_keywords.map(
              (keyword: string, index: number) => (
                <Chip
                  key={index}
                  label={keyword}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              )
            )
          ) : (
            <Typography variant="body2" color="text.secondary">
              Không có
            </Typography>
          )}
        </Box>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      width: 120,
      render: (item: Content) => {
        const { label, color } = getAIContentStatusLabelAndColor(item.status);
        return <Chip label={label} color={color} size="small" />;
      },
    },
  ];

  useEffect(() => {
    if (open) {
      // Initialize selectedIds with defaultSelected when dialog opens
      setSelectedIds(defaultSelected.map((item) => Number(item)));
      // Find corresponding items for defaultSelected IDs
      const preSelectedItems = items.filter((item) =>
        defaultSelected.includes(item.id)
      );
      setSelectedItems(preSelectedItems);
    }
  }, [open, defaultSelected, items]);

  const handleConfirm = () => {
    onConfirm(selectedItems);
    handleClose();
  };

  const handleClose = () => {
    setSelectedItems([]);
    setSelectedIds([]);
    onClose();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectionChange = (selectedIds: (string | number)[]) => {
    setSelectedIds(selectedIds);
    const selected = items.filter((item) => selectedIds.includes(item.id));
    setSelectedItems(selected);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Chọn bài viết</Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mb: 2 }}>
          <TextField
            sx={{ width: 400 }}
            placeholder="Tìm kiếm theo chủ đề, từ khóa SEO..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <CustomTable
          data={items as DataItem[]}
          tableConfig={tableConfig as TableConfig<DataItem>[]}
          count={totalCount}
          page={page}
          pageSize={rowsPerPage}
          onChangePage={handlePageChange}
          onChangePageSize={handlePageSizeChange}
          defaultSelected={selectedIds}
          onSelect={handleSelectionChange}
          checkKey="id"
          loading={isLoading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={selectedItems.length === 0}
        >
          Xác nhận ({selectedItems.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PostSelectionDialog;
