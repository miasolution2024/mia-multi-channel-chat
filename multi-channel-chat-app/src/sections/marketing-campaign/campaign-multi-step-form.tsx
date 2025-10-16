"use client";
import { Form } from "@/components/hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/components/snackbar";
import {
  Box,
  Button,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useCallback, useState, useEffect, memo, useMemo } from "react";
import {
  CAMPAIGN_STEP_KEY,
  CAMPAIGN_STEPS,
} from "@/constants/marketing-compaign";
import { CampaignInfoStep } from "./components/steps/campaign-info-step";
import {
  CampaignFormData,
  CampaignSchema,
  getDefaultValues,
  getFieldsForStep,
  buildCampaignDataStep1,
  buildCampaignDataStep2,
  buildCampaignDataStep3,
  hasStepDataChanged,
  extractStepData,
  transformCampaignToContentAssistant,
  createDebouncedDateValidation,
  isDateRangeValid,
} from "./utils";
import { PostContentInfoStep } from "./components/steps/post-content-info-step";
import { CreatePostListStep } from "./components/steps/create-post-list-step";
import { useCreateCampaign } from "@/hooks/apis/use-create-campaign";
import { useUpdateCampaign } from "@/hooks/apis/use-update-campaign";
import { CampaignRequest, createCampaignN8N, createPost, PostRequest } from "@/actions/auto-mia";
import { useGetCampaignById } from "@/hooks/apis/use-get-campaign-by-id";
import { LoadingOverlay } from "@/components/loading-overlay";
import { useCreateContentAssistant } from "@/hooks/apis/use-create-content-assistant";
import { buildStepResearchData } from "@/sections/content-assistant/utils";
import { CreateContentAssistantResponse, CreateContentAssistantRequest } from "@/sections/content-assistant/types/content-assistant-create";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/path";
import { Campaign } from "@/types/campaign";

