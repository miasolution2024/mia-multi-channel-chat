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

// Tạo interface riêng cho table config
interface ContentTableConfig {
  key: string;
  id: keyof Content | string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: Content) => React.ReactNode;
}

// ----------------------------------------------------------------------

// Định nghĩa kiểu dữ liệu cho Content
export interface Content {
  id: string;
  topic: string; // Chủ đề
  contentType: string; // Loại bài viết
  mainSeoKeyword: string; // Từ khoá SEO chính
  secondarySeoKeywords: string[]; // Từ khoá SEO phụ
  customerGroup: string; // Nhóm khách hàng
  customerJourney: string; // Hành trình khách hàng
  createdAt: string | Date;
  status: 'Published' | 'Draft' | string;
  description?: string; // Nội dung bài viết
  [key: string]: unknown; // Index signature for compatibility
}

const TABLE_CONFIG: ContentTableConfig[] = [
  { key: "topic", id: "topic", label: "Chủ đề", align: "left" },
  { key: "contentType", id: "contentType", label: "Loại bài viết", align: "left" },
  { key: "mainSeoKeyword", id: "mainSeoKeyword", label: "Từ khoá SEO chính", align: "left" },
  { 
    key: "secondarySeoKeywords",
    id: "secondarySeoKeywords", 
    label: "Từ khoá SEO phụ", 
    align: "left",
    render: (item: Content) => (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {item.secondarySeoKeywords.slice(0, 2).map((keyword, index) => (
          <Chip key={index} label={keyword} size="small" variant="outlined" />
        ))}
        {item.secondarySeoKeywords.length > 2 && (
          <Chip label={`+${item.secondarySeoKeywords.length - 2}`} size="small" variant="outlined" />
        )}
      </Box>
    )
  },
  { key: "customerGroup", id: "customerGroup", label: "Nhóm khách hàng", align: "left" },
  { key: "customerJourney", id: "customerJourney", label: "Hành trình khách hàng", align: "left" },
  { 
    key: "status",
    id: "status", 
    label: "Trạng thái", 
    align: "center",
    render: (item: Content) => (
      <Chip 
        label={item.status === 'Published' ? 'Đã xuất bản' : 'Nháp'} 
        color={item.status === 'Published' ? 'success' : 'warning'}
        variant="outlined"
        size="small"
      />
    )
  },
];

// ----------------------------------------------------------------------

// Component cho menu actions
interface ContentActionMenuProps {
  content: Content;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: string) => void;
}

function ContentActionMenu({ content, onEdit, onDelete, onChangeStatus }: ContentActionMenuProps) {
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
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              onEdit(content.id);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" sx={{ mr: 2 }} />
            Chỉnh sửa
          </MenuItem>
          
          <MenuItem
            onClick={() => {
              const newStatus = content.status === 'Published' ? 'Draft' : 'Published';
              onChangeStatus(content.id, newStatus);
              popover.onClose();
            }}
          >
            <Iconify 
              icon={content.status === 'Published' ? 'solar:eye-closed-bold' : 'solar:eye-bold'} 
              sx={{ mr: 2 }} 
            />
            {content.status === 'Published' ? 'Chuyển về nháp' : 'Xuất bản'}
          </MenuItem>
          
          <MenuItem
            onClick={() => {
              onDelete(content.id);
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 2 }} />
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

  // Mẫu dữ liệu tạm thời
  const tableData: Content[] = [
    {
      id: '1',
      topic: 'Chủ đề 1',
      contentType: 'Blog',
      mainSeoKeyword: 'Từ khoá SEO chính 1',
      secondarySeoKeywords: ['Từ khoá phụ 1', 'Từ khoá phụ 2', 'Từ khoá phụ 3'],
      customerGroup: 'Mới',
      customerJourney: 'Nhận biết',
      createdAt: new Date().toISOString(),
      status: 'Published',
    },
    {
      id: '2',
      topic: 'Chủ đề 2',
      contentType: 'Bài đăng',
      mainSeoKeyword: 'Từ khoá SEO chính 2',
      secondarySeoKeywords: ['Từ khoá phụ 1', 'Từ khoá phụ 2', 'Từ khoá phụ 4'],
      customerGroup: 'Tiềm năng',
      customerJourney: 'Cân nhắc',
      createdAt: new Date().toISOString(),
      status: 'Draft',
    },
  ];

  const filters = useSetState({ topic: "", status: [] });

  const handleResetFilters = useCallback(() => {
    filters.setState({
      topic: "",
      status: [],
    });
  }, [filters]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: filters.state,
  });

  const canReset = !!filters.state.topic || filters.state.status.length > 0;

  const handleDeleteRow = useCallback(async (id: string) => {
    try {
      // Xử lý xóa nội dung với id: ${id}
      console.log('Deleting content with id:', id);
      toast.success("Xóa thành công!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi khi xóa!";
      toast.error(errorMessage);
      console.log(error);
    }
  }, []);

  const handleEditRow = useCallback((id: string) => {
    router.push(paths.dashboard.contentAssistant.edit(id));
  }, [router]);

  const handleDeleteRows = useCallback(async () => {
    try {
      // Xử lý xóa nhiều nội dung
      toast.success(`Đã xóa ${selected.length} mục!`);
      setSelected([]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi khi xóa!";
      toast.error(errorMessage);
      console.log(error);
    }
    confirm.onFalse();
  }, [selected, confirm]);

  const handleChangeStatus = useCallback(async (id: string, newStatus: string) => {
    try {
      // Xử lý thay đổi trạng thái
      console.log('Changing status for id:', id, 'to:', newStatus);
      toast.success("Đã cập nhật trạng thái!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi khi cập nhật trạng thái!";
      toast.error(errorMessage);
      console.log(error);
    }
  }, []);


  
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
            tableConfig={TABLE_CONFIG as TableConfig[]}
            count={dataFiltered.length}
            page={page}
            pageSize={pageSize}
            onChangePage={(event, newPage) => setPage(newPage)}
            onChangePageSize={(event) => setPageSize(parseInt(event.target.value, 10))}
            loading={false}
            firstLoading={false}
            checkKey="id"
            onSelect={(selectedIds) => setSelected(selectedIds.map(id => String(id)))}
            defaultSelected={selected}
            moreOptions={(item) => {
              const contentItem = item as Content;
              return (
                <ContentActionMenu 
                  content={contentItem}
                  onEdit={handleEditRow}
                  onDelete={handleDeleteRow}
                  onChangeStatus={handleChangeStatus}
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
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteRows}
          >
            Xóa
          </Button>
        }
      />
    </>
  );
}


interface FilterParams {
  inputData: Content[];
  filters: {
    topic: string;
    status: string[];
  };
}

function applyFilter({ inputData, filters }: FilterParams): Content[] {
  const { topic, status } = filters;

  let filteredData = [...inputData];

  if (topic) {
    filteredData = filteredData.filter(
      (content) =>
        content.topic
          .toLowerCase()
          .indexOf(topic.toLowerCase()) !== -1
    );
  }

  if (status.length) {
    filteredData = filteredData.filter((content) =>
      status.includes(content.status)
    );
  }

  return filteredData;
}