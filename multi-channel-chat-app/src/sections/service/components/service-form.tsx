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
  Autocomplete,
  TextField,
  Chip,
} from '@mui/material';

import { paths } from '@/routes/path';
import { useBoolean } from '@/hooks/use-boolean';
import { toast } from '@/components/snackbar';
import { Form, RHFTextField } from '@/components/hook-form';
import { Service, ServiceFormData } from '../types';
import { createService, updateService } from '@/actions/service';
import { useGetOmniChannels } from '@/hooks/apis/use-get-omni-channels';

// ----------------------------------------------------------------------

type Props = {
  service?: Service;
};

const ServiceSchema = zod.object({
  name: zod.string().min(1, 'Tên dịch vụ là bắt buộc'),
  description: zod.string().optional(),
  price: zod.string().min(1, 'Giá dịch vụ là bắt buộc'),
  duration: zod.number().min(0, 'Thời lượng phải lớn hơn hoặc bằng 0'),
  note: zod.string().optional(),
  omni_channels: zod.array(zod.number()).optional(),
});

export function ServiceForm({ service }: Props) {
  const router = useRouter();
  const loadingSave = useBoolean();

  // Get omni channels for selection
  const { data: omniChannels, isLoading: omniChannelsLoading } = useGetOmniChannels({
    limit: 1000,
  });

  const defaultValues = useMemo(
    () => ({
      name: service?.name || '',
      description: service?.description || '',
      price: service?.price || '',
      duration: service?.duration || 0,
      note: service?.note || '',
      omni_channels: service?.omni_channels?.map((channel) => 
        channel.omni_channels_id?.id
      ).filter(Boolean) || [],
    }),
    [service]
  );

  const methods = useForm<ServiceFormData>({
    resolver: zodResolver(ServiceSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const watchedOmniChannels = watch('omni_channels') || [];

  const onSubmit = handleSubmit(async (data) => {
    loadingSave.onTrue();

    try {
      if (service) {
        await updateService(service.id, data);
      } else {
        const createPayload = {
          name: data.name,
          description: data.description,
          price: data.price,
          duration: data.duration,
          note: data.note,
          omni_channels: {
            create: data.omni_channels?.map((channelId: number) => ({
              services_id: '+',
              omni_channels_id: { id: channelId },
            })) || [],
            update: [],
            delete: [],
          },
        };
        await createService(createPayload as unknown as ServiceFormData);
      }
      
      reset();
      toast.success(service ? 'Cập nhật dịch vụ thành công!' : 'Tạo dịch vụ mới thành công!');
      router.push(paths.dashboard.service.root);
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra!');
    } finally {
      loadingSave.onFalse();
    }
  });

  const handleCancel = useCallback(() => {
    router.push(paths.dashboard.service.root);
  }, [router]);

  const handleOmniChannelsChange = useCallback(
    (event: React.SyntheticEvent, newValue: typeof omniChannels) => {
      const channelIds = newValue.map((channel) => channel.id);
      setValue('omni_channels', channelIds);
    },
    [setValue]
  );

  const selectedOmniChannels = omniChannels.filter((channel) =>
    watchedOmniChannels.includes(channel.id)
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader
          title={service ? 'Chỉnh sửa dịch vụ' : 'Tạo dịch vụ mới'}
        />

        <Stack spacing={3} sx={{ p: 3 }}>
          <RHFTextField
            name="name"
            label="Tên dịch vụ"
            placeholder="Nhập tên dịch vụ..."
          />

          <RHFTextField
            name="description"
            label="Mô tả dịch vụ"
            multiline
            rows={4}
            placeholder="Nhập mô tả dịch vụ..."
          />

          <RHFTextField
            name="price"
            label="Giá dịch vụ"
            placeholder="Nhập giá dịch vụ..."
          />

          <RHFTextField
            name="duration"
            label="Thời lượng (phút)"
            type="number"
            placeholder="Nhập thời lượng..."
          />

          <RHFTextField
            name="note"
            label="Ghi chú"
            multiline
            rows={3}
            placeholder="Nhập ghi chú..."
          />

          <Autocomplete
            multiple
            options={omniChannels}
            value={selectedOmniChannels}
            onChange={handleOmniChannelsChange}
            getOptionLabel={(option) => option.page_name || option.source || ''}
            loading={omniChannelsLoading}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option.id}
                  label={option.page_name || option.source}
                  size="small"
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Kênh Omni"
                placeholder="Chọn kênh omni..."
              />
            )}
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
            {service ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Stack>
      </Card>
    </Form>
  );
}