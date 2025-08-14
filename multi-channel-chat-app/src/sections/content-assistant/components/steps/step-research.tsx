"use client";

import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useFormContext } from "react-hook-form";

import {
  RHFTextField,
  RHFAutocomplete,
  RHFMultiSelect,
} from "@/components/hook-form";
import { Iconify } from "@/components/iconify";
import { ContentSelectionDialog, SelectedItemsTable } from "../index";
import { getCustomerGroups } from "@/actions/customer-group";
import { CustomerGroup } from "@/sections/customer-group/types";
import { getCustomerJourneys } from "@/actions/customer-journey";
import { CustomerJourney } from "@/sections/customer-journey/types";

// ----------------------------------------------------------------------

export function StepResearch() {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [contentTonesDialogOpen, setContentTonesDialogOpen] = useState(false);
  const [aiRulesDialogOpen, setAiRulesDialogOpen] = useState(false);
  const [customerGroupsData, setCustomerGroupsData] = useState<CustomerGroup[]>(
    []
  );
  const [customerJourneysData, setCustomerJourneysData] = useState<
    CustomerJourney[]
  >([]);

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

  useEffect(() => {
    const fetchCustomerGroups = async () => {
      try {
        const response = await getCustomerGroups(1, 100);
        setCustomerGroupsData(response.data || []);
      } catch (error) {
        console.error("Error fetching customer groups:", error);
      }
    };

    const fetchCustomerJourneys = async () => {
      try {
        const response = await getCustomerJourneys(1, 100);
        setCustomerJourneysData(response.data || []);
      } catch (error) {
        console.error("Error fetching customer journeys:", error);
      }
    };

    fetchCustomerGroups();
    fetchCustomerJourneys();
  }, []);

  return (
    <Stack spacing={3}>
      {/* AI Notes Input - Prominent at top */}
      <Box sx={{ mb: 3 }}>
        <RHFTextField
          name="additional_notes_step_1"
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
      <Card>
        <CardHeader title="Chi tiết bài viết" sx={{ mb: 3 }} />
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <RHFTextField required name="topic" label="Chủ đề bài viết" />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <RHFTextField
              required
              name="main_seo_keyword"
              label="Từ khoá SEO chính"
            />
            <RHFAutocomplete
              sx={{ width: "100%" }}
              name="secondary_seo_keywords"
              label="Từ khoá SEO phụ"
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
          </Stack>
        </Stack>
      </Card>

      <Card>
        <CardHeader title="Thông tin khách hàng" sx={{ mb: 3 }} />
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <RHFMultiSelect
              name="customer_group"
              label="Nhóm khách hàng"
              required
              sx={{ width: "100%" }}
              options={customerGroupsData?.map((item: CustomerGroup) => ({
                value: item.id,
                label: item.name,
              }))}
            />

            <RHFMultiSelect
              name="customer_journey"
              label="Hành trình khách hàng"
              required
              sx={{ width: "100%" }}
              options={customerJourneysData?.map((item: CustomerJourney) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </Stack>
        </Stack>
      </Card>

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
