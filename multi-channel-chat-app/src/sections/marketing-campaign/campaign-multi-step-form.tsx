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
} from "./utils";
import { PostContentInfoStep } from "./components/steps/post-content-info-step";

export function CampaignMultiStepForm({ editData }: { editData?: null }) {
  const [activeStep, setActiveStep] = useState(CAMPAIGN_STEP_KEY.CAMPAIGN_INFO);
  const isProcessing = false;

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
      let nextStep: string;
      if (currentStep === CAMPAIGN_STEP_KEY.CAMPAIGN_INFO) {
        nextStep = CAMPAIGN_STEP_KEY.POST_CONTENT_INFO;
      } else if (currentStep === CAMPAIGN_STEP_KEY.POST_CONTENT_INFO) {
        nextStep = CAMPAIGN_STEP_KEY.CREATE_POST_LIST;
      } else {
        return;
      }
      setActiveStep(nextStep);
    },
    []
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
        return;
      case CAMPAIGN_STEP_KEY.POST_CONTENT_INFO:
        await handleStepProcess(formData, CAMPAIGN_STEP_KEY.POST_CONTENT_INFO);
        return;
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
    [CAMPAIGN_STEP_KEY.CREATE_POST_LIST]: <></>,
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
            disabled={isProcessing}
            sx={{ minWidth: 150, borderRadius: 2 }}
          >
            {renderLabelNextStep[activeStep]}
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
}
