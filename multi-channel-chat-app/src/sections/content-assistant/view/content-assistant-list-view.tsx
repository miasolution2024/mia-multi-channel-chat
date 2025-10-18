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
import {
  deleteContentAssistant,
  type ContentAssistantApiResponse,
  type MediaGeneratedAiItem,
} from "@/actions/content-assistant";
import { createPost, type PostRequest } from "@/actions/auto-mia";
import {
  POST_STATUS,
  POST_STEP,
  POST_TYPE_OPTIONS,
  POST_STATUS_OPTIONS,
} from "@/constants/auto-post";
import { getStartStepFromCurrentStep } from "../utils";
import { Stack } from "@mui/material";
import { useUpdateContentAssistant } from "@/hooks/apis/use-update-content-assistant";
import { useGetContentAssistantList } from "@/hooks/apis/use-get-content-assistant-list";

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
              label={item.label
              }
              size="small"
              variant="outlined"
              color={item.color}
              sx={{
                width: "100%",
                "&.MuiChip-root": {
                  display: "flex",
                  justifyContent: "flex-start",
                  overflowY:'auto',
                  height:'fit-content',
                  minHeight:'24px'
                },
                "& .MuiChip-label": {
                  // overflow: "hidden",
                  // textOverflow: "ellipsis",
                  // whiteSpace: "nowrap",
                  whiteSpace:'wrap'
                },
              }}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

interface ContentTableConfig {
  key: string;
  id: keyof Content | string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (item: Content) => React.ReactNode;
  sticky?: "left" | "right";
  width?: number;
}

// ----------------------------------------------------------------------

// Định nghĩa kiểu dữ liệu cho nested objects từ API
interface CustomerGroupItem {
  customer_group_id: {
    id: number;
    name: string;
  };
}

interface ContentToneItem {
  content_tone_id: {
    id: number;
    tone_name: string | null;
    tone_description: string;
  };
}

interface CustomerJourneyItem {
  customer_journey_id: {
    id: number;
    name: string;
  };
}

interface ServicesItem {
  services_id: {
    id: number;
    name: string;
  };
}

interface AiRuleBasedItem {
  ai_rule_based_id: {
    id: number;
    content: string;
  };
}

interface OmniChannelsItem {
  omni_channels_id: number;
}

// Định nghĩa interface cho Content
export interface Content {
  id: number | string;
  current_step?: string;
  topic: string; // Chủ đề
  post_type: string | null; // Loại bài viết
  main_seo_keyword: string; // Từ khoá SEO chính
  secondary_seo_keywords?: string[]; // Từ khoá SEO phụ
  customer_group: CustomerGroupItem[]; // Nhóm khách hàng
  customer_journey: CustomerJourneyItem[]; // Hành trình khách hàng
  services: ServicesItem[]; // Dịch vụ
  ai_rule_based: AiRuleBasedItem[]; // Quy tắc AI
  content_tone: ContentToneItem[]; // Tonal
  omni_channels?: OmniChannelsItem[]; // Kênh omni
  additional_notes?: string; // Ghi chú bổ sung
  created_at?: string | Date;
  status: string; // Trạng thái từ API
  description?: string; // Nội dung bài viết
  // Các trường bổ sung từ form
  outline_post?: string;
  post_goal?: string;
  post_notes?: string;
  content?: string;
  media?: File[];
  media_generated_ai?: MediaGeneratedAiItem[];
  video: string;
  post_html_format?: string;
  [key: string]: unknown; // Index signature for compatibility
}

