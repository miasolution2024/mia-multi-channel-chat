"use client";

import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useFormContext } from "react-hook-form";

import {
  RHFTextField,
  RHFAutocomplete,
  RHFSelect,
  RHFUpload,
  RHFCheckbox,
} from "@/components/hook-form";
import { Iconify } from "@/components/iconify";
import { ContentSelectionDialog, SelectedItemsTable } from "../index";
import { getCustomerGroups } from "@/actions/customer-group";
import { CustomerGroup } from "@/sections/customer-group/types";
import { getCustomerJourneys } from "@/actions/customer-journey";
import { CustomerJourney } from "@/sections/customer-journey/types";
import { MenuItem, SelectChangeEvent, Switch, Tooltip } from "@mui/material";
import { getOmniChannels } from "@/actions/omni-channels";
import { getServices } from "@/actions/services";
import { Services } from "@/sections/services/types";
import { CONFIG } from "@/config-global";
import { OmniChannel } from "@/sections/omni-channel/types";

// ----------------------------------------------------------------------

const PostOptions = [
  { id: 1, value: "social_post", label: "Bài viết xã hội", type: "" },
  { id: 2, value: "seo_post", label: "Bài viết SEO", type: "" },
  { id: 3, value: "facebook_post", label: "Bài viết Facebook", type: "" },
  { id: 4, value: "zalo_oa_post", label: "Bài viết Zalo", type: "Zalo" },
];

// ----------------------------------------------------------------------

// Extended File interface to include preview property
interface FileWithPreview extends File {
  preview?: string;
}

// ----------------------------------------------------------------------

