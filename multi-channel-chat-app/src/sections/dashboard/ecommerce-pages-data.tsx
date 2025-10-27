import { Box, Card, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import { FacebookView, FacebookReaction, OmniChoices } from "./type";
import { useGetMultipleFacebookPageData } from "@/actions/dashboard-channels";
import { sumAllEmotions } from "./hooks/use-sum-emotes";

interface EcommercePagesDataProps {
  pages: OmniChoices[];
  startDate: string;
  endDate: string;
  period: string;
}

interface PageDataRow {
  id: string;
  rowNumber: number;
  pageName: string;
  viewTotal: number;
  reactionTotal: number;
}

const EcommercePagesData: React.FC<EcommercePagesDataProps> = ({
  pages,
  startDate,
  endDate,
}) => {
  const [rows, setRows] = useState<PageDataRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  // Fetch view data
  const viewDataResult = useGetMultipleFacebookPageData(
    pages,
    "page_views_total",
    startDate,
    endDate,
    "total"
  );

  // Fetch reaction data
  const reactionDataResult = useGetMultipleFacebookPageData(
    pages,
    "page_actions_post_reactions_total",
    startDate,
    endDate,
    "total"
  );

  // Helper function to extract view value from FacebookView data
  const extractViewValue = (viewData: FacebookView): number => {
    if (!viewData || !viewData.data || viewData.data.length === 0) {
      return 0;
    }
    const values = viewData.data[0].values;
    if (values && values.length > 0) {
      return values[0].value || 0;
    }
    return 0;
  };

  // Process data and create rows
  useEffect(() => {
    if (!pages || pages.length === 0 || !startDate || !endDate) {
      setRows([]);
      return;
    }

    if (viewDataResult.isLoading || reactionDataResult.isLoading) {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    const newRows: PageDataRow[] = [];

    pages.forEach((page, index) => {
      let viewTotal = 0;
      let reactionTotal = 0;

      // Get view data for this page
      if (
        viewDataResult.fbPageData &&
        Array.isArray(viewDataResult.fbPageData) &&
        viewDataResult.fbPageData[index]
      ) {
        viewTotal = extractViewValue(
          viewDataResult.fbPageData[index] as FacebookView
        );
      }

      // Get reaction data for this page
      if (
        reactionDataResult.fbPageData &&
        Array.isArray(reactionDataResult.fbPageData) &&
        reactionDataResult.fbPageData[index]
      ) {
        reactionTotal = sumAllEmotions(
          reactionDataResult.fbPageData[index] as FacebookReaction
        );
      }

      newRows.push({
        id: page.page_id,
        rowNumber: index + 1,
        pageName: page.page_name,
        viewTotal,
        reactionTotal,
      });
    });

    setRows(newRows);
  }, [
    pages,
    startDate,
    endDate,
    viewDataResult.fbPageData,
    viewDataResult.isLoading,
    reactionDataResult.fbPageData,
    reactionDataResult.isLoading,
  ]);

  const columns: GridColDef[] = [
    {
      field: "rowNumber",
      headerName: "",
      width: 80,
      sortable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "pageName",
      headerName: "Tên trang",
      width: 300,
      sortable: true,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "viewTotal",
      headerName: "Tổng lượt xem",
      width: 200,
      sortable: true,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value: number) => value?.toLocaleString() || "0",
    },
    {
      field: "reactionTotal",
      headerName: "Tổng lượt tương tác",
      width: 200,
      sortable: true,
      headerAlign: "center",
      align: "center",
      valueFormatter: (value: number) => value?.toLocaleString() || "0",
    },
  ];

  if (!pages || pages.length === 0 || !startDate || !endDate) {
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
            Chưa có dữ liệu để hiển thị. Vui lòng chọn trang và khoảng thời
            gian.
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
        <Typography
          sx={{
            color: "#323743",
            fontSize: "20px",
            fontFamily: "Public Sans Variable",
            fontWeight: 600,
            marginBottom: "16px",
          }}
        >
          Các trang Facebook đã kết nối
        </Typography>
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

export default EcommercePagesData;
