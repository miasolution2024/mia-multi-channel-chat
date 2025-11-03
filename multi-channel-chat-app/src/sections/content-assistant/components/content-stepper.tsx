"use client";

import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import Stepper from "@mui/material/Stepper";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { POST_STEP, POST_TYPE } from "@/constants/auto-post";
import { useMemo } from "react";

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

type Props = {
  currentStep: (typeof POST_STEP)[keyof typeof POST_STEP];
  postType: (typeof POST_TYPE)[keyof typeof POST_TYPE];
};

export function ContentStepper({ currentStep, postType }: Props) {

  const STEPS = useMemo(() => {
    return [
      {
        value: POST_STEP.RESEARCH_ANALYSIS,
        label: "Nghiên cứu & phân tích",
        stepNumber: 1,
        isActive: true,
      },
      {
        value: POST_STEP.MAKE_OUTLINE,
        label: "Outline bài viết",
        stepNumber: 2,
        isActive: true,
      },
      {
        value: POST_STEP.WRITE_ARTICLE,
        label: "Viết bài",
        stepNumber: 3,
        isActive: true,
      },
      // {
      //   value: POST_STEP.GENERATE_IMAGE,
      //   label: "Tạo sinh hình ảnh",
      //   stepNumber: 4,
      // },
      {
        value: POST_STEP.HTML_CODING,
        label: "Dịnh dạng HTML",
        stepNumber: 5,
        isActive: postType === POST_TYPE.SEO_POST,
      },
      // {
      //   value: POST_STEP.PUBLISHED,
      //   label: "Đăng bài",
      //   stepNumber: 6,
      // },
    ];
  }, [postType])

  const activeStep =
    STEPS.find((step) => step.value === currentStep)?.stepNumber || 0;

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <Stepper activeStep={activeStep - 1} alternativeLabel>
        {STEPS.filter((step) => step.isActive).map((step) => (
          <Step key={step.value} >
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
