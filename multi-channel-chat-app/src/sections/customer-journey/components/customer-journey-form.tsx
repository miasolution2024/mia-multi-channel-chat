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
} from '@mui/material';

import { paths } from '@/routes/path';
import { useBoolean } from '@/hooks/use-boolean';
import { toast } from '@/components/snackbar';
import { Form, RHFSwitch, RHFTextField } from '@/components/hook-form';
import { CustomerJourney, CustomerJourneyFormData } from '../types';
import { createCustomerJourney, updateCustomerJourney } from '@/actions/customer-journey';


// ----------------------------------------------------------------------

type Props = {
  customerJourney?: CustomerJourney;
};

const CustomerJourneySchema = zod.object({
  name: zod.string().min(1, 'Tên là bắt buộc'),
  description: zod.string(),
  active: zod.boolean(),


});

export function CustomerJourneyForm({ customerJourney }: Props) {
  const router = useRouter();
  const loadingSave = useBoolean();

  const defaultValues = useMemo(
    () => ({
      name: customerJourney?.name || '',
      description: customerJourney?.description || '',
      active: customerJourney?.active || true,
    }),
    [customerJourney]
  );

  const methods = useForm<CustomerJourneyFormData>({
    resolver: zodResolver(CustomerJourneySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    loadingSave.onTrue();

    try {
      if (customerJourney) {
        await updateCustomerJourney(customerJourney.id, data);
      } else {
        await createCustomerJourney(data);
      }
      
      reset();
      toast.success(customerJourney ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
      router.push(paths.dashboard.customerJourney.root);
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra!');
    } finally {
      loadingSave.onFalse();
    }
  });

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.customerJourney.root);
  }, [router]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader
          title={customerJourney ? 'Chỉnh sửa hành trình' : 'Tạo hành trình mới'}
        />

        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField
            name="name"
            label="Tên hành trình"
            placeholder="Nhập tên hành trình..."
          />

          <RHFTextField
            name="description"
            label="Mô tả hành trình"
            multiline
            rows={4}
            placeholder="Nhập mô tả hành trình..."
          />
          <RHFSwitch
            name="active"
            label="Trạng thái"
          />
        </Stack>

        <Stack
          spacing={2}
          direction="row"
          justifyContent="flex-end"
          sx={{ p: 3, pt: 0 }}
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
            {customerJourney ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}