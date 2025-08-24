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
import { paths } from "@/routes/path";
import { DashboardContent } from "@/layouts/dashboard";
import { CustomBreadcrumbs } from "@/components/custom-breadcrumbs";
import { Iconify } from "@/components/iconify";
import { toast } from "@/components/snackbar";
import { ConfirmDialog } from "@/components/custom-dialog";
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
  additional_notes_step_1?: string;
  outline_post?: string;
  post_goal?: string;
  post_notes?: string;
  additional_notes_step_2?: string;
  content?: string;
  additional_notes_step_3?: string;
  ai_notes_create_image_step_3?: string;
  media?: File[];
  media_generated_ai?: MediaGeneratedAiItem[];
  additional_notes_step_4?: string;
  post_html_format?: string;
  action?: string;
  [key: string]: unknown; // Index signature for compatibility
}

const TABLE_CONFIG: ContentTableConfig[] = [
  { key: "id", id: "id", label: "ID" },
  { key: "topic", id: "topic", label: "Chủ đề", align: "left" },
  {
    key: "post_type",
    id: "post_type",
    label: "Loại bài viết",
    align: "left",
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
  onChangeStatus: (id: string | number, status: string) => void;
}

function ContentActionMenu({
  content,
  onEdit,
  onDelete,
  onChangeStatus,
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
              const newStatus =
                content.status === "published" ? "draft" : "published";
              onChangeStatus(content.id, newStatus);
              popover.onClose();
            }}
          >
            <Iconify
              icon={
                content.status === "published"
                  ? "solar:eye-closed-bold"
                  : "solar:eye-bold"
              }
            />
            {content.status === "published" ? "Ẩn" : "Xuất bản"}
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

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getContentAssistantList({
        topic: filters.state.topic,
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
  }, [filters.state.topic, filters.state.status, page, pageSize]);

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
      customer_group: item.customer_group || [],
      customer_journey: item.customer_journey || [],
      ai_rule_based: item.ai_rule_based || [],
      content_tone: item.content_tone || [],
      additional_notes: item.additional_notes,
      created_at: item.created_at,
      status: item.status || "draft",
      description: item.description,
      action: item.action,
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

  // const handleChangeStatus = useCallback(
  //   async (id: string | number, newStatus: string) => {
  //     try {
  //       await updateContentAssistantStatus(id, newStatus);
  //       // Refresh data
  //       await fetchData();
  //       toast.success("Đã cập nhật trạng thái!");
  //     } catch (error) {
  //       const errorMessage =
  //         error instanceof Error
  //           ? error.message
  //           : "Lỗi khi cập nhật trạng thái!";
  //       toast.error(errorMessage);
  //       console.log(error);
  //     }
  //   },
  //   [fetchData]
  // );

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
              return (
                <ContentActionMenu
                  content={contentItem}
                  onEdit={handleEditRow}
                  onDelete={handleDeleteRow}
                  onChangeStatus={() => {}}
                />
              );
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
    </>
  );
}
