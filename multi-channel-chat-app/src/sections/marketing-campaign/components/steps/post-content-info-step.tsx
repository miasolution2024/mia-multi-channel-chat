import {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
} from "@/components/hook-form";
import { Iconify } from "@/components/iconify";
import { useGetCustomerJourneys } from "@/hooks/apis/use-get-customer-journeys";
import {
  ContentSelectionDialog,
  SelectedItemsTable,
} from "@/sections/content-assistant/components";
import { CustomerJourney } from "@/sections/customer-journey/types";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  MenuItem,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export function PostContentInfoStep() {
  const [contentTonesDialogOpen, setContentTonesDialogOpen] = useState(false);
  const [aiRulesDialogOpen, setAiRulesDialogOpen] = useState(false);

  const { data: customerJourneyData } = useGetCustomerJourneys({
    limit: 100,
  });
  const { watch, setValue } = useFormContext();
  const contentTones = watch("content_tone") || [];
  const aiRules = watch("ai_rule_based") || [];

  const handleContentTonesConfirm = (selectedIds: string[]) => {
    setValue("content_tone", selectedIds);
  };

  const handleAiRulesConfirm = (selectedIds: string[]) => {
    setValue("ai_rule_based", selectedIds);
  };

  const handleRemoveContentTone = (id: string) => {
    const updatedTones = contentTones.filter((toneId: string) => toneId !== id);
    setValue("content_tone", updatedTones);
  };

  const handleRemoveAiRule = (id: string) => {
    const updatedRules = aiRules.filter((ruleId: string) => ruleId !== id);
    setValue("ai_rule_based", updatedRules);
  };
  return (
    <Stack spacing={3}>
      <Stack spacing={2}>
        <RHFTextField
          name="ai_create_post_list_notes"
          placeholder="Viết thêm mô tả chi tiết và lưu ý khi tạo danh sách bài viết..."
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
        <RHFTextField required name="main_seo_keyword" label="Từ khoá chính" />
        <RHFAutocomplete
          sx={{ width: "100%" }}
          name="secondary_seo_keywords"
          label="Từ khoá phụ"
          placeholder="+ Thêm từ khoá"
          multiple
          freeSolo
          disableCloseOnSelect
          options={[]}
          getOptionLabel={(option: string) => option}
          renderOption={(
            props: React.HTMLAttributes<HTMLLIElement>,
            option: string
          ) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
        />
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <RHFSelect
            name="customer_journey"
            label="Giai đoạn khách hàng"
            required
            sx={{ width: "100%" }}
          >
            {customerJourneyData?.map((item: CustomerJourney) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFTextField
            required
            type="number"
            name="need_create_post_amount"
            label="Số lượng bài viết cần tạo"
          />
        </Stack>

        <Card>
          <CardHeader
            title="Văn phong AI"
            action={
              <Button
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => setContentTonesDialogOpen(true)}
              >
                Thêm mới
              </Button>
            }
            sx={{ mb: 3 }}
          />
          <Divider />
          <Box sx={{ p: 3 }}>
            <SelectedItemsTable
              type="content_tone"
              selectedIds={contentTones}
              onRemove={handleRemoveContentTone}
            />
          </Box>
        </Card>

        <Card>
          <CardHeader
            title="Quy tắc AI"
            action={
              <Button
                variant="outlined"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => setAiRulesDialogOpen(true)}
              >
                Thêm mới
              </Button>
            }
            sx={{ mb: 3 }}
          />
          <Divider />
          <Box sx={{ p: 3 }}>
            <SelectedItemsTable
              type="ai_rule_based"
              selectedIds={aiRules}
              onRemove={handleRemoveAiRule}
            />
          </Box>
        </Card>
      </Stack>
      {/* Content Tones Selection Dialog */}
      <ContentSelectionDialog
        open={contentTonesDialogOpen}
        onClose={() => setContentTonesDialogOpen(false)}
        type="content_tone"
        selectedIds={contentTones}
        onConfirm={handleContentTonesConfirm}
      />

      {/* AI Rules Selection Dialog */}
      <ContentSelectionDialog
        open={aiRulesDialogOpen}
        onClose={() => setAiRulesDialogOpen(false)}
        type="ai_rule_based"
        selectedIds={aiRules}
        onConfirm={handleAiRulesConfirm}
      />
    </Stack>
  );
}
