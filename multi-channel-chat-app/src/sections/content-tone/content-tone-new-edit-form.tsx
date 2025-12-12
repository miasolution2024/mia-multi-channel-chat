'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import { paths } from '@/routes/path';
import { toast } from '@/components/snackbar';
import { Form, Field } from '@/components/hook-form';

import { createContentTone, updateContentTone } from '@/actions/content-tone';
import { ContentTone, ContentToneFormData } from './types';

// ----------------------------------------------------------------------

const ContentToneSchema = zod.object({
  tone_description: zod.string().min(1, 'Mô tả là bắt buộc'),
});

// ----------------------------------------------------------------------

type Props = {
  currentTone?: ContentTone;
};

export function ContentToneNewEditForm({ currentTone }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      tone_description: currentTone?.tone_description || '',
    }),
    [currentTone]
  );

  const methods = useForm<ContentToneFormData>({
    resolver: zodResolver(ContentToneSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentTone) {
      reset(defaultValues);
    }
  }, [currentTone, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentTone) {
        await updateContentTone(currentTone.id, data);
      } else {
        await createContentTone(data);
      }
      
      toast.success(!currentTone ? 'Tạo văn phong AI thành công!' : 'Cập nhật văn phong AI thành công!');
      router.push(paths.dashboard.contentTone.root);
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra!');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card>
        <CardHeader
          title={!currentTone ? 'Thêm mới văn phong AI' : 'Chỉnh sửa văn phong AI'}
          sx={{ mb: 3 }}
        />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Field.Text
            name="tone_description"
            label="Mô tả"
            placeholder="Nhập mô tả văn phong AI..."
            multiline
            rows={4}
          />

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" loading={isSubmitting}>
              {!currentTone ? 'Tạo mới' : 'Lưu thay đổi'}
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Form>
  );
}