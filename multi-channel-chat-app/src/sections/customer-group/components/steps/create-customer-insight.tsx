import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CustomTable } from "@/components/custom-table";
import { Iconify } from "@/components/iconify";
import { 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useGetCustomerInsights } from "@/hooks/apis/use-get-customer-insight";
import { CustomerInsight } from "@/sections/customer-insight/types";
import { TableConfig } from "@/components/custom-table/custom-table";

export function CreateCustomerInsight({customerGroupId}: {customerGroupId?: number}) {
  const { setValue } = useFormContext();
  const [customerInsights, setCustomerInsights] = useState<CustomerInsight[]>([]);  
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<{id: string | number, title: string, content: string}>({id: '', title: '', content: ''});

  // Fetch customer insights using the hook
  const { data: insightsData = [], isLoading } = useGetCustomerInsights({
    page: 1,
    limit: 100,
    customerGroupId
  });

  // Transform insights data to customer insights format
  useEffect(() => {
    if (insightsData && insightsData.length > 0) {
      setCustomerInsights(insightsData);
    } else {
      setCustomerInsights([]);
    }
  }, [insightsData]);

  // Handle delete item from list
  const handleDeleteItem = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      console.log('itemToDelete',itemToDelete)
      // Remove item from the table
      setCustomerInsights(prev => prev.filter(item => item.id.toString() !== itemToDelete.toString()));
      
      // Track deleted ID
      setDeletedIds(prev => [...prev, itemToDelete]);
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  // Handle show content dialog
  const handleShowContent = (id: string | number, title: string, content: string) => {
    setSelectedContent({ id, title, content });
    setContentDialogOpen(true);
  };

  // Handle close content dialog
  const handleCloseContentDialog = () => {
    setContentDialogOpen(false);
    setSelectedContent({ id: '', title: '', content: '' });
  };

  // Expose deleted IDs through form context
  useEffect(() => {
    setValue("deleted_customer_insight_ids", deletedIds);
  }, [deletedIds, setValue]);

  // Table configuration
  const TABLE_CONFIG= [
    {
      key: "id",
      label: "ID",
      align: "left",
      width: 100,
    },
    {
      key: "customer_journey_id",
      id: "customer_journey_id",
      label: "Giai đoạn khách hàng",
      align: "left",
      width: 200,
      render: (item: CustomerInsight) => {
        return (
          <Typography variant="body2">
            {item["10769dd4"]?.customer_journey_id?.name || "-"}
          </Typography>
        );
      },
    },
    { 
      key: "insight_content", 
      label: "Hành vi khách hàng", 
      align: "left", 
      width: 300,
      render: (item: CustomerInsight) => {
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 290,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderRadius: 1
              }
            }}
            onClick={() => handleShowContent(item.id,"", item.content)}
          >
            {item.content}
          </Typography>
        );
      }
    },
    {
      key: "actions",
      label: "",
      align: "center",
      width: 80,
      sticky: "right",
      render: (item: CustomerInsight) => {
        return (
          <Stack direction="row" spacing={1} justifyContent="center">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteItem(item.id.toString())}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'error.lighter' 
                } 
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" width={18} />
            </IconButton>
          </Stack>
        );
      }
    }
  ];

  return (
    <Stack spacing={3}>
      {/* Customer Insights Table */}
      <Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Danh sách hành vi khách hàng
          </Typography>
        </Stack>
        <CustomTable
          data={customerInsights}
          tableConfig={TABLE_CONFIG as TableConfig[]}
          loading={isLoading}
        />
      </Stack>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa hành vi khách hàng này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Content Detail Dialog */}
      <Dialog
        open={contentDialogOpen}
        onClose={handleCloseContentDialog}
        aria-labelledby="content-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="content-dialog-title">
          #{selectedContent.id}|{selectedContent.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            component="div"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: 1.6,
              fontSize: '0.875rem'
            }}
          >
            {selectedContent.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContentDialog} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