export function StepResearch() {
  const [isShowVideo, setIsShowVideo] = useState(false);
  const [contentTonesDialogOpen, setContentTonesDialogOpen] = useState(false);
  const [aiRulesDialogOpen, setAiRulesDialogOpen] = useState(false);
  const [customerGroupsData, setCustomerGroupsData] = useState<CustomerGroup[]>(
    []
  );
  const [customerJourneysData, setCustomerJourneysData] = useState<
    CustomerJourney[]
  >([]);
  const [omniChannelsData, setOmniChannelsData] = useState<OmniChannel[]>([]);
  const [servicesData, setServicesData] = useState<Services[]>([]);
  const [source, setSource] = useState("");

  const { watch, setValue } = useFormContext();
  const contentTones = watch("content_tone") || [];
  const aiRules = watch("ai_rule_based") || [];
  const videoData = watch("video");

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

  // Check if video data exists and set isShowVideo accordingly
  useEffect(() => {
    if (
      videoData &&
      ((Array.isArray(videoData) && videoData.length > 0) ||
        (!Array.isArray(videoData) && videoData))
    ) {
      setIsShowVideo(true);
    }
  }, [videoData]);

  useEffect(() => {
    const fetchCustomerGroups = async () => {
      try {
        const response = await getCustomerGroups({
          page: 1,
          limit: 100,
        });
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

    const fetchOmniChannels = async () => {
      try {
        const response = await getOmniChannels({
          page: 1,
          limit: 100,
          source,
        });
        const filteredData = (response.data || []).filter(
          (item: OmniChannel) => item.page_name !== null
        );
        setOmniChannelsData(filteredData);
      } catch (error) {
        console.error("Error fetching omni channels:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await getServices(1, 100);
        setServicesData(response.data || []);
      } catch (error) {
        console.error("Error fetching customer services:", error);
      }
    };

    fetchCustomerGroups();
    fetchCustomerJourneys();
    fetchOmniChannels();
    fetchServices();
  }, [source]);
  const handleChangeShowVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.checked) {
      setValue("video", undefined);
    }

    setIsShowVideo(e.target.checked);
  };

  const isPostReels = watch("is_post_reels");

  return (
    <Stack spacing={3}>
      {/* AI Notes Input - Prominent at top */}
      <Box sx={{ mb: 3 }}>
        <RHFTextField
          name="ai_notes_make_outline"
          placeholder="Viết thêm mô tả chi tiết và lưu ý bài viết..."
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
      <Card>
        <CardHeader title="Chi tiết bài viết" sx={{ mb: 3 }} />
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <RHFTextField required name="topic" label="Chủ đề bài viết" />
            <RHFSelect
              required
              name="post_type"
              label="Loại bài viết"
              onChange={(e: SelectChangeEvent) => {
                const selectedValue = e.target.value;
                const selectedOption = PostOptions.find(
                  (item) => item.value === selectedValue
                );
                if (selectedOption) {
                  setSource(selectedOption.type);
                  setValue("post_type", selectedValue);
                }
              }}
            >
              {PostOptions.map((item) => (
                <MenuItem key={item.id} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <RHFTextField
              required
              name="main_seo_keyword"
              label="Từ khoá chính"
            />
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
          </Stack>
        </Stack>
      </Card>

      <Card>
        <CardHeader title="Thông tin khách hàng" sx={{ mb: 3 }} />
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <RHFAutocomplete
              name="customer_group"
              label="Nhóm khách hàng *"
              required
              sx={{ width: "100%" }}
              multiple
              disableCloseOnSelect
              options={customerGroupsData || []}
              getOptionLabel={(option: CustomerGroup) => option.name}
              getOptionValue={(option: CustomerGroup) => option.id}
              useValueAsId={true}
              isOptionEqualToValue={(
                option: CustomerGroup,
                value: CustomerGroup
              ) => option.id === value.id}
              renderOption={(
                props: React.HTMLAttributes<HTMLLIElement>,
                option: CustomerGroup
              ) => (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
            />

            <RHFSelect
              name="customer_journey"
              label="Giai đoạn khách hàng"
              required
              sx={{ width: "100%" }}
            >
              {customerJourneysData?.map((item: CustomerJourney) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <RHFAutocomplete
              name="services"
              label="Dịch vụ *"
              required
              sx={{ width: "100%" }}
              multiple
              disableCloseOnSelect
              options={servicesData || []}
              getOptionLabel={(option: Services) => option.name}
              getOptionValue={(option: Services) => option.id}
              useValueAsId={true}
              isOptionEqualToValue={(option: Services, value: Services) =>
                option.id === value.id
              }
              renderOption={(
                props: React.HTMLAttributes<HTMLLIElement>,
                option: Services
              ) => (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              )}
            />
            <RHFAutocomplete
              name="omni_channels"
              label="Kênh Omni *"
              required
              sx={{ width: "100%" }}
              multiple
              disableCloseOnSelect
              options={omniChannelsData || []}
              getOptionLabel={(option: OmniChannel) => option.page_name}
              getOptionValue={(option: OmniChannel) => option.id}
              useValueAsId={true}
              isOptionEqualToValue={(option: OmniChannel, value: OmniChannel) =>
                option.id === value.id
              }
              renderOption={(
                props: React.HTMLAttributes<HTMLLIElement>,
                option: OmniChannel
              ) => (
                <li {...props} key={option.id}>
                  {option.page_name}
                </li>
              )}
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

      {/* Video Upload Section */}
      <Stack alignItems={"center"} direction={"row"}>
        <Typography sx={{ fontWeight: 600 }}>
          Tạo bài viết chuyên sâu
        </Typography>
        <Switch checked={isShowVideo} onChange={handleChangeShowVideo} />
      </Stack>
      {isShowVideo ? (
        <Stack spacing={2} sx={{ marginTop: "-16px" }}>
          <Stack sx={{ width: "fit-content" }}>
            <Stack direction={"row"} alignItems={"center"}>
              <RHFCheckbox name="is_post_video" label="Bài đăng video" />
            </Stack>
            <Stack direction={"row"} alignItems={"center"}>
              <RHFCheckbox name="is_post_reels" label="Bài đăng reel" />
              {isPostReels && (
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ color: "error.main" }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    Lưu ý: Video đăng dưới dạng tin (reel) phải dưới 60 giây.
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
          <Card>
            <Stack direction="row" alignItems={"center"}>
              <CardHeader title="Video" sx={{ mb: 3 }} />
              <Tooltip
                title="Bạn có thể tải lên video và bước tiếp theo AI sẽ mô tả phù hợp cho video của bạn"
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: "14px",
                    },
                  },
                }}
              >
                <Iconify
                  icon="material-symbols:info-outline"
                  width={24}
                  height={24}
                  color="text.secondary"
                  sx={{ marginLeft: "-16px", cursor: "pointer" }}
                />
              </Tooltip>
            </Stack>
            <Divider />
            <Stack spacing={3} sx={{ p: 3 }}>
              <Box>
                <RHFUpload
                  name="video"
                  maxFiles={1}
                  maxSize={25 * 1024 * 1024} // 25MB in bytes
                  accept={{
                    "video/*": [".mp4", ".avi", ".mov"],
                  }}
                  helperText="Chỉ được chọn 1 video. Định dạng hỗ trợ: MP4, AVI, MOV. Kích thước tối đa: 25MB"
                  hidePreview
                />

                {/* Video Preview */}
                {Array.isArray(watch("video")) && watch("video").length > 0 && (
                  <Paper sx={{ p: 2, mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Video đã chọn
                    </Typography>
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                      <video
                        src={
                          typeof watch("video")[0] === "string"
                            ? `${CONFIG.serverUrl}/assets/${watch("video")[0]}`
                            : watch("video")[0] instanceof File
                            ? (watch("video")[0] as FileWithPreview).preview ||
                              URL.createObjectURL(watch("video")[0])
                            : ""
                        }
                        controls
                        style={{
                          width: "100%",
                          maxWidth: "300px",
                          height: "auto",
                          borderRadius: "8px",
                        }}
                      />
                      <Button
                        size="small"
                        color="error"
                        onClick={() => setValue("video", [])}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          minWidth: "auto",
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          bgcolor: "rgba(255, 255, 255, 0.9)",
                          "&:hover": {
                            bgcolor: "rgba(255, 255, 255, 1)",
                          },
                        }}
                      >
                        <Iconify icon="mingcute:close-line" width={16} />
                      </Button>
                    </Box>
                  </Paper>
                )}
              </Box>
            </Stack>
          </Card>
        </Stack>
      ) : (
        ""
      )}

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
