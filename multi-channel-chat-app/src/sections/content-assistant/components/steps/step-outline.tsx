"use client";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

import { RHFTextField, RHFEditor } from "@/components/hook-form";
import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

export function StepOutline() {
  return (
    <Stack spacing={3}>
      {/* AI Notes Input - Prominent at top */}
      <Box sx={{ mb: 3 }}>
        <RHFTextField
          name="ai_notes_write_article"
          placeholder="Viết thêm mô tả chi tiết khi tạo nội dung bài viết"
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
      </Box>
      <Divider />
      <RHFTextField
        name="post_goal"
        label="Mục tiêu bài viết"
        placeholder="Mục tiêu bài viết"
        required
      />
      <RHFTextField
        name="post_notes"
        label="Lưu ý bài viết"
        placeholder="Lưu ý bài viết"
      />
      <Card>
        <CardHeader title="Dàn ý bài viết" sx={{ mb: 3 }} />
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFEditor
            name="outline_post"
            label="Dàn ý bài viết"
            placeholder="Dàn ý bài viết"
            required
          />
        </Stack>
      </Card>
    </Stack>
  );
}
