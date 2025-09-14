"use client";

import { useCallback, useState, useEffect } from "react";
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
  getContentAssistantList,
  deleteContentAssistant,
  type ContentAssistantApiResponse,
  type MediaGeneratedAiItem,
} from "@/actions/content-assistant";
import { createPost, type PostRequest } from "@/actions/auto-mia";
import { POST_STATUS, POST_STEP, POST_TYPE_OPTIONS } from "@/constants/auto-post";
import { getStartStepFromCurrentStep } from "../utils";

// Tạo interface riêng cho table config
interface ContentTableConfig {
  key: string;
  id: keyof Content | string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (item: Content) => React.ReactNode;
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

const mappingCurrentStep: Record<string, string> = {
  [POST_STEP.RESEARCH_ANALYSIS]: "Tìm hiểu",
  [POST_STEP.MAKE_OUTLINE]: "Lên dàn ý",
  [POST_STEP.WRITE_ARTICLE]: "Viết bài",
  [POST_STEP.GENERATE_IMAGE]: "Tạo sinh hình ảnh",
  [POST_STEP.HTML_CODING]: "Tạo định dạng HTML",
  [POST_STEP.PUBLISHED]: "Xuất bản",
};
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
    label: "Trạng thái hiện tại",
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
            <Chip key={index} label={keyword} size="small" variant="outlined" />
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
    render: (item: Content) => (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {item.customer_group.map((group, index) => (
          <Chip
            key={index}
            label={group.customer_group_id.name}
            size="small"
            variant="outlined"
          />
        ))}
      </Box>
    ),
  },
  {
    key: "customer_journey",
    id: "customer_journey",
    label: "Hành trình khách hàng",
    align: "left",
    render: (item: Content) => (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {item.customer_journey.map((journey, index) => (
          <Chip
            key={index}
            label={journey.customer_journey_id.name}
            size="small"
            variant="outlined"
            color="info"
          />
        ))}
      </Box>
    ),
  },
  {
    key: "content_tone",
    id: "content_tone",
    label: "Tông điệu",
    align: "left",
    render: (item: Content) => (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {item.content_tone.map((tone, index) => (
          <Chip
            key={index}
            label={tone.content_tone_id.tone_name || "N/A"}
            size="small"
            variant="outlined"
            color="secondary"
          />
        ))}
      </Box>
    ),
  },
  {
    key: "ai_rule_based",
    id: "ai_rule_based",
    label: "Quy tắc AI",
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
        label={item.status === "published" ? "Đã xuất bản" : "Nháp"}
        color={item.status === "published" ? "success" : "warning"}
        variant="outlined"
        size="small"
      />
    ),
  },
];

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
            <Iconify
              icon={
                   "solar:upload-bold"
              }
            />
            {"Xuất bản"}
          </MenuItem>

          <MenuItem
            onClick={() => {
              onDelete(content.id);
              popover.onClose();
            }}
            sx={{ color: "error.main" }}
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
  const [publishingId, setPublishingId] = useState<string | number | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiResponse, setApiResponse] = useState<{
    data: ContentAssistantApiResponse[];
    total: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const filters = useSetState({ topic: "", status: [] });
  const debouncedTopic = useDebounce(filters.state.topic, 500);

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getContentAssistantList({
        topic: debouncedTopic,
        status: filters.state.status,
        page: page + 1, // API sử dụng 1-based pagination
        pageSize,
      });
      setApiResponse(data);
    } catch (error) {
      console.error("Error fetching content assistant:", error);
      toast.error("Không thể tải danh sách trợ lý nội dung");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedTopic, filters.state.status, page, pageSize]);

  // API call với useEffect
  useEffect(() => {
    fetchData();
  }, [fetchData]); // Re-fetch when fetchData changes

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
      customer_group: (item.customer_group || []) as unknown as Content['customer_group'],
      customer_journey: (item.customer_journey || []) as unknown as Content['customer_journey'],
      ai_rule_based: (item.ai_rule_based || []) as unknown as Content['ai_rule_based'],
      content_tone: (item.content_tone || []) as unknown as Content['content_tone'],
      omni_channels: (item.omni_channels || []) as unknown as Content['omni_channels'],
      status: item.status || "draft",
      current_step: item.current_step,
      outline_post: item.outline_post ?? undefined,
      post_goal: item.post_goal ?? undefined,
      post_notes: item.post_notes ?? undefined,
      post_html_format: item.post_html_format ?? undefined,
      video: item.video || "",
      media: [],
      media_generated_ai: [],
      
    }));
  };

  const tableData: Content[] = apiResponse?.data
    ? transformApiData(apiResponse.data)
    : [];
  const totalCount = apiResponse?.total || 0;
  // Use API data directly since filtering is handled server-side
  const displayData = tableData;

  const handleResetFilters = useCallback(() => {
    filters.setState({
      topic: "",
      status: [],
    });
    setPage(0); // Reset to first page when filters change
  }, [filters]);

  // Since filtering is handled server-side, use displayData directly
  const dataFiltered = displayData;

  const canReset = !!filters.state.topic || filters.state.status.length > 0;

  const handleDeleteRow = useCallback(
    async (id: string | number) => {
      try {
        setIsDeleting(true);
        await deleteContentAssistant(id);
        // Refresh data
        await fetchData();
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
    [fetchData, setIsDeleting]
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
      await fetchData();
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
  }, [selected, confirm, fetchData, setIsDeleting]);

  const handlePublish = (id: string | number) => {
    setPublishingId(id);
    publishConfirm.onTrue();
  };

  const handleConfirmPublish = async () => {
    if (!publishingId) return;
    
    // Find the item to get current_step
    const currentItem = apiResponse?.data.find((item: ContentAssistantApiResponse) => item.id === publishingId);
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
        fetchData(); // Reload table
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
          {/* Thanh công cụ tìm kiếm */}
          <Box sx={{ p: 2.5 }}>
            <TextField
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
          </Box>

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

          <CustomTable
            data={dataFiltered}
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
            firstLoading={false}
            checkKey="id"
            onSelect={(selectedIds) =>
              setSelected(selectedIds.map((id) => String(id)))
            }
            defaultSelected={selected}
            moreOptions={(item) => {
              const contentItem = item as Content;
              const isPublished = contentItem.status === POST_STATUS.PUBLISHED;
              return !isPublished ? (
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
            <Button variant="contained" color="primary" onClick={handleConfirmPublish}>
              Xuất bản
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
    </>
  );
}
