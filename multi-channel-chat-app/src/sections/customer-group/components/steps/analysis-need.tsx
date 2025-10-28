import {
  RHFTextField,
} from "@/components/hook-form";
import { Iconify } from "@/components/iconify";
import {  Stack } from "@mui/material";

export function AnalysisNeed() {

  return (
    <Stack spacing={3}>
      <Stack spacing={2}>
        <RHFTextField
          name="ai_note_propose_solution"
          placeholder="Viết thêm mô tả chi tiết khi phân tích giải pháp"
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
        <RHFTextField
          name="context"
          label="Context"
          multiline
          minRows={2} 
          maxRows={3}
        />
        <RHFTextField
          name="main_job"
          label="Main Job"
          multiline
          minRows={2} 
          maxRows={3}
        />
        <RHFTextField
          name="related_job"
          label="Related Job"
          multiline
          minRows={2} 
          maxRows={3}
        />
        <RHFTextField
          name="emotional_job"
          label="Emotional Job"
          multiline
          minRows={2} 
          maxRows={3}
        />
      </Stack>
    </Stack>
  );
}
