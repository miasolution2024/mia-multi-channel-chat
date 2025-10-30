'use client';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import {
  Card,
  Stack,
  Button,
  CardHeader,
  Box,
  Divider,
  MenuItem,
} from '@mui/material';

import { paths } from '@/routes/path';
import { useBoolean } from '@/hooks/use-boolean';
import { toast } from '@/components/snackbar';
import { Form, RHFSelect, RHFTextField } from '@/components/hook-form';
import { CustomerJourneyProcess, CustomerJourneyProcessFormData } from '../types';
import { CUSTOMER_JOURNEY_PROCESS_STATUS } from '@/constants/customer-journey-process';
import { createCustomerJourneyProcess, updateCustomerJourneyProcess } from '@/actions/customer-journey-process';
import { Iconify } from '@/components/iconify';
import { CustomerJourneySelectionDialog } from './customer-journey-selection-dialog';
import { SelectedItemsTable } from './selected-items-table';


// ----------------------------------------------------------------------

type Props = {
  customerJourneyProcess?: CustomerJourneyProcess;
};

const CustomerJourneyProcessSchema = zod.object({
  name: zod.string().min(1, 'Tên là bắt buộc'),
  status: zod.nativeEnum(CUSTOMER_JOURNEY_PROCESS_STATUS),
  customer_journey: zod.array(zod.number().min(1, 'Chọn ít nhất 1 hành trình')),


});

export function CustomerJourneyProcessForm({ customerJourneyProcess }: Props) {
  const router = useRouter();
  const loadingSave = useBoolean();
  const createCustomerJourneyDialogOpen = useBoolean();


  const defaultValues = useMemo(
    () => ({
      name: customerJourneyProcess?.name || '',
      status: customerJourneyProcess?.status || CUSTOMER_JOURNEY_PROCESS_STATUS.DRAFT,
      customer_journey: customerJourneyProcess?.customer_journey?.map((item) => item.customer_journey_id.id) || [],
    }),
    [customerJourneyProcess]
  );

  const methods = useForm<CustomerJourneyProcessFormData>({
    resolver: zodResolver(CustomerJourneyProcessSchema),
    defaultValues,
  });

  const {watch, setValue} = methods;
  const customerJourneys = useMemo(() => {
    const journeys = watch("customer_journey") || [];
    console.log("🔍 [customerJourneys] Current customer journeys:", journeys);
    return journeys;
  }, [watch]);

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    // check if customer_journey is empty
    if (data.customer_journey.length === 0) {
      toast.error('Chọn ít nhất 1 hành trình!');
      return;
    }
    loadingSave.onTrue();

    try {
      if (customerJourneyProcess) {
        await updateCustomerJourneyProcess(customerJourneyProcess.id, data);
      } else {
        await createCustomerJourneyProcess(data);
      }
      
      reset();
      toast.success(customerJourneyProcess ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
      router.push(paths.dashboard.customerJourneyProcess.root);
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra!');
    } finally {
      loadingSave.onFalse();
    }
  });

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.customerJourneyProcess.root);
  }, [router]);

  const handleRemoveCustomerJourney = useCallback((id: string) => {
    console.log("🗑️ [handleRemoveCustomerJourney] Removing ID:", id);
    console.log("📝 [handleRemoveCustomerJourney] Current customer journeys before removal:", customerJourneys);
    const updatedJourneys = customerJourneys.filter(journeyId => journeyId.toString() !== id);
    console.log("🔄 [handleRemoveCustomerJourney] Updated journeys after removal:", updatedJourneys);
    setValue("customer_journey", updatedJourneys);
    console.log("✅ [handleRemoveCustomerJourney] Form value after setValue:", watch("customer_journey"));
  }, [customerJourneys, setValue, watch]);

  const handleConfirmCustomerJourneys = useCallback((selectedIds: string[]) => {
    console.log("🚀 [handleConfirmCustomerJourneys] Received selectedIds:", selectedIds);
    const numericIds = selectedIds.map(id => Number(id));
    console.log("🔢 [handleConfirmCustomerJourneys] Converted to numeric IDs:", numericIds);
    console.log("📝 [handleConfirmCustomerJourneys] Current form value before setValue:", watch("customer_journey"));
    setValue("customer_journey", numericIds);
    console.log("✅ [handleConfirmCustomerJourneys] Form value after setValue:", watch("customer_journey"));
    createCustomerJourneyDialogOpen.onFalse();
  }, [setValue, createCustomerJourneyDialogOpen, watch]);

  const statusOptions = [
    {
      value: CUSTOMER_JOURNEY_PROCESS_STATUS.DRAFT,
      label: "Nháp",
    },
  ]

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader
          title={customerJourneyProcess ? 'Chỉnh sửa nhóm hành trình' : 'Tạo nhóm hành trình mới'}
        />

        <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ p: 3 }}>
          <RHFTextField
            name="name"
            label="Tên nhóm hành trình"
            placeholder="Nhập tên nhóm hành trình..."
            sx={{width: "70%"}}
          />

         <RHFSelect
          name="status"
          label="Trạng thái"
          sx={{width: "30%"}}
        >
          {statusOptions.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}

        </RHFSelect>
        
        </Stack>

         <Card>
        <CardHeader
          title="Hành trình"
          action={
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => createCustomerJourneyDialogOpen.onTrue()}
            >
              Thêm hành trình
            </Button>
          }
          sx={{ mb: 3 }}
        />
        <Divider />
        <Box sx={{ p: 3 }}>
          {(() => {
            const selectedIds = customerJourneys.map(id => id.toString());
            console.log("🎯 [SelectedItemsTable] Rendering with selectedIds:", selectedIds);
            console.log("🎯 [SelectedItemsTable] customerJourneys source:", customerJourneys);
            return (
              <SelectedItemsTable
                selectedIds={selectedIds}
                onRemove={handleRemoveCustomerJourney}  
              />
            );
          })()}
        </Box>
      </Card>

        <Stack
          spacing={2}
          direction="row"
          justifyContent="flex-end"
          sx={{ p: 3 }}
        >
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Hủy
          </Button>

          <Button
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {customerJourneyProcess ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Stack>
      </Card>
      <CustomerJourneySelectionDialog
        open={createCustomerJourneyDialogOpen.value}
        onClose={() => createCustomerJourneyDialogOpen.onFalse()}
        selectedIds={customerJourneys.map(id => id.toString())}
        onConfirm={handleConfirmCustomerJourneys}
      />
    </Form>
  );
}