function CampaignMultiStepFormComponent({ editData }: { editData?: Campaign | null }) {
  const [activeStep, setActiveStep] = useState(
    CAMPAIGN_STEP_KEY.CAMPAIGN_INFO
  );
    const router = useRouter();

  const [isNextLoading, setIsNextLoading] = useState(false);
  
  // Cache for storing step data after successful API calls
  const [cachedStepData, setCachedStepData] = useState<Record<string, Partial<CampaignFormData> | null>>({});
    const [selectedContentSuggestions, setSelectedContentSuggestions] = useState<(string | number)[]>([]);


  const { createCampaignHandler, isLoading: isCreatingCampaign } =
    useCreateCampaign();
  const {
    updateCampaign: updateCampaignHandler,
    isLoading: isUpdatingCampaign,
  } = useUpdateCampaign();

  const { fetchData: getCampaignById } = useGetCampaignById();
  const { createContentAssistant, isLoading: isCreatingContentAssistant } = useCreateContentAssistant();

  const defaultValues = useMemo(() => getDefaultValues(editData), [editData]);

  const methods = useForm<CampaignFormData>({
    resolver: zodResolver(CampaignSchema),
    defaultValues,
    mode: "onChange",
    shouldFocusError: true,
  });

  const { handleSubmit, watch, setError, clearErrors, formState, reset } = methods;
  const startDate = watch("start_date");
  const endDate = watch("end_date");

  // Reset form when editData changes
  useEffect(() => {
    if (editData) {
      const newDefaultValues = getDefaultValues(editData);
      reset(newDefaultValues);
      setActiveStep(editData?.current_step || CAMPAIGN_STEP_KEY.POST_CONTENT_INFO);
    }
  }, [editData, reset]);

  useEffect(() => {
    // Sử dụng utility function từ utils
    const cleanup = createDebouncedDateValidation(
      startDate, 
      endDate, 
      setError, 
      clearErrors, 
      formState
    );

    return cleanup;
  }, [startDate, endDate, setError, clearErrors, formState]);

  useEffect(() => {
    return () => {
      methods.reset({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  

  const handleSubmitPost = async () => {
    try {
      // Handle final form submission
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
      throw error;
    }
  };

  const onSubmit = handleSubmit(handleSubmitPost);
  const handleBack = () => {
    if (!activeStep) return;
    const currentIndex = CAMPAIGN_STEPS.findIndex(
      (step) => step.value === activeStep
    );
    if (currentIndex > 0) {
      setActiveStep(CAMPAIGN_STEPS[currentIndex - 1].value);
    }
  };

  const processN8NCreateCampaignStep = async (campaignId: number, step: number) => {
    const inputN8NData: CampaignRequest[] = [
      {
        campaignId,
        step,
      },
    ];
    const n8nResponse = await createCampaignN8N(inputN8NData);
    if (!n8nResponse?.success) {
      toast.error(n8nResponse?.message || "Đã có lỗi xảy ra");
      return false;
    }
    return true;
  };

  const handleCampaignInfoStep = async (data: CampaignFormData) => {
    // If editData exists, skip API call and use editData.id
    if (editData?.id) {
      methods.setValue("id", editData.id);
      
      // Cache the step data for edit mode
      setCachedStepData(prev => ({
        ...prev,
        [CAMPAIGN_STEP_KEY.CAMPAIGN_INFO]: extractStepData(data, CAMPAIGN_STEP_KEY.CAMPAIGN_INFO)
      }));
      
      setActiveStep(CAMPAIGN_STEP_KEY.POST_CONTENT_INFO);
      return;
    }

    // Build previous data for comparison: use cached step data if available; otherwise null for new campaigns
    const cachedData = cachedStepData[CAMPAIGN_STEP_KEY.CAMPAIGN_INFO];
    const formValues = methods.getValues();
    const previousCampaignInfoData: CampaignFormData | null = cachedData
      ? { ...formValues, ...cachedData } as CampaignFormData
      : null;

    if (!hasStepDataChanged(
      data,
      previousCampaignInfoData,
      CAMPAIGN_STEP_KEY.CAMPAIGN_INFO
    )) {
      setActiveStep(CAMPAIGN_STEP_KEY.POST_CONTENT_INFO);
      return;
    }

    const apiData = buildCampaignDataStep1(data);
    const response = await createCampaignHandler(apiData);

    if (response?.data?.id) {
      methods.setValue("id", response.data.id);
      
      const n8nSuccess = await processN8NCreateCampaignStep(response.data.id, 1);
      if (!n8nSuccess) {
        return;
      }
      
      const newCampaignDetail = await getCampaignById(response.data.id.toString());
      if(newCampaignDetail) {
        methods.setValue("main_seo_keyword", newCampaignDetail.main_seo_keyword || "");
        methods.setValue("secondary_seo_keywords", newCampaignDetail.secondary_seo_keywords || []);
      }
      
      // Cache the step data after successful API call
      setCachedStepData(prev => ({
        ...prev,
        [CAMPAIGN_STEP_KEY.CAMPAIGN_INFO]: extractStepData(data, CAMPAIGN_STEP_KEY.CAMPAIGN_INFO)
      }));
      
      setActiveStep(CAMPAIGN_STEP_KEY.POST_CONTENT_INFO);
      return;
    }
  };

  const handlePostContentInfoStep = async (data: CampaignFormData) => {
    const campaignId = methods.getValues("id");
    if (!campaignId) {
      toast.error("Không tìm thấy ID chiến dịch");
      return;
    }
    // Build previous data for comparison: use cached step data if available; otherwise null for new campaigns
    const cachedData = cachedStepData[CAMPAIGN_STEP_KEY.POST_CONTENT_INFO];
    const formValues = methods.getValues();
    const previousPostContentInfoData: CampaignFormData | null = cachedData
      ? { ...formValues, ...cachedData } as CampaignFormData
      : null;

    // Check if data has changed compared to cached or initial edit data
    if (!hasStepDataChanged(
      data,
      previousPostContentInfoData,
      CAMPAIGN_STEP_KEY.POST_CONTENT_INFO
    )) {
      // Data hasn't changed, just move to next step
      setActiveStep(CAMPAIGN_STEP_KEY.CREATE_POST_LIST);
      return;
    }

    const apiData = buildCampaignDataStep2(data, campaignId.toString());
    await updateCampaignHandler(campaignId, apiData);
    
    // CREATE MULTIPLE CONTENT ASSITANTS
    const needCreatePostAmount = data.need_create_post_amount;
    if (needCreatePostAmount && needCreatePostAmount > 0) {
      try {
        // Transform campaign data to content assistant FormData format
        const contentAssistantFormData = transformCampaignToContentAssistant(data);
      
        // Build the research data for content assistant creation
        const researchData = await buildStepResearchData(contentAssistantFormData, true);
        
        // Create multiple content assistants using Promise.all
        const createPromises = Array.from({ length: needCreatePostAmount }, () =>
          createContentAssistant(researchData as CreateContentAssistantRequest)
        );

        const results = await Promise.all(createPromises);
        
        // Extract IDs from successful creations
        const createdIds = results
          .filter((result: CreateContentAssistantResponse | null) => result && result.data && result.data.id)
          .map((result: CreateContentAssistantResponse | null) => result!.data.id.toString());

        // Set the created IDs to ai_content_suggestions
        methods.setValue('ai_content_suggestions', createdIds);

      } catch {
        toast.error("Có lỗi xảy ra khi tạo nội dung trợ lý");
      }
    }

    const n8nSuccess = await processN8NCreateCampaignStep(campaignId, 2);
    if (!n8nSuccess) {
      return;
    }
    
    const newCampaignDetail = await getCampaignById(campaignId.toString());
    if(newCampaignDetail) {
      methods.setValue("description", newCampaignDetail.description || "");
    }
    
    // Cache the step data after successful API call
    setCachedStepData(prev => ({
      ...prev,
      [CAMPAIGN_STEP_KEY.POST_CONTENT_INFO]: extractStepData(data, CAMPAIGN_STEP_KEY.POST_CONTENT_INFO)
    }));
    
    setActiveStep(CAMPAIGN_STEP_KEY.CREATE_POST_LIST);
    return;
  };

  const handleCreatePostListStep = useCallback(
    async (data: CampaignFormData) => {
    const campaignId = methods.getValues("id");
    // Cần reset lại form data khi vào chỉnh sửa các campaign khác
    if (!campaignId) {
      toast.error("Không tìm thấy ID chiến dịch");
      return;
    }

    // Use the new buildCampaignDataStep3 function
    const updateData = buildCampaignDataStep3(data, campaignId.toString(), selectedContentSuggestions);

    await updateCampaignHandler(campaignId, updateData);

    // call n8n create post
    const n8nPostInput: PostRequest = selectedContentSuggestions.map((postId) => ({
      id: Number(postId),
      startStep: 1,
      endStep: 4,
    }));
    createPost(n8nPostInput);
    toast.success(
        `Đã bắt đầu tạo ${n8nPostInput.length} bài viết. Quá trình sẽ hoàn thành trong khoảng 10 phút.`
    );
    methods.reset({});
    setTimeout(() => {
      router.push(paths.dashboard.marketingCampaign.root)
    }, 1000);
    },
    [methods, router, selectedContentSuggestions, updateCampaignHandler],
  )
  

  const handleStepProcess = useCallback(
    async (data: CampaignFormData, currentStep: string) => {
      setIsNextLoading(true);
      try {
        if (currentStep === CAMPAIGN_STEP_KEY.CAMPAIGN_INFO) {
          await handleCampaignInfoStep(data);
        } else if (currentStep === CAMPAIGN_STEP_KEY.POST_CONTENT_INFO) {
          await handlePostContentInfoStep(data);
        }
      } catch {
        toast.error("Có lỗi xảy ra khi cập nhật chiến dịch");
        return;
      } finally {
        setIsNextLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createCampaignHandler, getCampaignById, methods, updateCampaignHandler]
  );

  const handleNext = useCallback(async () => {
    if (!activeStep) return;
    
    // Check date validation first for CAMPAIGN_INFO step
    if (activeStep === CAMPAIGN_STEP_KEY.CAMPAIGN_INFO) {
      const formData = methods.getValues();
      const { start_date, end_date } = formData;
      
      if (!isDateRangeValid(start_date, end_date)) {
        // Set the error manually to ensure it shows in the UI
        if (start_date && end_date && start_date > end_date) {
          methods.setError('end_date', {
            type: 'manual',
            message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu'
          });
        }
        
        toast.error('Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc');
        return;
      }
    }

    const fieldsToValidate = getFieldsForStep(activeStep);
    const isStepValid = await methods.trigger(fieldsToValidate);
    
    if (!isStepValid) {
      return;
    }

    const formData = methods.getValues();
    switch (activeStep) {
      case CAMPAIGN_STEP_KEY.CAMPAIGN_INFO:
        await handleStepProcess(formData, CAMPAIGN_STEP_KEY.CAMPAIGN_INFO);
        break;
      case CAMPAIGN_STEP_KEY.POST_CONTENT_INFO:
        await handleStepProcess(formData, CAMPAIGN_STEP_KEY.POST_CONTENT_INFO);
        break;
      case CAMPAIGN_STEP_KEY.CREATE_POST_LIST:
        await handleCreatePostListStep(formData);
        break;
      default:
        break;
    }
  }, [activeStep, handleStepProcess, methods, handleCreatePostListStep]);

  const isFirstStep = activeStep === CAMPAIGN_STEP_KEY.CAMPAIGN_INFO;

  const getLoadingMessage = () => {
    if (activeStep === CAMPAIGN_STEP_KEY.CAMPAIGN_INFO) {
      return "Đang khởi tạo thông tin chiến dịch...";
    } else if (activeStep === CAMPAIGN_STEP_KEY.POST_CONTENT_INFO) {
      return "Đang tạo nội dung bài viết";
    }

    return "Đang xử lý...";
  };

  const getActiveStep = () => {
    return CAMPAIGN_STEPS.findIndex((step) => step.value === activeStep);
  };

  const renderStepContent = {
    [CAMPAIGN_STEP_KEY.CAMPAIGN_INFO]: <CampaignInfoStep />,
    [CAMPAIGN_STEP_KEY.POST_CONTENT_INFO]: <PostContentInfoStep />,
    [CAMPAIGN_STEP_KEY.CREATE_POST_LIST]: <CreatePostListStep 
      selectedContentSuggestions={selectedContentSuggestions}
      setSelectedContentSuggestions={setSelectedContentSuggestions}
    />,
  };

  const renderLabelNextStep = {
    [CAMPAIGN_STEP_KEY.CAMPAIGN_INFO]: "Lên thông tin bài viết",
    [CAMPAIGN_STEP_KEY.POST_CONTENT_INFO]: "Tạo bài viết",
    [CAMPAIGN_STEP_KEY.CREATE_POST_LIST]: `Tạo bài viết (${selectedContentSuggestions.length})`,
  };

  if (!activeStep) return null;

  return (
    <>
    <LoadingOverlay
        open={isNextLoading}
        title="Đang xử lý..."
        description={getLoadingMessage()}
      />
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack>
        <Box sx={{ width: "100%", mb: 4 }}>
          <Stepper activeStep={getActiveStep()} alternativeLabel>
            {CAMPAIGN_STEPS.map((step) => (
              <Step key={step.value}>
                <StepLabel
                  sx={{
                    cursor: "default",
                    "& .MuiStepLabel-label": {
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    },
                    "& .MuiStepIcon-text": {
                      fill: "white",
                    },
                    "& .MuiStepIcon-root": {
                      fontSize: "2rem",
                    },
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {step.label}
                    </Typography>
                  </Box>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderStepContent[activeStep]}
        </Box>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{
            position: "sticky",
            bottom: 0,
            backgroundColor: "background.paper",
            py: 2,
            mb: 2,
            zIndex: 1000,
          }}
        >
          <Button
            size="large"
            variant="outlined"
            onClick={handleBack}
            disabled={isFirstStep}
            sx={{ minWidth: 150, borderRadius: 2 }}
          >
            Quay lại
          </Button>
          <Button
            size="large"
            variant="contained"
            onClick={handleNext}
            disabled={isCreatingCampaign || isUpdatingCampaign || isCreatingContentAssistant}
            sx={{ minWidth: 150, borderRadius: 2 }}
          >
            {renderLabelNextStep[activeStep]}
          </Button>
        </Stack>
      </Stack>
    </Form>
    </>
  );
}

export const CampaignMultiStepForm = memo(CampaignMultiStepFormComponent);
