"use client";

import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { POST_STEP } from "@/constants/auto-post";

// ----------------------------------------------------------------------

const STEPS = [
  {
    value: POST_STEP.RESEARCH_ANALYSIS,
    label: "Nghiên cứu & phân tích",
    stepNumber: 1,
  },
  {
    value: POST_STEP.MAKE_OUTLINE,
    label: "Outline bài viết",
    stepNumber: 2,
  },
  {
    value: POST_STEP.WRITE_ARTICLE,
    label: "Viết bài",
    stepNumber: 3,
  },
  // {
  //   value: POST_STEP.GENERATE_IMAGE,
  //   label: "Tạo sinh hình ảnh",
  //   stepNumber: 4,
  // },
  // {
  //   value: POST_STEP.PUBLISHED,
  //   label: "Đăng bài",
  //   stepNumber: 6,
  // },
];

// ----------------------------------------------------------------------

type Props = {
  currentStep: (typeof POST_STEP)[keyof typeof POST_STEP];
};

export function ContentStepper({ currentStep }: Props) {
  const activeStep =
    STEPS.find((step) => step.value === currentStep)?.stepNumber || 0;

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Stepper activeStep={activeStep - 1} alternativeLabel>
        {STEPS.map((step) => (
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
  );
}
