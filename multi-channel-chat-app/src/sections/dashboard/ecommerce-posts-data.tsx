import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { DashboardData, OmniChoices, PagePostsData } from "./type";
import { useGetPagePostsData } from "@/actions/dashboard-channels";

interface EcommercePostsDataProps {
  pages: OmniChoices[];
  dashboardData: DashboardData[];
}

type PagePostsWithName = PagePostsData & {
  page_name?: string;
};

interface PostDataRow {
  id: number;
  rowNumber: number;
  postTitle: string;
  omniName: string;
  reactionsCount: number;
  sharesCount: number;
  viewsCount: number;
  commentsCount: number;
}

const normalizeCount = (value: string | number | null | undefined) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const EcommercePostsData: React.FC<EcommercePostsDataProps> = ({
  pages,
  dashboardData,
}) => {
  const [rows, setRows] = useState<PostDataRow[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    "reactions" | "views" | "shares" | "comments"
  >("reactions");
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "viewsCount", sort: "desc" },
  ]);

  const { pagePostsData, isLoading } = useGetPagePostsData(
    dashboardData,
    pages,
    selectedCategory
  );

  useEffect(() => {
    if (!pagePostsData || pagePostsData.length === 0) {
      setRows([]);
      return;
    }

    const newRows: PostDataRow[] = pagePostsData.map(
      (post: PagePostsWithName, index: number) => ({
        id: post.id,
        rowNumber: index + 1,
        postTitle: post.post_title || "Không có tiêu đề",
        omniName: post.page_name || post.omni_name || "Không xác định",
        reactionsCount: normalizeCount(post.reactions_count),
        sharesCount: normalizeCount(post.shares_count),
        viewsCount: normalizeCount(post.views_count),
        commentsCount: normalizeCount(post.comments_count),
      })
    );

    setRows(newRows);
  }, [pagePostsData]);

  const handleCategoryChange = (
    event: SelectChangeEvent<"reactions" | "views" | "shares" | "comments">
  ) => {
    setSelectedCategory(
      event.target.value as "reactions" | "views" | "shares" | "comments"
    );
  };

  const columns: GridColDef<PostDataRow>[] = [
    {
      field: "rowNumber",
      headerName: "",
      width: 80,
      sortable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "postTitle",
      headerName: "Bài viết",
      flex: 1,
      minWidth: 300,
      sortable: true,
      renderCell: (params) => (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              fontFamily: "Public Sans Variable",
              fontSize: "14px",
              fontWeight: 600,
              color: "#323743",
              lineHeight: 1.4,
            }}
          >
            {params.row.postTitle}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Public Sans Variable",
              fontSize: "12px",
              color: "#636B78",
              lineHeight: 1.4,
              marginTop: "4px",
            }}
          >
            {params.row.omniName}
          </Typography>
        </Box>
      ),
      sortComparator: (v1, v2) => v1.localeCompare(v2),
    },
    {
      field: "reactionsCount",
      headerName: "Lượt tương tác",
      width: 170,
      headerAlign: "center",
      align: "center",
      sortable: true,
      valueFormatter: (value: number) => value?.toLocaleString() || "0",
    },
    {
      field: "viewsCount",
      headerName: "Lượt xem",
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: true,
      valueFormatter: (value: number) => value?.toLocaleString() || "0",
    },
    {
      field: "commentsCount",
      headerName: "Bình luận",
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: true,
      valueFormatter: (value: number) => value?.toLocaleString() || "0",
    },
    {
      field: "sharesCount",
      headerName: "Chia sẻ",
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: true,
      valueFormatter: (value: number) => value?.toLocaleString() || "0",
    },
  ];

  const hasDashboardSelection = dashboardData && dashboardData.length > 0;

  if (!hasDashboardSelection) {
    return (
      <Card
        sx={{
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow:
            "0 0 2px 0 rgba(145 158 171 / 0.2), 0 12px 24px -4px rgba(145 158 171 / 0.12)",
        }}
      >
        <Box
          sx={{
            padding: "24px",
            textAlign: "center",
            minHeight: "200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#9095A1",
              fontSize: "16px",
              fontFamily: "Public Sans Variable",
            }}
          >
            Chưa có dữ liệu bài viết để hiển thị. Vui lòng chọn trang và khoảng
            thời gian.
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow:
          "0 0 2px 0 rgba(145 158 171 / 0.2), 0 12px 24px -4px rgba(145 158 171 / 0.12)",
      }}
    >
      <Box sx={{ padding: "24px 24px 0" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Typography
            sx={{
              color: "#323743",
              fontSize: "20px",
              fontFamily: "Public Sans Variable",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            Top nội dung hàng đầu
          </Typography>

          <FormControl size="small" sx={{ minWidth: "fit-content" }}>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              sx={{
                backgroundColor: "transparent",
                color: "#2373D3",
                width: "fit-content",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "6px",
                minHeight: "36px",
                fontSize: "14px",
                lineHeight: "22px",
                fontFamily: "Public Sans Variable",
                padding: "0 12px",
                fontWeight: 700,
                gap: "6px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2373D3",
                  borderWidth: "1px",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2373D3",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2373D3",
                  borderWidth: "1px",
                },
                "& .MuiSelect-select": {
                  padding: "8px 0",
                },
                "&:disabled": {
                  opacity: 0.4,
                },
              }}
            >
              <MenuItem value="reactions">Lượt tương tác</MenuItem>
              <MenuItem value="views">Lượt xem</MenuItem>
              <MenuItem value="comments">Lượt bình luận</MenuItem>
              <MenuItem value="shares">Lượt chia sẻ</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          disableRowSelectionOnClick
          disableColumnMenu
          hideFooter
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
              fontSize: "14px",
              color: "#323743",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8f9fa",
              borderBottom: "2px solid #e0e0e0",
            },
            "& .MuiDataGrid-columnHeader": {
              fontWeight: 600,
              fontSize: "14px",
              color: "#323743",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f8f9fa",
            },
          }}
        />
      </Box>
    </Card>
  );
};

export default EcommercePostsData;
