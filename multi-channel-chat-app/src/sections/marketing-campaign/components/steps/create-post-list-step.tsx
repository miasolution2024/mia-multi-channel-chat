import { useEffect, useState } from "react";
import { useFormContext, useForm, FormProvider } from "react-hook-form";
import { getContentAssistantList } from "@/actions/content-assistant";
import { useGetContentTones } from "@/hooks/apis/use-get-content-tones";
import { CustomTable } from "@/components/custom-table";
import { Iconify } from "@/components/iconify";
import { toast } from "@/components/snackbar";
import { RHFTextField, RHFMultiSelect, RHFAutocomplete } from "@/components/hook-form";
import PostSelectionDialog from "@/sections/content-assistant/components/post-selection-dialog";
import { Content } from "@/sections/content-assistant/view/content-assistant-list-view";
import { 
  ContentSuggestionItem
} from "@/sections/marketing-campaign/types/create-post-list-step";
import { 
  Box, 
  Button,
  Chip, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton, 
  Stack, 
  Typography,
  TextField,
  CircularProgress
} from "@mui/material";
import type { TableConfig } from "@/components/custom-table/custom-table";
import { POST_TYPE_OPTIONS } from "@/constants/auto-post";
import { useCreateContentAssistant } from "@/hooks/apis/use-create-content-assistant";
import { useUpdateContentAssistant } from "@/hooks/apis/use-update-content-assistant";
import { buildStepResearchData } from "@/sections/content-assistant/utils";
import { CampaignFormData, transformCampaignToContentAssistant } from "@/sections/marketing-campaign/utils";
import { CreateContentAssistantRequest } from "@/sections/content-assistant/types/content-assistant-create";

