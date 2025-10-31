import {
  RHFAutocomplete,
  RHFDatePicker,
  RHFSelect,
  RHFTextField,
} from "@/components/hook-form";
import { Iconify } from "@/components/iconify";
import { CAMPAIGN_STATUS } from "@/constants/marketing-compaign";
import { useGetCustomerGroups } from "@/hooks/apis/use-get-customer-groups";
import { useGetOmniChannels } from "@/hooks/apis/use-get-omni-channels";
import { useGetServices } from "@/hooks/apis/use-get-services";
import { CustomerGroup } from "@/sections/customer-group/types";
import { OmniChannel } from "@/sections/omni-channel/types";
import { Services } from "@/sections/services/types";
import { MenuItem, Stack } from "@mui/material";

export function CampaignInfoStep() {
  const { data: customerGroupsData } = useGetCustomerGroups({
    limit: 100,
  });

  const { data: servicesData } = useGetServices({
    limit: 100,
  });

  const { data: omniChannelsData } = useGetOmniChannels({
    limit: 100,
  });
  return (
    <Stack spacing={3}>
      <Stack spacing={2}>
        <RHFTextField
          name="ai_create_post_info_notes"
          placeholder="Viết thêm mô tả thông tin bài viết..."
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
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <RHFTextField
            required
            name="name"
            label="Tên chiến dịch"
            sx={{ width: "100%" }}
          />
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ width: "100%" }}
          >
            <RHFTextField
              required
              type="number"
              name="target_post_count"
              label="Số bài viết mục tiêu"
            />
            <RHFSelect required name="status" label="Trạng thái">
              {[
                { value: CAMPAIGN_STATUS.TODO, label: "Khởi tạo" },
                { value: CAMPAIGN_STATUS.IN_PROGRESS, label: "Đang chạy" },
                { value: CAMPAIGN_STATUS.COMPLETED, label: "Hoàn tất" },
              ].map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
        </Stack>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <RHFDatePicker required name="start_date" label="Ngày bắt đầu" />
          <RHFDatePicker required name="end_date" label="Ngày kết thúc" />
        </Stack>
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
              option: CustomerGroup
            ) => (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )}
          />
        </Stack>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <RHFSelect required name="post_type" label="Loại bài viết">
            {[
              { value: "social_post", label: "Bài viết xã hội" },
              { value: "seo_post", label: "Bài viết SEO" },
              { value: "facebook_post", label: "Bài viết Facebook" },
            ].map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFSelect
            name="omni_channels"
            label="Omni channel"
            required
            sx={{ width: "100%" }}
          >
            {omniChannelsData?.map((item: OmniChannel) => (
              <MenuItem key={item.id} value={item.id}>
                {item.page_name}
              </MenuItem>
            ))}
          </RHFSelect>
        </Stack>
        <RHFTextField required name="post_topic" label="Chủ đề bài viết" />
        <RHFTextField
          required
          name="objectives"
          label="Mục tiêu chiến dịch"
          multiline
          minRows={1}
          maxRows={4}
        />
        <RHFTextField
          name="description"
          label="Mô tả"
          multiline
          minRows={1}
          maxRows={4}
        />
      </Stack>
    </Stack>
  );
}
