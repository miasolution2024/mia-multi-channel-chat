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
import { CampaignInfoStep,  } from "./components/steps/campaign-info-step";
import {
  CampaignFormData,
  CampaignSchema,
  getDefaultValues,
  getFieldsForStep,
  buildCampaignDataStep1,
  buildCampaignDataStep2
} from "./utils";
import { PostContentInfoStep } from "./components/steps/post-content-info-step";
import { CreatePostListStep } from "./components/steps/create-post-list-step";
import { useCreateCampaign } from "@/hooks/apis/use-create-campaign";
import { useUpdateCampaign } from "@/hooks/apis/use-update-campaign";

export function CampaignMultiStepForm({ editData }: { editData?: null }) {
  const [activeStep, setActiveStep] = useState(CAMPAIGN_STEP_KEY.CREATE_POST_LIST);
  const { createCampaignHandler, isLoading: isCreatingCampaign } = useCreateCampaign();
  const { updateCampaign: updateCampaignHandler, isLoading: isUpdatingCampaign } = useUpdateCampaign();

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
    const currentIndex = CAMPAIGN_STEPS.findIndex(step => step.value === activeStep);
    if (currentIndex > 0) {
      setActiveStep(CAMPAIGN_STEPS[currentIndex - 1].value);
    }
  };

  const handleStepProcess = useCallback(
    async (data: CampaignFormData, currentStep: string) => {
      if (currentStep === CAMPAIGN_STEP_KEY.CAMPAIGN_INFO) {
        try {
          // Transform form data using utility function
          const apiData = buildCampaignDataStep1(data);
          
          // Call create campaign API
          const response = await createCampaignHandler(apiData);
          
          if (response?.data?.id) {
            // Set the ID in the form data
            methods.setValue("id", response.data.id);
            
            setActiveStep(CAMPAIGN_STEP_KEY.POST_CONTENT_INFO);
          }
        } catch (error) {
          console.error("Error creating campaign:", error);
          toast.error("Có lỗi xảy ra khi tạo chiến dịch");
          return;
        }
      } else if (currentStep === CAMPAIGN_STEP_KEY.POST_CONTENT_INFO) {
        try {
          const campaignId = methods.getValues("id");
          if (!campaignId) {
            toast.error("Không tìm thấy ID chiến dịch");
            return;
          }
          
          // Transform form data for Step 2 update
          const apiData = buildCampaignDataStep2(data, campaignId.toString());
          
          // Call update campaign API
          await updateCampaignHandler(campaignId, apiData);
          
          setActiveStep(CAMPAIGN_STEP_KEY.CREATE_POST_LIST);
        } catch (error) {
          console.error("Error updating campaign:", error);
          toast.error("Có lỗi xảy ra khi cập nhật chiến dịch");
          return;
        }
      }
    },
    [createCampaignHandler, methods, updateCampaignHandler]
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
  }

  if (!activeStep) return null;

  return (
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
  );
}
