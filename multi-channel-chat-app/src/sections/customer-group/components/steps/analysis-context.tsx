import {
  RHFTextField,
} from "@/components/hook-form";
import { Iconify } from "@/components/iconify";
import {  Stack } from "@mui/material";

export function AnalysisContext() {

  return (
    <Stack spacing={3}>
      <Stack spacing={2}>
        <RHFTextField
          name="ai_note_analysis_need"
          placeholder="Viết thêm mô tả chi tiết cho quá trình phân tích nhu cầu"
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
          name="who"
          label="Who"
          multiline
          minRows={2} 
          maxRows={3}
        />
        <RHFTextField
          name="what"
          label="What"
          multiline
          minRows={2} 
          maxRows={3}
        />
        <RHFTextField
          name="why"
          label="Why"
          multiline
          minRows={2} 
          maxRows={3}
        />
        <RHFTextField
          name="where"
          label="Where"
          multiline
          minRows={2} 
          maxRows={3}
        />
        <RHFTextField
          name="When"
          label="When"
          multiline
          minRows={2} 
          maxRows={3}
        />
        <RHFTextField
          name="How"
          label="How"
          multiline
          minRows={2} 
          maxRows={3}
        />

      </Stack>
    </Stack>
  );
}
