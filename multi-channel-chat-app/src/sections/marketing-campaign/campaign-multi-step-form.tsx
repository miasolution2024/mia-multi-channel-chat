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
import { useCallback, useState } from "react";
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
import { POST_TYPE } from "@/constants/auto-post";
import { CreateContentAssistantResponse, CreateContentAssistantRequest } from "@/sections/content-assistant/types/content-assistant-create";
import { useRouter } from "next/navigation";
import { paths } from "@/routes/path";

export function CampaignMultiStepForm({ editData }: { editData?: null }) {
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

  const defaultValues = getDefaultValues(editData);

  const methods = useForm<CampaignFormData>({
    resolver: zodResolver(CampaignSchema),
    defaultValues,
    mode: "onChange",
    shouldFocusError: true,
  });

  const { handleSubmit } = methods;

  const handleSubmitPost = async () => {
    try {
      // Handle final form submission
    } catch (error) {
      console.error(error);
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
    if (!hasStepDataChanged(data, cachedStepData[CAMPAIGN_STEP_KEY.CAMPAIGN_INFO] || null, CAMPAIGN_STEP_KEY.CAMPAIGN_INFO)) {
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

    // Check if data has changed compared to cached data
    if (!hasStepDataChanged(data, cachedStepData[CAMPAIGN_STEP_KEY.POST_CONTENT_INFO] || null, CAMPAIGN_STEP_KEY.POST_CONTENT_INFO)) {
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
        const contentAssistantFormData = {
          post_type: data.post_type || POST_TYPE.FACEBOOK_POST,
          topic: data.post_topic,
          main_seo_keyword: data.main_seo_keyword,
          secondary_seo_keywords: data.secondary_seo_keywords || [],
          customer_group: data.customer_group || [],
          services: data.services || [],
          customer_journey: data.customer_journey,
          content_tone: data.content_tone || [],
          ai_rule_based: data.ai_rule_based || [],
          ai_notes_make_outline: data.ai_create_post_list_notes || "",
          omni_channels: [data.omni_channels],
          video: [],
          // Required fields for FormData type
          id: null,
          status: "draft",
          outline_post: "",
          post_goal: "",
          post_notes: "",
          ai_notes_write_article: "",
          post_content: "",
          ai_notes_create_image: "",
          media: [],
          media_generated_ai: [],
          is_generated_by_AI: false,
        };

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
      } catch (error) {
        console.error("Error creating content assistants:", error);
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
    router.push(paths.dashboard.marketingCampaign.root)
    
  },
    [methods, router, selectedContentSuggestions, updateCampaignHandler],
  )
  

  console.log('selectedContentSuggestions', selectedContentSuggestions);
  const handleStepProcess = useCallback(
    async (data: CampaignFormData, currentStep: string) => {
      setIsNextLoading(true);
      try {
        if (currentStep === CAMPAIGN_STEP_KEY.CAMPAIGN_INFO) {
          await handleCampaignInfoStep(data);
        } else if (currentStep === CAMPAIGN_STEP_KEY.POST_CONTENT_INFO) {
          await handlePostContentInfoStep(data);
        }
      } catch (error) {
        console.error("Error updating campaign:", error);
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
    [CAMPAIGN_STEP_KEY.CREATE_POST_LIST]: "Tạo bài viết (2)",
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
