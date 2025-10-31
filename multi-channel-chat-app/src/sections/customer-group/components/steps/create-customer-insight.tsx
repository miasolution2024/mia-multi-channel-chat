import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CustomTable } from "@/components/custom-table";
import { Iconify } from "@/components/iconify";
import { useGetCustomerGroupCustomerJourneys } from "@/hooks/apis/use-get-customer-group-customer-journey";
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
import type { TableConfig, DataItem } from "@/components/custom-table/custom-table";

// Define the customer group customer journey item interface
interface CustomerGroupCustomerJourneyItem extends DataItem {
  id: string;
  customer_journey_id: {
    id: string;
    name: string;
  };
  customer_journey_name?: string; // Add optional field for table rendering
  insight_content: string;
}

// Define interface for the complex API response structure
interface CustomerJourneyApiResponse {
  id: number;
  "61557062"?: { name: string };
  "2f787ce3"?: { name: string };
  "1cc0c1c2"?: Array<{ content: string }>;
  "53c5bc9"?: number[];
  "5b61221c"?: number;
  "ac97705"?: number;
}

export function CreateCustomerInsight({customerGroupId, customerJourneyProcess}: {customerGroupId?: number, customerJourneyProcess?: number}) {
  const { setValue } = useFormContext();
  const [customerGroupCustomerJourneys, setCustomerGroupCustomerJourneys] = useState<CustomerGroupCustomerJourneyItem[]>([]);  
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<{id: string, title: string, content: string}>({id: '', title: '', content: ''});

  // Fetch customer journeys using the hook
  const { data: journeysData = [], isLoading } = useGetCustomerGroupCustomerJourneys({
    customer_group_id: customerGroupId,
    customer_journey_process: customerJourneyProcess
  });

  // Transform journeys data to customer insights format
  useEffect(() => {
    if (journeysData && journeysData.length > 0) {
      const transformedInsights: CustomerGroupCustomerJourneyItem[] = journeysData.map((journey) => { 
        // Parse the complex API response structure with proper typing
        const typedJourney = journey as CustomerJourneyApiResponse;
        const journeyStage = typedJourney["61557062"]?.name || "Unknown Stage";
        const insightContent = typedJourney["1cc0c1c2"]?.[0]?.content || "No insight content available";
        
        return {
          id: String(journey.id),
          customer_journey_id: {
            id: String(journey.id),
            name: journeyStage
          },
          customer_journey_name: journeyStage, // Add this field for table rendering
          insight_content: insightContent
        };
      });
      
      setCustomerGroupCustomerJourneys(transformedInsights);
    } else {
      setCustomerGroupCustomerJourneys([]);
    }
  }, [journeysData]);

  // Handle delete item from list
  const handleDeleteItem = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      // Remove item from the table
      setCustomerGroupCustomerJourneys(prev => prev.filter(item => item.id !== itemToDelete));
      
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
  const handleShowContent = (id: string, title: string, content: string) => {
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
    setValue("deleted_customer_group_customer_journey_ids", deletedIds);
  }, [deletedIds, setValue]);

  // Table configuration
  const TABLE_CONFIG: TableConfig[] = [
    {
      key: "id",
      label: "ID",
      align: "left",
      width: 100,
    },
    { 
      key: "customer_journey_name", 
      label: "Tên hành trình", 
      align: "left", 
      width: 250,
      render: (item) => {
        const insight = item as CustomerGroupCustomerJourneyItem;
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 240
            }}
          >
            {insight.customer_journey_id.name}
          </Typography>
        );
      }
    },
    { 
      key: "insight_content", 
      label: "Hành vi khách hàng", 
      align: "left", 
      width: 300,
      render: (item) => {
        const insight = item as CustomerGroupCustomerJourneyItem;
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
            onClick={() => handleShowContent(insight.id, insight.customer_journey_id.name, insight.insight_content)}
          >
            {insight.insight_content}
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
      render: (item) => {
        const insight = item as CustomerGroupCustomerJourneyItem;
        return (
          <Stack direction="row" spacing={1} justifyContent="center">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteItem(insight.id)}
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
          data={customerGroupCustomerJourneys}
          tableConfig={TABLE_CONFIG}
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
