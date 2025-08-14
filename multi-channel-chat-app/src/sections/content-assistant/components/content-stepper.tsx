'use client';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

const steps = [
  {
    label: 'Nghiên cứu & phân tích',
  },
  {
    label: 'Lên outline bài viết',
  },
  {
    label: 'Viết bài',
  },
  {
    label: 'Xuất bản HTML',
  },
];

// ----------------------------------------------------------------------

type Props = {
  activeStep: number;
};

export function ContentStepper({ activeStep }: Props) {
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel
              sx={{
                cursor: 'default',
                '& .MuiStepLabel-label': {
                  fontSize: '0.875rem',
                  fontWeight: 500,
                },
                '& .MuiStepIcon-text': {
                  fill: 'white',
                },
                '& .MuiStepIcon-root': {
                  fontSize: '2rem',
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

export { steps };