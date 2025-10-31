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
import { Form, RHFTextField, RHFAutocomplete } from '@/components/hook-form';
import { CustomerInsight, CustomerInsightFormData } from '../types';
import { createCustomerInsight, updateCustomerInsight, createCustomerGroupCustomerJourney, updateCustomerGroupCustomerJourney } from '@/actions/customer-insight';
import { useGetCustomerJourneys } from '@/hooks/apis/use-get-customer-journeys';
import { useGetCustomerGroups } from '@/hooks/apis/use-get-customer-groups';

// Define proper types for the options
interface OptionType {
  label: string;
  value: number;
}


// ----------------------------------------------------------------------

type Props = {
  customerInsight?: CustomerInsight;
};

const CustomerInsightSchema = zod.object({
  content: zod.string().min(1, 'Nội dung là bắt buộc'),
  customer_journey_id: zod.string().min(1, 'Hành trình khách hàng là bắt buộc'),
  customer_group_id: zod.string().min(1, 'Nhóm khách hàng là bắt buộc'),
});

export function CustomerInsightForm({ customerInsight }: Props) {
  const router = useRouter();
  const loadingSave = useBoolean();

  const { data: customerJourneys = [] } = useGetCustomerJourneys({});
  const { data: customerGroups = [] } = useGetCustomerGroups({});

  const defaultValues = useMemo(
    () => ({
      content: customerInsight?.content || '',
      customer_journey_id: customerInsight?.['493d68fc']?.customer_journey_id?.id?.toString() || undefined,
      customer_group_id: customerInsight?.['6ddb5bbb']?.customer_group_id?.id?.toString() || undefined,
    }),
    [customerInsight]
  );

  const methods = useForm<CustomerInsightFormData>({
    resolver: zodResolver(CustomerInsightSchema),
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
      if (customerInsight) {
        // Check if customer_journey_id or customer_group_id changed
        const currentCustomerJourneyId = customerInsight["493d68fc"]?.customer_journey_id?.id?.toString() || '';
        const currentCustomerGroupId = customerInsight["6ddb5bbb"]?.customer_group_id?.id?.toString() || '';
        
        const journeyChanged = data.customer_journey_id !== currentCustomerJourneyId;
        const groupChanged = data.customer_group_id !== currentCustomerGroupId;
        
        if (journeyChanged || groupChanged) {
          // Update customer_group_customer_journey relationship
          const updateRelationshipData = {
            customer_journey_id: parseInt(data.customer_journey_id),
            customer_group_id: parseInt(data.customer_group_id),
          };
          
          await updateCustomerGroupCustomerJourney(customerInsight.customer_group_customer_journey, updateRelationshipData);
        }
        
        // Check if content changed
        if (data.content !== customerInsight.content) {
          // Update customer insight content
          await updateCustomerInsight(customerInsight.id, { content: data.content });
        }
      } else {
        // Step 1: Create customer_group_customer_journey relationship first
        const customerGroupCustomerJourneyData = {
          customer_group_id: parseInt(data.customer_group_id),
          customer_journey_id: parseInt(data.customer_journey_id),
        };
        
        const relationshipResponse = await createCustomerGroupCustomerJourney(customerGroupCustomerJourneyData);
        
        // Step 2: Create customer insight with the returned relationship ID
        const createData = {
          content: data.content,
          customer_group_customer_journey: relationshipResponse.data.id,
        };
        
        await createCustomerInsight(createData);
      }
      
      reset();
      toast.success(customerInsight ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
      router.push(paths.dashboard.customerInsight.root);
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra!');
    } finally {
      loadingSave.onFalse();
    }
  });

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.customerInsight.root);
  }, [router]);

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader
          title={customerInsight ? 'Chỉnh sửa hành vi khách hàng' : 'Tạo hành vi khách hàng mới'}
        />

        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField
            name="content"
            label="Nội dung"
            multiline
            rows={4}
            placeholder="Nhập nội dung hành vi khách hàng..."
          />

          <RHFAutocomplete
            name="customer_journey_id"
            label="Hành trình khách hàng"
            placeholder="Chọn hành trình khách hàng"
            disableClearable
            options={customerJourneys.map((journey) => ({
              label: journey.name,
              value: journey.id,
            }))}
            getOptionLabel={(option: OptionType | string) => {
              if (typeof option === 'string') return '';
              return option.label;
            }}
            getOptionValue={(option: OptionType) => option.value.toString()}
            useValueAsId={true}
            isOptionEqualToValue={(option: OptionType, value: OptionType) => option.value === value.value}
          />

          <RHFAutocomplete
            name="customer_group_id"
            label="Nhóm khách hàng"
            placeholder="Chọn nhóm khách hàng"
            disableClearable
            options={customerGroups.map((group) => ({
              label: group.name,
              value: group.id,
            }))}
            getOptionLabel={(option: OptionType | string) => {
              if (typeof option === 'string') return '';
              return option.label;
            }}
            getOptionValue={(option: OptionType) => option.value.toString()}
            useValueAsId={true}
            isOptionEqualToValue={(option: OptionType, value: OptionType) => option.value === value.value}
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
            {customerInsight ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}