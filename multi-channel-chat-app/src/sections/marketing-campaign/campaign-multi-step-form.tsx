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
  hasStepDataChanged,
  extractStepData,
} from "./utils";
import { PostContentInfoStep } from "./components/steps/post-content-info-step";
import { CreatePostListStep } from "./components/steps/create-post-list-step";
import { useCreateCampaign } from "@/hooks/apis/use-create-campaign";
import { useUpdateCampaign } from "@/hooks/apis/use-update-campaign";
import { CampaignRequest, createCampaignN8N } from "@/actions/auto-mia";
import { useGetCampaignById } from "@/hooks/apis/use-get-campaign-by-id";
import { LoadingOverlay } from "@/components/loading-overlay";

export function CampaignMultiStepForm({ editData }: { editData?: null }) {
  const [activeStep, setActiveStep] = useState(
    CAMPAIGN_STEP_KEY.CAMPAIGN_INFO
  );
  const [isNextLoading, setIsNextLoading] = useState(false);
  
  // Cache for storing step data after successful API calls
  const [cachedStepData, setCachedStepData] = useState<Record<string, Partial<CampaignFormData> | null>>({});

  const { createCampaignHandler, isLoading: isCreatingCampaign } =
    useCreateCampaign();
  const {
    updateCampaign: updateCampaignHandler,
    isLoading: isUpdatingCampaign,
  } = useUpdateCampaign();

  const { fetchData: getCampaignById } = useGetCampaignById();

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

  // Helper function for N8N processing - không cần useCallback vì không được truyền như prop
  const processN8NStep = async (campaignId: number, step: number) => {
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

  // Step 1 handler - không cần useCallback vì chỉ được gọi trong handleStepProcess
  const handleCampaignInfoStep = async (data: CampaignFormData) => {
    // Check if data has changed compared to cached data
    if (!hasStepDataChanged(data, cachedStepData[CAMPAIGN_STEP_KEY.CAMPAIGN_INFO] || null, CAMPAIGN_STEP_KEY.CAMPAIGN_INFO)) {
      // Data hasn't changed, just move to next step
      setActiveStep(CAMPAIGN_STEP_KEY.POST_CONTENT_INFO);
      return;
    }

    const apiData = buildCampaignDataStep1(data);
    const response = await createCampaignHandler(apiData);

    if (response?.data?.id) {
      methods.setValue("id", response.data.id);
      
      const n8nSuccess = await processN8NStep(response.data.id, 1);
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

  // Step 2 handler - không cần useCallback vì chỉ được gọi trong handleStepProcess
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

    const n8nSuccess = await processN8NStep(campaignId, 2);
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

  // Cần useCallback vì được gọi trong handleNext và có dependencies
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
        break;
      default:
        break;
    }
  }, [activeStep, handleStepProcess, methods]);

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
    [CAMPAIGN_STEP_KEY.CREATE_POST_LIST]: <CreatePostListStep />,
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
            disabled={isCreatingCampaign || isUpdatingCampaign}
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