export function CreatePostListStep() {
  const { watch, getValues, setValue } = useFormContext();
  const [contentSuggestions, setContentSuggestions] = useState<ContentSuggestionItem[]>([]);
  const [isLoadingContentAssistant, setIsLoadingContentAssistant] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ContentSuggestionItem | null>(null);
  const [createPostListDialogOpen, setCreatePostListDialogOpen] = useState(false);
  const [createAdditionalPost, setCreateAdditionalPost] = useState(false);
  const [additionalPostQuantity, setAdditionalPostQuantity] = useState<number>(0);
  const [isGeneratingPosts, setIsGeneratingPosts] = useState(false);

  // Watch form values for filtering
  const postType = watch("post_type");
  const omniChannel = watch("omni_channels");

  const { createContentAssistant } = useCreateContentAssistant();
  const { updateContentAssistant } = useUpdateContentAssistant();

  
  // Use the new hook for content tones
  const { data: contentToneOptions } = useGetContentTones({
    page: 1,
    limit: 100,
  });

  const editForm = useForm<{
    topic: string;
    main_seo_keyword: string;
    secondary_seo_keywords: string[];
    content_tone: string[];
    ai_notes_write_article: string;
  }>({
    defaultValues: {
      topic: "",
      main_seo_keyword: "",
      secondary_seo_keywords: [],
      ai_notes_write_article: "",
      content_tone: [],
    },
  });

  const aiContentSuggestions = watch("ai_content_suggestions");

  // Load content assistants when ai_content_suggestions changes
  useEffect(() => {
    const loadContentAssistants = async () => {
      if (!aiContentSuggestions || !Array.isArray(aiContentSuggestions) || aiContentSuggestions.length === 0) {
        setContentSuggestions([]);
        return;
      }

      try {
        setIsLoadingContentAssistant(true);
        
        // Gọi API getContentAssistantList với từng ID
        const promises = aiContentSuggestions.map(async (contentId: string) => {
          const response = await getContentAssistantList({
            id: Number(contentId),
          });
          
          if (response.data && response.data.length > 0) {
            const item = response.data[0]; // Lấy item đầu tiên vì filter theo ID
            return {
              id: item.id.toString(),
              topic: item.topic,
              main_seo_keyword: item.main_seo_keyword,
              secondary_seo_keywords: item.secondary_seo_keywords || [],
              customer_journey: item.customer_journey || [],
              post_type: item.post_type,
              content_tone: item.content_tone || [],
              ai_notes_write_article: item.ai_notes_write_article,
            } as unknown as ContentSuggestionItem;
          }
          return null;
        });
        const results = await Promise.all(promises);
        const filteredResults = results.filter(item => item !== null) as ContentSuggestionItem[];
        setContentSuggestions(filteredResults);
      } catch {
        toast.error("Không thể tải danh sách content assistants");
        setContentSuggestions([]);
      } finally {
        setIsLoadingContentAssistant(false);
      }
    };

    loadContentAssistants();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(aiContentSuggestions)]);

  // Handle delete item from list
  const handleDeleteItem = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      
      setContentSuggestions(prev => prev.filter(item => item.id !== itemToDelete));
      
      // Update form field ai_content_suggestions
      const updatedContentSuggestions = contentSuggestions
        .filter(item => item.id !== itemToDelete)
        .map(item => item.id);
      setValue("ai_content_suggestions", updatedContentSuggestions);
      
      toast.success("Đã xóa bài viết thành công");
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleEditItem = (item: ContentSuggestionItem) => {
    setItemToEdit(item);
    editForm.reset({
      topic: item.topic,
      main_seo_keyword: item.main_seo_keyword,
      secondary_seo_keywords: item.secondary_seo_keywords,
      content_tone: item.content_tone.map(ct => {
        // Find the corresponding tone option by description to get the ID
        const toneOption = contentToneOptions.find(option => 
          option.tone_description === ct.content_tone_id.tone_description
        );
        return toneOption?.id || '';
      }).filter(id => id !== ''), // Remove empty IDs
      ai_notes_write_article: item.ai_notes_write_article || "",
    });
    setEditDrawerOpen(true);
  };

  const handleCloseEditDrawer = () => {
    setEditDrawerOpen(false);
    setItemToEdit(null);
    editForm.reset();
  };

  const handleSaveEdit = async () => {
    if (!itemToEdit) return;
    
    const formData = editForm.getValues();
    
    // Update the item in contentSuggestions state
    const updatedSuggestions = contentSuggestions.map(suggestion => {
      if (suggestion.id === itemToEdit.id) {
        return {
          ...suggestion,
          topic: formData.topic,
          main_seo_keyword: formData.main_seo_keyword,
          secondary_seo_keywords: Array.isArray(formData.secondary_seo_keywords) 
            ? formData.secondary_seo_keywords
            : (formData.secondary_seo_keywords as string).split(',').map((k: string) => k.trim()),
          content_tone: formData.content_tone.map(toneId => {
            const tone = contentToneOptions.find(t => t.id === toneId);
            return {
              content_tone_id: {
                id: toneId,
                tone_description: tone?.tone_description || ''
              }
            };
          }),
          ai_notes_write_article: formData.ai_notes_write_article,
        };
      }
      return suggestion;
    });
    
    // Handle save data change (call hook api)
    try {
      await updateContentAssistant(itemToEdit.id, {
        topic: formData.topic,
        main_seo_keyword: formData.main_seo_keyword,
        secondary_seo_keywords: Array.isArray(formData.secondary_seo_keywords) 
          ? formData.secondary_seo_keywords
          : (formData.secondary_seo_keywords as string).split(',').map((k: string) => k.trim()),
        content_tone: {
          create: formData.content_tone.map(toneId => ({
            ai_content_suggestions_id: itemToEdit.id,
            content_tone_id: {
              id: parseInt(toneId)
            }
          })),
          update: [],
          delete: []
        },
        ai_notes_write_article: formData.ai_notes_write_article,
      });
      
      setContentSuggestions(updatedSuggestions);
      handleCloseEditDrawer();
      toast.success('Cập nhật bài viết thành công!');
    } catch (error) {
      console.error('Error updating content assistant:', error);
      toast.error('Có lỗi xảy ra khi cập nhật bài viết');
    }
  };

  const handlePostsConfirm = (selectedItems: Content[]) => {

    // Lấy danh sách ID hiện tại
    const currentIds = new Set(contentSuggestions.map(item => item.id));

    const trulyNewItems = selectedItems.filter(item => !currentIds.has(item.id.toString()));

    const remainingItems = contentSuggestions;
    
    const newContentSuggestions: ContentSuggestionItem[] = trulyNewItems.map(item => ({
      id: item.id.toString(),
      topic: item.topic,
      main_seo_keyword: item.main_seo_keyword,
      secondary_seo_keywords: item.secondary_seo_keywords || [],
      customer_journey: item.customer_journey.map(cj => ({
        customer_journey_id: {
          name: cj.customer_journey_id.name
        }
      })),
      post_type: item.post_type,
      content_tone: item.content_tone.map(ct => ({
        content_tone_id: {
          id: ct.content_tone_id.id?.toString(),
          tone_description: ct.content_tone_id.tone_description
        }
      })),
      ai_notes_write_article: item.additional_notes || null,
    }));

    
    const updatedContentSuggestions = [...remainingItems, ...newContentSuggestions];
    setContentSuggestions(updatedContentSuggestions);

    // Update form field ai_content_suggestions
    setValue("ai_content_suggestions", updatedContentSuggestions.map(item => item.id));

    // Close the dialog
    setCreatePostListDialogOpen(false);
  };

  // Handle additional post generation
  const handleGenerateAdditionalPosts = async () => {
    if (!additionalPostQuantity || additionalPostQuantity <= 0) {
      toast.error('Vui lòng nhập số lượng bài viết hợp lệ');
      return;
    }

    setIsGeneratingPosts(true);
    try {
      // Get current form data
      const formData = getValues();
      
      // Transform campaign data to content assistant format
      const contentAssistantFormData = transformCampaignToContentAssistant(formData as CampaignFormData);
      
      // Build research data
      const researchData = await buildStepResearchData(contentAssistantFormData, true);
      // Create multiple content assistants using Promise.allSettled
      const createPromises = Array.from({ length: additionalPostQuantity }, () =>
        createContentAssistant(researchData as CreateContentAssistantRequest)
      );
      
      const results = await Promise.allSettled(createPromises);
      
      // Extract IDs from successful results
      const createdIds: string[] = [];
      const failedCount = results.filter(result => result.status === 'rejected').length;
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value?.data?.id) {
          createdIds.push(result.value.data.id.toString());
        }
      });
      
      if (failedCount > 0) {
        console.warn(`${failedCount} out of ${results.length} posts failed to create`);
      }

      if (createdIds.length === 0) {
        toast.error('Không thể tạo bài viết nào');
        return;
      }

      // Fetch detailed information for each created ID using the same logic as useEffect
      const promises = createdIds.map(async (contentId: string) => {
        const response = await getContentAssistantList({
          id: Number(contentId),
        });
        
        if (response.data && response.data.length > 0) {
          const item = response.data[0]; // Lấy item đầu tiên vì filter theo ID
          return {
            id: item.id.toString(),
            topic: item.topic,
            main_seo_keyword: item.main_seo_keyword,
            secondary_seo_keywords: item.secondary_seo_keywords || [],
            customer_journey: item.customer_journey || [],
            post_type: item.post_type,
            content_tone: item.content_tone || [],
            ai_notes_write_article: item.ai_notes_write_article,
          } as unknown as ContentSuggestionItem;
        }
        return null;
      });

      const detailedResults = await Promise.all(promises);
      const newContentSuggestions = detailedResults.filter(item => item !== null) as ContentSuggestionItem[];

      // Add new content suggestions to the existing list
      setContentSuggestions(prev => [...prev, ...newContentSuggestions]);
      
      // Update form field ai_content_suggestions
      const updatedContentSuggestions = [...contentSuggestions, ...newContentSuggestions].map(item => item.id);
      setValue("ai_content_suggestions", updatedContentSuggestions);
      
      toast.success(`Đã tạo thành công ${newContentSuggestions.length} bài viết`);
      setCreateAdditionalPost(false);
      setAdditionalPostQuantity(0);
    } catch (error) {
      console.error('Error generating additional posts:', error);
      toast.error('Có lỗi xảy ra khi tạo bài viết');
    } finally {
      setIsGeneratingPosts(false);
    }
  };

  // Table configuration
  const TABLE_CONFIG: TableConfig[] = [
    {
      key:'id',
      label:'ID',
      align:'left',
      width:100,
    },
    { 
      key: "topic", 
      label: "Chủ đề", 
      align: "left", 
      width: 180,
      render: (item) => {
        const suggestion = item as ContentSuggestionItem;
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 180
            }}
          >
            {suggestion.topic}
          </Typography>
        );
      }
    },
    { 
      key: "main_seo_keyword", 
      label: "Từ khóa chính", 
      align: "left", 
      width: 140,
      render: (item) => {
        const suggestion = item as ContentSuggestionItem;
        return (
          <Chip
            label={suggestion.main_seo_keyword}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ 
              maxWidth: 130,
              '& .MuiChip-label': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%'
              }
            }}
          />
        );
      }
    },
    { 
      key: "secondary_seo_keywords", 
      label: "Từ khóa phụ", 
      align: "left", 
      width: 400,
      render: (item) => {
        const suggestion = item as ContentSuggestionItem;
        return (
          <Stack 
            direction="row" 
            spacing={0.5} 
            sx={{ 
              flexWrap: 'wrap', 
              gap: 0.5
            }}
          >
            {suggestion.secondary_seo_keywords.map((keyword, index) => (
              <Chip
                key={index}
                label={keyword}
                size="small"
                variant="outlined"
                color="secondary"
                sx={{ 
                  maxWidth: 90,
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%'
                  }
                }}
              />
            ))}
          </Stack>
        );
      }
    },
    { 
      key: "customer_journey", 
      label: "Giai đoạn khách hàng", 
      width: 200,
      render: (item) => {
        const suggestion = item as ContentSuggestionItem;
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 180
            }}
          >
            {suggestion.customer_journey.map(cj => cj.customer_journey_id.name).join(', ')}
          </Typography>
        );
      }
    },
    { 
      key: "post_type", 
      label: "Loại bài viết", 
      align: "center", 
      width: 150,
      render: (item) => {
        const suggestion = item as ContentSuggestionItem;
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 140
            }}
          >
            {POST_TYPE_OPTIONS.find(option => option.value === suggestion.post_type)?.label || suggestion.post_type}
          </Typography>
        );
      }
    },
    { 
      key: "content_tone", 
      label: "Văn phong AI", 
      align: "left", 
      width: 200,
      render: (item) => {
        const suggestion = item as ContentSuggestionItem;
        return (
          <Typography 
            variant="body2"
            sx={{ 
              overflow: 'auto',
              maxWidth: 180
            }}
          >
            {suggestion.content_tone.map(ct => ct.content_tone_id.tone_description).map(item => (
              <Typography variant="body2" key={item}>
                {item}
              </Typography>
            ))}
          </Typography>
        );
      }
    },
    { 
      key: "ai_notes_write_article", 
      label: "Lưu ý bài viết", 
      align: "left", 
      width: 200,
      render: (item) => {
        const suggestion = item as ContentSuggestionItem;
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.875rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 180
            }}
          >
            {suggestion.ai_notes_write_article || ""}
          </Typography>
        );
      }
    },
    {
      key: "actions",
      label: "Thao tác",
      align: "center",
      width: 80,
      sticky: "right",
      render: (item) => {
        const suggestion = item as ContentSuggestionItem;
        return (
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleEditItem(suggestion)}
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'primary.lighter' 
                } 
              }}
            >
              <Iconify icon="solar:pen-bold" width={18} />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteItem(suggestion.id)}
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
      <Stack spacing={2}>
        <RHFTextField
          name="ai_create_post_detail_notes"
          placeholder="Viết thêm mô tả chi tiết và lưu ý bài viết"
          multiline
          minRows={1}
          maxRows={4}
          InputProps={{
            startAdornment: (
              <Iconify
                icon="solar:magic-stick-3-bold"
                sx={{
                  color: "primary.main",
                  mr: 1,
                  fontSize: 20,
                }}
              />
            ),
            sx: {
              alignItems: "flex-start",
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              transition: "all 0.3s ease",
              backgroundColor: "background.paper",
              "&:hover": {
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              },
              "&.Mui-focused": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
            },
          }}
        />
      </Stack>

      {/* Content Suggestions Table */}
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Danh sách bài viết
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={() => setCreateAdditionalPost(true)}
            >
              Thêm bài viết
            </Button>
            <Button
              variant="outlined"
              sx={{paddingInline: 0, minWidth: 32}}
              onClick={() => setCreatePostListDialogOpen(true)}
            >
              <Iconify icon="mingcute:add-line" />
            </Button>
          </Stack>
        </Stack>
        <CustomTable
          data={contentSuggestions}
          tableConfig={TABLE_CONFIG}
          loading={isLoadingContentAssistant}
        />
      </Box>

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
            Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không
            thể hoàn tác.
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

      {/* Edit Drawer */}
      <Drawer
        anchor="right"
        open={editDrawerOpen}
        onClose={handleCloseEditDrawer}
        PaperProps={{
          sx: { width: 500 },
        }}
      >
        <FormProvider {...editForm}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Chỉnh sửa bài viết
            </Typography>

            <Stack spacing={3}>
              <RHFTextField
                name="topic"
                label="Chủ đề"
                placeholder="Nhập chủ đề bài viết"
              />

              <RHFTextField
                name="main_seo_keyword"
                label="Từ khóa chính"
                placeholder="Nhập từ khóa chính"
              />

              <RHFAutocomplete
                name="secondary_seo_keywords"
                label="Từ khóa phụ"
                placeholder="+ Thêm từ khóa"
                multiple
                freeSolo
                disableCloseOnSelect
                options={[]}
                getOptionLabel={(option: string) => option}
                renderOption={(
                  props: React.HTMLAttributes<HTMLLIElement>,
                  option: string
                ) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />

              <RHFMultiSelect
                name="content_tone"
                label="Văn phong AI"
                options={
                  contentToneOptions?.map((tone) => ({
                    value: tone.id,
                    label: tone.tone_description,
                  })) || []
                }
                chip
                slotProps={{
                  chip: {
                    sx: {
                      maxWidth: 500,
                      "& .MuiChip-label": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    },
                  },
                  select: {
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          "& .MuiMenuItem-root": {
                            maxWidth: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                        },
                      },
                    },
                  },
                }}
              />

              <RHFTextField
                name="ai_notes_write_article"
                label="Lưu ý bài viết"
                placeholder="Nhập lưu ý cho bài viết"
                multiline
                minRows={3}
                maxRows={6}
              />
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              sx={{
                mt: 4,
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Button variant="contained" onClick={handleSaveEdit} fullWidth>
                Lưu thay đổi
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseEditDrawer}
                fullWidth
              >
                Hủy
              </Button>
            </Stack>
          </Box>
        </FormProvider>
      </Drawer>

      {/* Content Posts Selection Dialog */}
      {createPostListDialogOpen &&
      <PostSelectionDialog
          open={createPostListDialogOpen}
          onClose={() => setCreatePostListDialogOpen(false)}
          onConfirm={handlePostsConfirm}
          postType={postType}
          omniChannel={omniChannel}
        />
      }

      {/* Additional Post Generation Dialog */}
      <Dialog
        open={createAdditionalPost}
        onClose={() => setCreateAdditionalPost(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thêm bài viết</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Nhập số lượng bài viết cần tạo thêm:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Số lượng bài viết"
            type="number"
            fullWidth
            variant="outlined"
            value={additionalPostQuantity}
            onChange={(e) => setAdditionalPostQuantity(parseInt(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCreateAdditionalPost(false)}
            disabled={isGeneratingPosts}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleGenerateAdditionalPosts}
            variant="contained"
            disabled={isGeneratingPosts}
            startIcon={isGeneratingPosts ? <CircularProgress size={16} /> : null}
          >
            {isGeneratingPosts ? 'Đang tạo...' : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>

    </Stack>
  );
}
