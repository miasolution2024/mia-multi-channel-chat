import {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
} from "@/components/hook-form";
import { Iconify } from "@/components/iconify";
import { CUSTOMER_JOURNEY_PROCESS_STATUS } from "@/constants/customer-journey-process";
import { useGetCustomerJourneyProcess } from "@/hooks/apis/use-get-customer-journey-process";
import { useGetServices } from "@/hooks/apis/use-get-services";
import { CustomerGroup } from "@/sections/customer-group/types";
import { Services } from "@/sections/services/types";
import { MenuItem, Stack } from "@mui/material";

export function ResearchCustomer() {

  const { data: servicesData } = useGetServices({
    limit: 100,
  });
  const {data: customerJourneyProcessData} = useGetCustomerJourneyProcess({
    limit: 100,
    page: 1,
    status: CUSTOMER_JOURNEY_PROCESS_STATUS.PUBLISHED,
  });

  return (
    <Stack spacing={3}>
      <Stack spacing={2}>
        <RHFTextField
          name="ai_search_customer_info"
          placeholder="Viết thêm mô tả chi tiết khi phân tích 5W1H"
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
            label="Tên nhóm khách hàng"
            sx={{ width: "100%" }}
          />
        </Stack>
        
          <RHFSelect required name="customer_journey_process" label="Hành trình khách hàng">
            {customerJourneyProcessData?.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </RHFSelect>
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
        <RHFTextField
          type="textarea"
          name="descriptions"
          label="Mô tả"
          multiline
          minRows={2} 
          maxRows={3}
        />
      </Stack>
    </Stack>
  );
}