const getAIContentStatusLabelAndColor = (
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
    case POST_STATUS.PUBLISHED:
      return { label: "Đã xuất bản", color: "success" };
    case POST_STATUS.DRAFT:
      return { label: "Nháp", color: "default" };
    case POST_STATUS.IN_PROGRESS:
      return { label: "Đang viết bài", color: "warning" };
    default:
      return { label: "N/A", color: "default" };
  }
};
const mappingCurrentStep: Record<string, string> = {
  [POST_STEP.RESEARCH_ANALYSIS]: "Tìm hiểu",
  [POST_STEP.MAKE_OUTLINE]: "Lên dàn ý",
  [POST_STEP.WRITE_ARTICLE]: "Viết bài",
  [POST_STEP.GENERATE_IMAGE]: "Tạo sinh hình ảnh",
  [POST_STEP.HTML_CODING]: "Tạo định dạng HTML",
  [POST_STEP.PUBLISHED]: "Xuất bản",
};
// TABLE_CONFIG will be defined inside the component to access setPopupState

// ----------------------------------------------------------------------

interface ContentActionMenuProps {
  content: Content;
  onEdit: (id: string | number) => void;
  onDelete: (id: string | number) => void;
  onPublish: (id: string | number) => void;
}

function ContentActionMenu({
  content,
  onEdit,
  onDelete,
  onPublish,
}: ContentActionMenuProps) {
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
              onEdit(content.id);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Chỉnh sửa
          </MenuItem>

          <MenuItem
            onClick={() => {
              onPublish(content.id);
              popover.onClose();
            }}
          >
            <Iconify icon={"solar:upload-bold"} />
            {"Xuất bản"}
          </MenuItem>

          <MenuItem
            onClick={() => {
              onDelete(content.id);
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

export function ContentAssistantListView() {
  const router = useRouter();
  const confirm = useBoolean();
  const publishConfirm = useBoolean();
  const bulkCreateConfirm = useBoolean();
  const { updateContentAssistant } = useUpdateContentAssistant();
  const [publishingId, setPublishingId] = useState<string | number | null>(
    null
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [isBulkCreating, setIsBulkCreating] = useState(false);
  const [bulkCreatingIds, setBulkCreatingIds] = useState<string[]>([]);
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

  const filters = useSetState({ topic: "", status: [] as string[] });
  const debouncedTopic = useDebounce(filters.state.topic, 500);

  // Use the custom hook for data fetching
  const { data, total, isLoading, refetch } = useGetContentAssistantList({
    topic: debouncedTopic,
    status: filters.state.status,
    page: page + 1, // API sử dụng 1-based pagination
    pageSize,
  });

  // Create apiResponse object to maintain compatibility with existing code
  const apiResponse = { data: data || [], total: total || 0 };

  // Move TABLE_CONFIG inside component to access setPopupState
  const TABLE_CONFIG: ContentTableConfig[] = [
    { key: "id", id: "id", label: "ID" },
    { key: "topic", id: "topic", label: "Chủ đề", align: "left" },
    {
      key: "post_type",
      id: "post_type",
      label: "Loại bài viết",
      align: "left",
      render: (item: Content) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {POST_TYPE_OPTIONS.find((option) => option.value === item.post_type)
            ?.label || "N/A"}
        </Box>
      ),
    },
    {
      key: "current_step",
      id: "current_step",
      label: "Giai đoạn hiện tại",
      align: "left",
      render: (item: Content) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {item?.current_step ? mappingCurrentStep[item.current_step] : ""}
        </Box>
      ),
    },
    {
      key: "main_seo_keyword",
      id: "main_seo_keyword",
      label: "Từ khoá SEO chính",
      align: "left",
    },
    {
      key: "secondary_seo_keywords",
      id: "secondary_seo_keywords",
      label: "Từ khoá SEO phụ",
      align: "left",
      render: (item: Content) => (
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
      width: 250,
      render: (item: Content) => (
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
      key: "customer_journey",
      id: "customer_journey",
      label: "Hành trình khách hàng",
      width: 250,
      align: "left",
      render: (item: Content) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {item.customer_journey.slice(0, 1).map((journey, index) => (
            <Chip
              key={index}
              label={journey?.customer_journey_id?.name }
              size="small"
              variant="outlined"
              color="info"
            />
          ))}
          {item.customer_journey.length > 1 && (
            <Chip
              label={`+${item.customer_journey.length - 1}`}
              size="small"
              variant="outlined"
              onClick={() =>
                setPopupState({
                  open: true,
                  title: "Hành trình khách hàng",
                  items: item.customer_journey.map((journey) => ({
                    label: journey?.customer_journey_id?.name,
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
      key: "content_tone",
      id: "content_tone",
      label: "Tông điệu",
      width: 250,
      align: "left",
      render: (item: Content) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {item.content_tone.slice(0, 1).map((tone, index) => (
            <Chip
              key={index}
              label={tone.content_tone_id.tone_description || "N/A"}
              size="small"
              variant="outlined"
              color="secondary"
            />
          ))}
          {item.content_tone.length > 1 && (
            <Chip
              label={`+${item.content_tone.length - 1}`}
              size="small"
              variant="outlined"
              onClick={() =>
                setPopupState({
                  open: true,
                  title: "Tông điệu",
                  items: item.content_tone.map((tone) => ({
                    label: tone.content_tone_id.tone_description || "N/A",
                    color: "secondary" as const,
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
      key: "ai_rule_based",
      id: "ai_rule_based",
      label: "Quy tắc AI",
      width: 250,
      align: "left",
      render: (item: Content) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {item.ai_rule_based.slice(0, 1).map((rule, index) => (
            <Chip
              key={index}
              label={
                rule.ai_rule_based_id.content.length > 20
                  ? `${rule.ai_rule_based_id.content.substring(0, 20)}...`
                  : rule.ai_rule_based_id.content
              }
              size="small"
              variant="outlined"
              color="primary"
            />
          ))}
          {item.ai_rule_based.length > 1 && (
            <Chip
              label={`+${item.ai_rule_based.length - 1}`}
              size="small"
              variant="outlined"
              onClick={() =>
                setPopupState({
                  open: true,
                  title: "Quy tắc AI",
                  items: item.ai_rule_based.map((rule) => ({
                    label: rule.ai_rule_based_id.content,
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
      key: "services",
      id: "services",
      label: "Dịch vụ",
      width: 250,
      align: "left",
      render: (item: Content) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {item.services.slice(0, 1).map((service, index) => (
            <Chip
              key={index}
              label={service.services_id?.name}
              size="small"
              variant="outlined"
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
                    label: service.services_id?.name,
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
      key: "status",
      id: "status",
      label: "Trạng thái",
      align: "center",
      render: (item: Content) => (
        <Chip
          label={getAIContentStatusLabelAndColor(item.status).label}
          color={getAIContentStatusLabelAndColor(item.status).color}
          variant="outlined"
          size="small"
        />
      ),
      sticky: "right",
      width: 180,
    },
  ];

  // Transform API data to match Content interface
  const transformApiData = (
    apiData: ContentAssistantApiResponse[]
  ): Content[] => {
    return apiData.map((item) => ({
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
    }));
  };

  const tableData: Content[] = apiResponse?.data
    ? transformApiData(apiResponse.data)
    : [];
  const totalCount = apiResponse?.total || 0;
  // Use API data directly since filtering is handled server-side

  const handleResetFilters = useCallback(() => {
    filters.setState({
      topic: "",
      status: [],
    });
    setPage(0); // Reset to first page when filters change
  }, [filters]);

  const canReset = !!filters.state.topic || filters.state.status.length > 0;

  const handleDeleteRow = useCallback(
    async (id: string | number) => {
      try {
        setIsDeleting(true);
        await deleteContentAssistant(id);
        // Refresh data
        await refetch();
        toast.success("Xóa thành công!");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Lỗi khi xóa!";
        toast.error(errorMessage);
        console.log(error);
      } finally {
        setIsDeleting(false);
      }
    },
    [refetch, setIsDeleting]
  );

  const handleEditRow = useCallback(
    (id: string | number) => {
      router.push(paths.dashboard.contentAssistant.edit(String(id)));
    },
    [router]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      setIsDeleting(true);
      // Xử lý xóa nhiều nội dung
      await Promise.all(selected.map((id) => deleteContentAssistant(id)));
      // Refresh data
      await refetch();
      toast.success(`Đã xóa ${selected.length} mục!`);
      setSelected([]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Lỗi khi xóa!";
      toast.error(errorMessage);
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
    confirm.onFalse();
  }, [selected, confirm, refetch, setIsDeleting]);

  const handleBulkCreatePosts = async () => {
    if (selected.length === 0) return;

    try {
      setIsBulkCreating(true);
      setBulkCreatingIds(selected);

      // Process each selected item
      const promises = selected.map(async (id) => {
        const currentItem = apiResponse?.data.find(
          (item: ContentAssistantApiResponse) => String(item.id) === String(id)
        );
        const startStep = getStartStepFromCurrentStep(
          currentItem?.current_step
        );

        // Update status to IN_PROGRESS before calling createPost
        try {
          await updateContentAssistant(id, {
            status: POST_STATUS.IN_PROGRESS,
          });
        } catch (error) {
          console.error(`Failed to update status for item ${id}:`, error);
          throw error; // Re-throw to prevent createPost from being called
        }

        const inputN8NData: PostRequest = [
          {
            id: Number(id),
            startStep,
            endStep: 4,
          },
        ];

        return createPost(inputN8NData);
      });

      // Start all processes without waiting for completion
      Promise.all(promises)
        .then(() => {
          // Optionally refresh data after all complete
          setBulkCreatingIds([]);
        })
        .catch((error) => {
          console.error("Some posts failed to create:", error);
          setBulkCreatingIds([]);
        });

      // Show immediate success message
      toast.success(
        `Đã bắt đầu tạo ${selected.length} bài viết. Quá trình sẽ hoàn thành trong khoảng 10 phút.`
      );
      await refetch();
      setPage(0); // Reset to first page after refresh
      handleResetFilters();

      setSelected([]); // Clear selection
    } catch (error) {
      console.error("Error starting bulk creation:", error);
      toast.error("Có lỗi xảy ra khi bắt đầu tạo bài viết");
      setBulkCreatingIds([]);
    } finally {
      setIsBulkCreating(false);
    }
  };

  const handleConfirmBulkCreate = async () => {
    await handleBulkCreatePosts();
    bulkCreateConfirm.onFalse();
  };

  const handlePublish = (id: string | number) => {
    setPublishingId(id);
    publishConfirm.onTrue();
  };

  const handleConfirmPublish = async () => {
    if (!publishingId) return;

    // Find the item to get current_step
    const currentItem = apiResponse?.data.find(
      (item: ContentAssistantApiResponse) => item.id === publishingId
    );
    const startStep = getStartStepFromCurrentStep(currentItem?.current_step);

    try {
      setIsPublishing(true);
      const inputN8NData: PostRequest = [
        {
          id: Number(publishingId),
          startStep,
          endStep: 6,
        },
      ];

      const response = await createPost(inputN8NData);

      if (response?.success) {
        toast.success("Đã xuất bản thành công!");
        refetch(); // Reload table
      } else {
        toast.error(response?.message || "Có lỗi xảy ra khi xuất bản");
      }
    } catch (error) {
      console.error("Error publishing:", error);
      toast.error("Có lỗi xảy ra khi xuất bản");
    } finally {
      setIsPublishing(false);
      publishConfirm.onFalse();
      setPublishingId(null);
    }
  };

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Trợ lý nội dung"
          links={[
            { name: "Dashboard", href: paths.dashboard.root },
            { name: "Trợ lý nội dung", href: paths.dashboard.contentAssistant },
            { name: "Danh sách" },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => router.push(paths.dashboard.contentAssistant.new)}
            >
              Thêm nội dung mới
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <Card>
          <Stack
            direction={"row"}
            sx={{ p: 2.5 }}
            spacing={2}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} spacing={2}>
              <TextField
                size="small"
                value={filters.state.topic}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  filters.setState({ topic: event.target.value })
                }
                placeholder="Tìm kiếm chủ đề..."
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
                sx={{ width: 240 }}
              />

              <FormControl sx={{ width: 200 }} size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  size="small"
                  multiple
                  value={filters.state.status}
                  onChange={(event) => {
                    const value = event.target.value;
                    filters.setState({
                      status:
                        typeof value === "string" ? value.split(",") : value,
                    });
                  }}
                  label="Trạng thái"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={
                            POST_STATUS_OPTIONS.find(
                              (option) => option.value === value
                            )?.label || value
                          }
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {POST_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {canReset && (
                <Box sx={{ p: 2.5, pt: 0 }}>
                  <Button
                    color="error"
                    sx={{ flexShrink: 0 }}
                    onClick={handleResetFilters}
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                  >
                    Xóa
                  </Button>
                </Box>
              )}
            </Stack>

            {selected.length > 0 && (
              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={bulkCreateConfirm.onTrue}
                disabled={isBulkCreating}
              >
                Tạo bài viết tự động ({selected.length})
              </Button>
            )}
          </Stack>

          <CustomTable
            data={tableData}
            loading={isLoading || isDeleting}
            tableConfig={TABLE_CONFIG as TableConfig[]}
            count={totalCount}
            page={page}
            pageSize={pageSize}
            onChangePage={(event, newPage) => setPage(newPage)}
            onChangePageSize={(event) => {
              setPageSize(parseInt(event.target.value, 10));
              setPage(0); // Reset to first page when page size changes
            }}
            updateList={bulkCreatingIds.map((id) => String(id))}
            firstLoading={false}
            checkKey="id"
            onSelect={(selectedIds) =>
              setSelected(selectedIds.map((id) => String(id)))
            }
            defaultSelected={selected}
            canSelectRow={(item) => {
              const contentItem = item as Content;
              return contentItem.status === POST_STATUS.DRAFT;
            }}
            moreOptions={(item) => {
              const contentItem = item as Content;
              const isDraft = contentItem.status === POST_STATUS.DRAFT;
              return isDraft ? (
                <ContentActionMenu
                  content={contentItem}
                  onEdit={handleEditRow}
                  onDelete={handleDeleteRow}
                  onPublish={handlePublish}
                />
              ) : null;
            }}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Xóa"
        content={`Bạn có chắc chắn muốn xóa ${selected.length} mục đã chọn?`}
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRows}>
            Xóa
          </Button>
        }
      />

      <ConfirmDialog
        open={publishConfirm.value}
        onClose={publishConfirm.onFalse}
        title="Xuất bản"
        content="Bạn có chắc chắn muốn xuất bản nội dung này?"
        action={
          <>
            <Button variant="outlined" onClick={publishConfirm.onFalse}>
              Hủy
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmPublish}
            >
              Xuất bản
            </Button>
          </>
        }
      />

      <ConfirmDialog
        open={bulkCreateConfirm.value}
        onClose={bulkCreateConfirm.onFalse}
        title="Tạo bài viết tự động"
        content={`Bạn có chắc chắn muốn tạo ${selected.length} bài viết tự động? Quá trình này có thể mất khoảng 10 phút.`}
        action={
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmBulkCreate}
            >
              Tạo bài viết
            </Button>
          </>
        }
      />

      <LoadingOverlay
        open={isPublishing}
        title="Đang xử lý..."
        description="Đang xuất bản nội dung"
        timeDescription="Quá trình này có thể mất tầm 5 phút. Vui lòng không tắt trình duyệt."
      />

      <ItemsPopup
        open={popupState.open}
        title={popupState.title}
        items={popupState.items}
        onClose={() => setPopupState({ open: false, title: "", items: [] })}
      />
    </>
  );
}
