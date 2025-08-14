"use client";

import { useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

import { RHFTextField, RHFEditor } from "@/components/hook-form";
import { Iconify } from "@/components/iconify";

// ----------------------------------------------------------------------

export function StepOutline() {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);

  return (
    <Stack spacing={3}>
      {/* AI Notes Input - Prominent at top */}
      <Box sx={{ mb: 3 }}>
        <RHFTextField
          name="additional_notes_step_2"
          placeholder={
            isNotesExpanded
              ? "Viết thêm mô tả chi tiết và lưu ý bài viết"
              : "💬 Nhấp để thêm yêu cầu chi tiết..."
          }
          multiline={isNotesExpanded}
          rows={isNotesExpanded ? 4 : 1}
          onClick={() => setIsNotesExpanded(true)}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            if (!e.target.value) {
              setIsNotesExpanded(false);
            }
          }}
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
              alignItems: isNotesExpanded ? "flex-start" : "center",
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              transition: "all 0.3s ease",
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
